import { useInfiniteQuery } from "react-query"
import apiClient from "../../../../utils/api"
import { API_BASE_URL } from "../../../../constants"
import socialApiService from "@/services/api/socialApiService"

export const usePost = (userId) => {
    const fetchPost = async ({ pageParam = 1 }) => {
        try {
            // Fetch posts with all necessary data in a single request
            const response = await apiClient.get(
                `${API_BASE_URL}/posts?isPublic=true&post_created_by=${userId}&limit=10&page=${pageParam}&sortBy=createdAt&sortOrder=desc`
            );

            // Calculate if there's a next page
            const totalPages = Math.ceil(response?.data?.pagination?.total / response?.data?.pagination?.limit);
            const nextPage = pageParam < totalPages ? pageParam + 1 : undefined;

            return {
                data: response?.data?.data,
                nextPage,
                totalPages
            };
        } catch (error) {
            console.error("Error fetching posts:", error);
            throw error;
        }
    };

    return useInfiniteQuery(['posts', userId], fetchPost, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        refetchOnWindowFocus: false,
    });
};