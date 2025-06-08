import chatService from "@/services/api/chatService";
import friendshipService from "@/services/api/friendshipService";
import { notifyError, notifySuccess } from "@/utils/Utils";
import { useMutation, useQueryClient } from "react-query";

export const useChangeFriendStatus = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ userId, friendId, status }) => {
            const requestId = await friendshipService.getFriendshipId(userId, friendId);
            if (requestId) {
                return await friendshipService.updateFriendshipStatus(requestId, status, userId, friendId);
            } else {
                return await friendshipService.createFriendRequest(userId, friendId);
            }
        },
        {
            onSuccess: () => {
                notifySuccess('Friend request sent successfully');
            },
            onError: (error) => {
                console.error("Error sending friend request:", error);
                notifyError('Failed to send friend request');
                throw error;
            }
        }
    );
};

export const useCreateConversation = () => {
    return useMutation(
        async ({ userId, friendId }) => {
            return await chatService.createConversation({
                conversation_created_by: userId,
                is_group_chat: false,
                user_chated_with: friendId
            });
        },
        {
            onSuccess: () => {
                notifySuccess('Conversation created successfully');
            },
            onError: (error) => {
                console.error("Error creating conversation:", error);
                notifyError('Failed to create conversation');
                throw error;
            }
        }
    );
};
