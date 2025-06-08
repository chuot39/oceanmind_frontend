import { useQuery } from "react-query";
import { API_BASE_URL } from "../../../../constants";
import apiClient from "../../../../utils/api";

export const useFriendRequestSend = (userId) => {
    const fetchFriendRequest = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/friendships?user_id=${userId}&status=pending&limit=100`);
        return response?.data
    };
    return useQuery(['query-friendRequestSend', userId], fetchFriendRequest, {
        enabled: !!userId,
        refetchOnWindowFocus: false,
    });
}

export const useFriendRequestReceive = (userId) => {
    const fetchFriendRequest = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/friendships?friend_id=${userId}&status=pending&limit=100`);
        return response?.data
    };
    return useQuery(['query-friendRequestReceive', userId], fetchFriendRequest, {
        enabled: !!userId,
        refetchOnWindowFocus: false,
    });
}

