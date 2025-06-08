import chatService from "@/services/api/chatService";
import imageService from "@/services/media/imageService";
import { notifyError } from "@/utils/Utils";
import { useIntl } from "react-intl";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";


export const useSendTextMessage = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();
    return useMutation(
        async ({ message = '', files = [], conversationId, senderId, receiverUserId }) => {
            let responseImage = [];
            let responseText = null;
            console.log('files', files);

            // Xử lý tin nhắn hình ảnh trước (nếu có)
            if (files.length > 0) {
                // Xử lý tuần tự để tránh vấn đề với cloudinary
                for (const file of files) {
                    try {
                        const uploadedFile = await imageService.uploadToCloudinary(file, 'chat');
                        const mediaFileData = {
                            file_path: uploadedFile.url,
                            file_type: uploadedFile.mime,
                            file_size: uploadedFile.size,
                        };

                        const mediaFile = await imageService.createMediaFileRecord(mediaFileData);
                        console.log('mediaFile', mediaFile);

                        const imageData = {
                            content: '',
                            conversation_id: conversationId,
                            sender_id: senderId,
                            media_id: mediaFile.data.documentId
                        };

                        const response = await chatService.sendTextMessage(imageData);
                        await chatService.createStatusMessage({
                            message_id: response.data.documentId,
                            receiver_user_id: receiverUserId,
                            is_read: false,
                            is_delivered: true,
                        });

                        responseImage.push(response);
                    } catch (error) {
                        console.error('Error uploading image:', error);
                    }
                }
            }

            // Xử lý tin nhắn văn bản sau (nếu có)
            if (message) {
                const data = {
                    content: message,
                    conversation_id: conversationId,
                    sender_id: senderId
                };

                const response = await chatService.sendTextMessage(data);
                console.log('response send text ', response);

                await chatService.createStatusMessage({
                    message_id: response.data.documentId,
                    receiver_user_id: receiverUserId,
                    is_read: false,
                    is_delivered: true,
                });

                responseText = response;
            }

            return { responseImage, responseText };
        },
        {
            onSuccess: (data, variables) => {
                // Thay vì invalidate toàn bộ query, cập nhật cache trực tiếp
                queryClient.setQueryData(['chat-messages', variables.conversationId], (oldData) => {
                    if (!oldData) return oldData;

                    // Tạo bản copy của oldData
                    const newData = JSON.parse(JSON.stringify(oldData));

                    // Thêm tin nhắn mới vào trang cuối cùng
                    if (newData.pages && newData.pages.length > 0) {
                        const lastPage = newData.pages[newData.pages.length - 1];

                        // Thêm tin nhắn văn bản nếu có
                        if (data.responseText && data.responseText.data) {
                            lastPage.push(data.responseText.data);
                        }

                        // Thêm tin nhắn hình ảnh nếu có
                        if (data.responseImage && data.responseImage.length > 0) {
                            data.responseImage.forEach(img => {
                                if (img && img.data) {
                                    lastPage.push(img.data);
                                }
                            });
                        }
                    }

                    return newData;
                });

                // Vẫn cập nhật danh sách chat nhưng không gây ảnh hưởng đến view messages
                queryClient.invalidateQueries(['chat-friends']);
                queryClient.invalidateQueries(['chat-by-alias']);
            },
            onError: (error) => {
                console.error("Error sending text message:", error);
                notifyError(intl.formatMessage({ id: 'social.chat.message_sending_failed' }));
            }
        }
    )
}

export const useUpdateMessageStatus = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();
    return useMutation(async ({ messageId, status }) => {
        await chatService.updateMessageStatus({
            documentId: messageId,
            is_read: status
        });
    },
        {
            onSuccess: () => {
                // Invalidate the chat-friends query to update unread counts
                queryClient.invalidateQueries(['chat-friends']);
                // Also invalidate chat-by-alias to update the current chat's unread count
                queryClient.invalidateQueries(['chat-by-alias']);
            },
            onError: (error) => {
                console.error("Error updating message status:", error);
                toast.dismiss();

                notifyError(intl.formatMessage({ id: 'social.chat.message_status_update_failed' }));
                throw error;
            }
        }
    )
}


