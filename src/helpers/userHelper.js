import { API_BASE_URL } from "@/constants";
import apiClient from "@/utils/api";


export const getConversation = async ({ friend, userData }) => {
    try {
        const res = await apiClient.post(`${API_BASE_URL}/conversations/check`, {
            data: {
                friendId: friend?.documentId,
                userId: userData?.documentId,
            }
        });
        return res?.data;
    } catch (error) {
        console.error("Error getting conversation:", error);
        return null;
    }
}

export const checkFriendshipStatus = async (userId, friendId) => {
    let friendshipStatus = null;
    try {
        friendshipStatus = await apiClient.get(`${API_BASE_URL}/friendships?filters[$and][0][user_id][documentId][$eq]=${userId}&filters[$and][1][friend_id][documentId][$eq]=${friendId}`);
        if (friendshipStatus?.data?.data?.length === 0) {
            friendshipStatus = await apiClient.get(`${API_BASE_URL}/friendships?filters[$and][0][friend_id][documentId][$eq]=${userId}&filters[$and][1][user_id][documentId][$eq]=${friendId}`);
        }
        return friendshipStatus?.data;
    } catch (error) {
        console.error("Error checking friendship status:", error);
        return null;
    }
};




