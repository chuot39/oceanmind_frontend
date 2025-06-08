import apiClient from "@utils/api";
import { API_BASE_URL } from "@constants";

const friendshipService = {
    // Send a friend request
    createFriendRequest: async (userId, friendId) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/friendships`, {
                data: {
                    user_id: userId,
                    friend_id: friendId,
                    status: 'pending'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error sending friend request:", error);
            throw error;
        }
    },

    updateFriendshipStatus: async (requestId, status, userId, friendId) => {
        try {
            const data = { status };
            if (status === 'pending') {
                data.user_id = userId;
                data.friend_id = friendId;
            }
            const response = await apiClient.put(`${API_BASE_URL}/friendships/${requestId}`, { data });
            return response.data;
        } catch (error) {
            console.error("Error updating friendship status:", error);
            throw error;
        }
    },

    // Accept a friend request
    acceptFriendRequest: async (requestId) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/friendships/${requestId}`, {
                data: {
                    status: 'accepted'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error accepting friend request:", error);
            throw error;
        }
    },

    // Reject/Decline a friend request
    rejectFriendRequest: async (requestId) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/friendships/${requestId}`);
            return response.data;
        } catch (error) {
            console.error("Error rejecting friend request:", error);
            throw error;
        }
    },

    // Cancel a sent friend request
    cancelFriendRequest: async (requestId) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/friendships/${requestId}`);
            return response.data;
        } catch (error) {
            console.error("Error canceling friend request:", error);
            throw error;
        }
    },

    // Unfriend a user
    unfriend: async (friendshipId) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/friendships/${friendshipId}`);
            return response.data;
        } catch (error) {
            console.error("Error unfriending user:", error);
            throw error;
        }
    },

    // Get friendship ID between two users
    getFriendshipId: async (userId, friendId) => {
        try {
            const response = await apiClient.get(
                `${API_BASE_URL}/friendships?friend_id=${friendId}&user_id=${userId}`
            );

            if (response?.data?.data?.length > 0) {
                return response.data.data[0].documentId;
            }

            // Check the reverse relationship
            const reverseResponse = await apiClient.get(
                `${API_BASE_URL}/friendships?friend_id=${userId}&user_id=${friendId}`
            );

            if (reverseResponse?.data?.data?.length > 0) {
                return reverseResponse.data.data[0].documentId;
            }

            return null;
        } catch (error) {
            console.error("Error getting friendship ID:", error);
            throw error;
        }
    }
};

export default friendshipService; 