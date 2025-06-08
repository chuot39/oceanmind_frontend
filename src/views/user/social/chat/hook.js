import { useQuery, useInfiniteQuery } from "react-query"
import { API_BASE_URL } from "../../../../constants"
import apiClient from "../../../../utils/api"
import { useUserData } from "../../../../utils/hooks/useAuth"


export const useGetChatFriends = (userId) => {
    const fetchFriends = async ({ pageParam = 1 }) => {
        const response = await apiClient.get(`${API_BASE_URL}/conversations?is_group_chat=false&page=${pageParam}&limit=4&conversation_created_by=${userId}&user_chated_with=${userId}&condition_type=OR`);
        return {
            data: response?.data?.data || [],
            nextPage: response?.data?.pagination?.totalPages > pageParam ? pageParam + 1 : undefined,
            totalPages: response?.data?.pagination?.totalPages || 1
        };
    };

    return useInfiniteQuery(['chat-friends', userId], fetchFriends, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: !!userId,
        refetchOnWindowFocus: false,
    });
}

export const useGetChatGroups = (userId) => {
    const fetchChatGroups = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/participants?populate=*&filters[$and][2][user_id][documentId][$eq]=${userId}`)

        await Promise.all(response?.data?.data?.map(async participant => {
            const detailGroup = await apiClient.get(`${API_BASE_URL}/conversations?filters[$and][0][documentId][$eq]=${participant?.conversation_id?.documentId}&populate=*`)
            participant.detailGroup = detailGroup?.data?.data[0]
            return participant
        }))

        return response?.data
    }
    return useQuery(['chat-groups'], fetchChatGroups, {
        enabled: true, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

export const useGetChatMessages = (conversationId) => {

    const fetchChatMessages = async ({ pageParam = 1 }) => {
        const response = await apiClient.get(
            `${API_BASE_URL}/messages/conversation/${conversationId}?limit=20&sortBy=createdAt&sortOrder=desc&page=${pageParam}`
        )
        return response?.data?.data
    }

    return useInfiniteQuery(['chat-messages', conversationId], fetchChatMessages, {
        enabled: !!conversationId,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        refetchOnWindowFocus: false
    }
    )
}

// New hook to fetch chat by alias
export const useGetChatByAlias = (alias) => {

    const fetchChatByAlias = async () => {
        const response = await apiClient.get(
            `${API_BASE_URL}/conversations/${alias}`
        )
        return response?.data?.data
    }

    return useQuery(['chat-by-alias', alias], fetchChatByAlias, {
        enabled: !!alias,
        refetchOnWindowFocus: false,
        staleTime: 10000, // Data stays fresh for 10 seconds
    })
}

