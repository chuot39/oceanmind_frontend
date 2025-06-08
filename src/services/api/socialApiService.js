import apiClient from "@utils/api";
import { API_BASE_URL } from "@constants";

const socialApiService = {

    // Add a general GET method for flexible API calls
    get: async (endpoint) => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}${endpoint}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            throw error;
        }
    },

    checkUserLikedPost: async (postId, username) => {
        try {
            const response = await apiClient.get(
                `${API_BASE_URL}/likes?populate=*&filters[$and][0][post_id][documentId][$eq]=${postId}&filters[$and][1][user_id][username][$eq]=${username}`
            );
            return response.data;
        } catch (error) {
            console.error("Error checking if user liked post:", error);
            throw error;
        }
    },

    likePost: async (postId, userId) => {
        try {
            console.log('likePost called with postId:', postId, 'userId:', userId);
            const response = await apiClient.post(`${API_BASE_URL}/likes`, {
                data: {
                    post_id: postId,
                    user_id: userId
                }
            });
            console.log('likePost full response:', response);
            console.log('likePost response data:', response.data);

            // Extract the data directly from the response
            const likeData = response.data.data;
            console.log('Extracted likeData:', likeData);

            // Return the data with the correct structure based on API response
            return likeData;
        } catch (error) {
            console.error("Error liking post:", error);
            throw error;
        }
    },

    unlikePost: async (likeId) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/likes/${likeId}`);
            return response.data;
        } catch (error) {
            console.error("Error unliking post:", error);
            throw error;
        }
    },

    toggleLikePost: async (post, userData, isCurrentlyLiked) => {
        try {

            // Nếu đã biết trạng thái like hiện tại từ UI, sử dụng nó để quyết định hành động
            if (isCurrentlyLiked !== undefined) {
                if (isCurrentlyLiked) {
                    // Nếu đã like, tìm likeId để unlike
                    const likesResponse = await socialApiService.checkUserLikedPost(post.documentId, userData.username);

                    if (likesResponse?.data?.length > 0) {
                        const likeData = likesResponse.data[0];
                        const likeId = likeData.documentId;

                        // Unlike the post
                        await socialApiService.unlikePost(likeId);

                        return {
                            isLiked: false,
                            likeCount: -1,
                            likeId: likeId
                        };
                    } else {
                        // Trường hợp này hiếm khi xảy ra, nhưng vẫn xử lý để đảm bảo UI và database đồng bộ
                        return {
                            isLiked: false,
                            likeCount: 0,
                            likeId: null
                        };
                    }
                } else {
                    // Nếu chưa like, thực hiện like

                    // Thực hiện POST request để like
                    const response = await apiClient.post(`${API_BASE_URL}/likes`, {
                        data: {
                            post_id: post.documentId,
                            user_id: userData.documentId
                        }
                    });

                    const likeData = response.data.data;

                    return {
                        isLiked: true,
                        likeCount: 1,
                        likeId: likeData.id
                    };
                }
            } else {
                // Nếu không biết trạng thái hiện tại, kiểm tra từ server
                const likesResponse = await socialApiService.checkUserLikedPost(post.documentId, userData.username);

                const userLiked = likesResponse?.data?.length > 0;

                if (userLiked) {
                    // Nếu đã like, unlike
                    const likeData = likesResponse.data[0];
                    const likeId = likeData.id;

                    await socialApiService.unlikePost(likeId);

                    return {
                        isLiked: false,
                        likeCount: -1,
                        likeId: likeId
                    };
                } else {
                    // Nếu chưa like, thực hiện like

                    const response = await apiClient.post(`${API_BASE_URL}/likes`, {
                        data: {
                            post_id: post.documentId,
                            user_id: userData.documentId
                        }
                    });

                    const likeData = response.data.data;

                    return {
                        isLiked: true,
                        likeCount: 1,
                        likeId: likeData.id
                    };
                }
            }
        } catch (error) {
            console.error('Error in toggleLikePost:', error);
            throw error;
        }
    },

    addComment: async (postId, userId, content, parent_id = null) => {
        try {
            const commentData = {
                post_id: postId,
                user_id: userId,
                content: content
            };

            // Add parent_id if it exists
            if (parent_id) {
                commentData.parent_id = parent_id;
            }

            const response = await apiClient.post(`${API_BASE_URL}/comments`, {
                data: commentData
            });
            return response.data;
        } catch (error) {
            console.error("Error adding comment:", error);
            throw error;
        }
    },

    sharePost: async (postId, userId, content = "") => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/shares`, {
                data: {
                    post_id: postId,
                    user_id: userId,
                    content: content
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error sharing post:", error);
            throw error;
        }
    },

    checkUserBookmarkedPost: async (postId, userId) => {
        try {
            const response = await apiClient.get(
                `${API_BASE_URL}/mark-posts/check?post_id=${postId}&user_id=${userId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error checking if user bookmarked post:", error);
            throw error;
        }
    },

    checkUserBookmarkedDocument: async (documentShareId, userId) => {
        try {
            const response = await apiClient.get(
                `${API_BASE_URL}/mark-posts/check?document_share_id=${documentShareId}&user_id=${userId}`
            );
            return response.data;
        } catch (error) {
            console.error("Error checking if user bookmarked document:", error);
            throw error;
        }
    },

    bookmarkPost: async (postId, userId) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/mark-posts`, {
                data: {
                    post_id: postId,
                    user_id: userId,
                    document_share_id: null
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error bookmarking post:", error);
            throw error;
        }
    },

    bookmarkDocument: async (documentId, userId) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/mark-posts`, {
                data: {
                    document_share_id: documentId,
                    user_id: userId,
                    post_id: null
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error bookmarking document:", error);
            throw error;
        }
    },

    removeBookmark: async (bookmarkId) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/mark-posts/${bookmarkId}`);
            return response.data;
        } catch (error) {
            console.error("Error removing bookmark:", error);
            throw error;
        }
    },

    toggleBookmarkPost: async (postId, userId) => {
        try {
            // Check if user already bookmarked the post
            const bookmarksResponse = await socialApiService.checkUserBookmarkedPost(postId, userId);

            if (bookmarksResponse?.data?.marked === true) {
                // User already bookmarked the post, so remove bookmark
                const bookmarkId = bookmarksResponse?.data?.markInfo?.documentId;
                await socialApiService.removeBookmark(bookmarkId);
                return { isBookmarked: false };
            } else {
                // User hasn't bookmarked the post, so bookmark it
                await socialApiService.bookmarkPost(postId, userId);
                return { isBookmarked: true };
            }
        } catch (error) {
            console.error("Error toggling bookmark status:", error);
            throw error;
        }
    },

    toggleBookmarkDocument: async (documentShareId, userId) => {
        try {
            // Check if user already bookmarked the document
            const bookmarksResponse = await socialApiService.checkUserBookmarkedDocument(documentShareId, userId);

            if (bookmarksResponse?.data?.marked === true) {
                // User already bookmarked the document, so remove bookmark
                const bookmarkId = bookmarksResponse?.data?.markInfo?.documentId;
                await socialApiService.removeBookmark(bookmarkId);
                return { isBookmarked: false };
            } else {
                // User hasn't bookmarked the document, so bookmark it
                await socialApiService.bookmarkDocument(documentShareId, userId);
                return { isBookmarked: true };
            }
        } catch (error) {
            console.error("Error toggling bookmark status:", error);
            throw error;
        }
    },

    getUserBookmarkedPosts: async (username, page = 1, pageSize = 10) => {
        try {
            const response = await apiClient.get(
                `${API_BASE_URL}/mark-posts?populate=*&filters[user_id][username][$eq]=${username}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc`
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching user bookmarked posts:", error);
            throw error;
        }
    },

    createPost: async (postData) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/posts`, {
                data: postData
            });
            return response.data;
        } catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    },

    createPostTag: async (dataSubmit) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/post-tags/bulk`, {
                data: dataSubmit
            });
            return response.data;
        } catch (error) {
            console.error("Error creating post tag:", error);
            throw error;
        }
    },

    updatePost: async (postId, postData) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/posts/${postId}`, {
                data: postData
            });
            return response.data;
        } catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    },

    updatePostMedia: async (postId, keepMediaIds) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/posts/${postId}/update-media`, {
                data: {
                    keepMediaIds: keepMediaIds
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error updating post media:", error);
            throw error;
        }
    },

    deletePostMedia: async (postId, mediaIds) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/post-medias/bulk/source`, {
                data: {
                    sourceId: postId,
                    mediaIds: mediaIds
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting post media:", error);
            throw error;
        }
    },

    deletePostTags: async ({ postId, documentIds }) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/post-tags/bulk/source`, {
                data: {
                    data: {
                        sourceId: postId,
                        isPost: true,
                        tagIds: documentIds
                    }
                }
            });

            return response.data;
        } catch (error) {
            console.error("Error deleting post tags:", error);
            throw error;
        }
    },


}

export default socialApiService; 