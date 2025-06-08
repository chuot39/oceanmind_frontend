import { useMutation, useQuery, useInfiniteQuery } from "react-query";
import { API_BASE_URL } from "../../../../constants";
import apiClient from "../../../../utils/api";

export const useDocument = (userId) => {
    const fetchDocument = async ({ pageParam = 1 }) => {
        const response = await apiClient.get(`${API_BASE_URL}/document-shares?page=${pageParam}&limit=10&sortBy=createdAt&sortOrder=DESC&logicType=OR&authorId=${userId}&isGlobal=true`);
        return response?.data;
    }

    return useInfiniteQuery(['query-document', userId], fetchDocument, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        refetchOnWindowFocus: false,
        enabled: !!userId

    });
}

export const useDocumentBookmarked = (userId) => {
    const fetchDocumentBookmarked = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/mark-posts?page=1&limit=100&sortBy=createdAt&sortOrder=DESC&post_id=null&user_id=${userId}`);
        return response?.data;
    }

    return useQuery(['query-document-bookmarked', userId], fetchDocumentBookmarked, {
        refetchOnWindowFocus: false,
        enabled: !!userId
    });
}

export const useTag = () => {
    const fetchTag = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/tags?pagination[pageSize]=100`);
        return response?.data;
    }

    return useQuery(['query-tag'], fetchTag, {
        enabled: true,
        refetchOnWindowFocus: false,
    });
}

export const useGetMediaDocumentPublic = () => {
    return useMutation(
        async () => {
            try {
                const response = await apiClient.get(`${API_BASE_URL}/media-files?filters[$and][0][media_type][$eq]=document_public&pagination[pageSize]=25`);

                // Check if data exists and has items
                if (!response?.data?.data || response.data.data.length === 0) {
                    console.warn('No public document media found. Using fallback ID.');
                    return {
                        data: {
                            data: [{
                                documentId: process.env.REACT_APP_DEFAULT_MEDIA_ID || '1'
                            }]
                        }
                    };
                }

                return response?.data;
            } catch (error) {
                console.error('Error fetching public document media:', error);
                return {
                    data: {
                        data: [{
                            documentId: process.env.REACT_APP_DEFAULT_MEDIA_ID || '1'
                        }]
                    }
                };
            }
        }
    );
}

