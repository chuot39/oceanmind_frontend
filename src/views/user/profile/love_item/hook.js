import { useInfiniteQuery, useQuery } from "react-query";
import { API_BASE_URL } from "../../../../constants";
import apiClient from "../../../../utils/api";

export const useMarkPost = (userId) => {
    const fetchMarkPost = async ({ pageParam = 1 }) => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/posts/bookmark/${userId}?page=${pageParam}&limit=3&sortBy=createdAt&sortOrder=DESC`);

            // Ensure nextPage is properly set
            const data = response?.data || {};

            // If we're on the last page or there's no data, nextPage should be undefined
            if (!data.data || data.data.length === 0 || pageParam >= data.totalPages) {
                return {
                    ...data,
                    nextPage: undefined
                };
            }

            return {
                ...data,
                nextPage: pageParam + 1
            };

        } catch (error) {
            console.error('Error in fetchPost:', error);
            return {
                data: [],
                nextPage: undefined,
                totalPages: 0
            };
        }
    };

    return useInfiniteQuery(['query-mark-post', userId], fetchMarkPost, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: !!userId,
        refetchOnWindowFocus: false,
        retry: 1
    });
};
