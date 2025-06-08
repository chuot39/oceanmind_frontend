import { notifyError, notifyWarning, notifySuccess } from "@/utils/Utils";
import { checkFriendshipStatus, getConversation } from "@/helpers/userHelper";
import { useCreateNotification, useCreateUserNotification } from "../../components/mutationHooks";
import { getNotificationContent } from "@/helpers/systemHelper";
import socket, { sendNotification } from "@/views/user/social/chat/socket";
import { toast } from 'react-toastify';

// Hằng số cho tên sự kiện
export const NOTIFICATION_EVENT = 'ocean_mind_new_notification';

/**
 * Xử lý gửi/chấp nhận yêu cầu kết bạn
 * @param {Object} props Các tham số cần thiết
 * @returns {Promise<void>}
 */
export const handleSendFriendRequest = async ({
    userId,
    friendId,
    status,
    setLoading,
    setRequestSent,
    sendFriendRequestMutation,
    createNotification,
    createUserNotification
}) => {
    setLoading?.(true);

    try {
        // Kiểm tra tình trạng kết bạn trước
        const friendshipStatus = await checkFriendshipStatus(userId, friendId);
        const requestId = friendshipStatus?.data[0]?.documentId;

        sendFriendRequestMutation({ userId, friendId, requestId, status },
            {
                onSuccess: async (data) => {
                    console.log('Friend request mutation successful:', data);

                    // Lấy nội dung thông báo
                    const { title, content, link, is_global, notice_type_label, notification_created_by } = getNotificationContent(status, friendId, userId);

                    try {
                        // Tạo thông báo trong database
                        createNotification({
                            title,
                            content,
                            link,
                            is_global,
                            notice_type_label,
                            notification_created_by
                        }, {
                            onSuccess: (response) => {
                                console.log('Notification created successfully:', response);

                                if (response?.data?.documentId) {
                                    // Tạo thông báo người dùng trong database
                                    createUserNotification({
                                        user_id: friendId,
                                        notification_id: response.data.documentId
                                    }, {
                                        onSuccess: (userNotifResponse) => {
                                            console.log('User notification created successfully:', userNotifResponse);

                                            try {
                                                // Tạo đối tượng thông báo cho realtime
                                                const notificationObj = {
                                                    id: response.data.documentId,
                                                    documentId: response.data.documentId,
                                                    title,
                                                    content,
                                                    link,
                                                    createdAt: new Date().toISOString(),
                                                    sender: userId,
                                                    status,
                                                    noticeType: {
                                                        name_en: "Friend Request"
                                                    }
                                                };

                                                // Sử dụng hàm sendNotification từ socket.js
                                                sendNotification(friendId, notificationObj);

                                                // Gửi cả qua emitNotification để đảm bảo
                                                // emitNotification(friendId, notificationObj);

                                                // Hiển thị thông báo thành công cho người gửi
                                                if (status === 'pending') {
                                                    notifySuccess('Friend request sent successfully');

                                                    // Hiển thị toast trực tiếp cho bản thân (debugging)
                                                    // toast.info(`Yêu cầu kết bạn đã được gửi đến ${friendId}`, {
                                                    //     position: "top-right",
                                                    //     autoClose: 3000,
                                                    //     hideProgressBar: false,
                                                    //     closeOnClick: true,
                                                    //     pauseOnHover: true,
                                                    //     draggable: true,
                                                    //     toastId: `send-request-${Date.now()}`,
                                                    // });

                                                    // Log thành công để debug
                                                    // console.log(`Friend request sent to ${friendId} successfully:`, notificationObj);
                                                } else if (status === 'accepted') {
                                                    notifySuccess('Friend request accepted');

                                                    // Hiển thị toast trực tiếp cho bản thân (debugging)
                                                    toast.info(`Đã chấp nhận yêu cầu kết bạn từ ${friendId}`, {
                                                        position: "top-right",
                                                        autoClose: 3000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        toastId: `accept-request-${Date.now()}`,
                                                    });

                                                    // Log thành công để debug
                                                    console.log(`Friend request accepted from ${friendId}:`, notificationObj);
                                                }

                                                // Phát sự kiện để thông báo cho các component khác
                                                dispatchNotificationEvent(friendId, notificationObj);
                                            } catch (socketError) {
                                                console.error('Error sending realtime notification:', socketError);
                                            }
                                        },
                                        onError: (error) => {
                                            console.error('Failed to create user notification:', error);
                                        }
                                    });
                                } else {
                                    console.error('No document ID in notification response');
                                }
                            },
                            onError: (error) => {
                                console.error('Failed to create notification:', error);
                            }
                        });

                    } catch (notificationError) {
                        console.error("Error in notification process:", notificationError);
                    }

                    setLoading?.(false);
                    setRequestSent?.(true);
                    if (status === 'denied') {
                        setRequestSent?.(false);
                    }
                },
                onError: (error) => {
                    setLoading?.(false);
                    console.error("Error sending friend request:", error);
                    notifyError('Failed to send friend request. Please try again.');
                }
            }
        );
    } catch (error) {
        setLoading?.(false);
        console.error("Error in handleSendFriendRequest:", error);
        notifyError('An error occurred. Please try again.');
    }
};

/**
 * Phát sự kiện thông báo cho các component khác
 * @param {string} recipientId ID người nhận thông báo
 * @param {object} notification Nội dung thông báo
 */
function dispatchNotificationEvent(recipientId, notification) {
    // Đảm bảo notification luôn có noticeType
    if (!notification.noticeType) {
        notification.noticeType = { name_en: "Friend Request" };
    }

    // Phát sự kiện cho trình duyệt
    try {
        const eventDetail = {
            detail: {
                notification,
                recipientId,
                timestamp: new Date().toISOString()
            }
        };

        // Phát sự kiện NOTIFICATION_EVENT
        window.dispatchEvent(new CustomEvent(NOTIFICATION_EVENT, eventDetail));

        // Phát thêm một số sự kiện khác để đảm bảo tương thích
        window.dispatchEvent(new CustomEvent('socket_notification', eventDetail));
        window.dispatchEvent(new CustomEvent('OCEAN_MIND_NOTIFICATION', eventDetail));

        console.log('Notification events dispatched from friendActions');
    } catch (err) {
        console.error('Error dispatching notification event:', err);
    }
}

/**
 * Gửi thông báo qua socket
 * @param {string} recipientId ID người nhận
 * @param {object} notification Nội dung thông báo
 */
function emitNotification(recipientId, notification) {
    // Kiểm tra kết nối socket trước khi gửi
    if (!socket || !socket.connected) {
        console.warn('Socket disconnected, attempting to reconnect before sending notification');
        if (socket) socket.connect();

        // Đợi kết nối trước khi gửi
        setTimeout(() => {
            doEmitNotification(recipientId, notification);
        }, 1000);
    } else {
        doEmitNotification(recipientId, notification);
    }
}

/**
 * Thực hiện việc gửi thông báo qua socket
 * @param {string} recipientId ID người nhận
 * @param {object} notification Nội dung thông báo
 */
function doEmitNotification(recipientId, notification) {
    console.log(`Emitting notification to ${recipientId}:`, notification);

    // Đảm bảo id và documentId đều được thiết lập
    const notificationId = notification.id || notification.documentId || Date.now().toString();

    // Đảm bảo noticeType được thiết lập đúng cho friend request
    const notificationWithAllFields = {
        ...notification,
        id: notificationId,
        documentId: notificationId,
        // Đảm bảo luôn có noticeType
        noticeType: notification.noticeType || { name_en: "Friend Request" }
    };

    const payload = {
        recipientId,
        notification: notificationWithAllFields
    };

    // Gửi thông báo qua socket một lần duy nhất
    socket.emit('notification', payload);
}

/**
 * Xử lý điều hướng đến trang chat
 * @param {Object} props Các tham số cần thiết
 */
export const handleNavigateToChat = async ({ friend, userData, navigate, createConversationAsync, setLoading }) => {
    try {
        // Kiểm tra nếu setLoading là hàm thì mới gọi
        if (typeof setLoading === 'function') {
            setLoading(true);
        }

        const conversation = await getConversation({ friend, userData });

        console.log('conversation', conversation);

        if (conversation?.data?.exists === true) {
            navigate(`/social/chat/${conversation?.data?.conversation?.documentId}`);
        } else {
            const conversation = await createConversationAsync({
                userId: userData?.documentId,
                friendId: friend?.documentId,
            });
            console.log('conversation created', conversation);
            if (conversation?.data?.documentId) {
                navigate(`/social/chat/${conversation?.data?.documentId}`);
            } else {
                notifyWarning('No conversation found');
            }
        }

        // Kiểm tra nếu setLoading là hàm thì mới gọi
        if (typeof setLoading === 'function') {
            setLoading(false);
        }
    } catch (error) {
        // Kiểm tra nếu setLoading là hàm thì mới gọi
        if (typeof setLoading === 'function') {
            setLoading(false);
        }
        console.error('Error navigating to chat:', error);
    }
};

/**
 * Xử lý thay đổi trạng thái kết bạn
 * @param {Object} props Các tham số cần thiết
 */
export const handleChangeFriendStatus = ({ status, userData, friend, setRequestSent, sendFriendRequest }) => {
    handleSendFriendRequest({
        userId: userData?.documentId,
        friendId: friend?.documentId,
        status: status,
        setRequestSent,
        sendFriendRequestMutation: sendFriendRequest
    });
};