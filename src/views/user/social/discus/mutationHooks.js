import { useMutation, useQueryClient } from "react-query";
import socialApiService from "@services/api/socialApiService";
import apiClient from "../../../../utils/api";
import { API_BASE_URL } from "../../../../constants";
import imageService from "@services/media/imageService";
import { message } from "antd";
import { notifySuccess } from "@/utils/Utils";


export const useLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ postId, userId }) => {
            return await socialApiService.likePost(postId, userId);
        },
        {
            onSuccess: (data, variables) => {
                // Update the cache directly instead of invalidating the entire query
                queryClient.setQueryData(['posts'], (oldData) => {
                    if (!oldData) return oldData;

                    // Create a deep copy of the old data
                    const newData = JSON.parse(JSON.stringify(oldData));

                    // Update the likes for the specific post
                    newData.pages.forEach(page => {
                        page.data.forEach(post => {
                            if (post.documentId === variables.postId) {
                                // Add the new like to the post's likes
                                if (!post.postLikes) {
                                    post.postLikes = { data: [] };
                                }

                                // Add the new like to the post's likes
                                post.postLikes.data.push({
                                    id: data.id,
                                    attributes: {
                                        documentId: data.documentId,
                                        user_id: {
                                            data: {
                                                id: variables.userId,
                                                attributes: {
                                                    documentId: variables.userId
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    });

                    return newData;
                });
            },
            onError: (error) => {
                console.error("Error liking post:", error);
                throw error;
            }
        }
    );
};

export const useUnlikePost = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (likeId) => {
            return await socialApiService.unlikePost(likeId);
        },
        {
            onSuccess: (_, likeId) => {
                // Update the cache directly instead of invalidating the entire query
                queryClient.setQueryData(['posts'], (oldData) => {
                    if (!oldData) return oldData;

                    // Create a deep copy of the old data
                    const newData = JSON.parse(JSON.stringify(oldData));

                    // Remove the like from all posts
                    newData.pages.forEach(page => {
                        page.data.forEach(post => {
                            if (post.postLikes && post.postLikes.data) {
                                post.postLikes.data = post.postLikes.data.filter(
                                    like => like.documentId !== likeId && like?.documentId !== likeId
                                );
                            }
                        });
                    });

                    return newData;
                });
            },
            onError: (error) => {
                console.error("Error unliking post:", error);
                throw error;
            }
        }
    );
};

export const useToggleLikePost = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ post, userData, isCurrentlyLiked }) => {
            const result = await socialApiService.toggleLikePost(post, userData, isCurrentlyLiked);
            return result;
        },
        {
            onSuccess: (result, variables) => {

                // Instead of invalidating the entire query, update the specific post in the cache
                queryClient.setQueryData(['posts'], (oldData) => {
                    if (!oldData) return oldData;


                    // Create a deep copy of the old data
                    const newData = JSON.parse(JSON.stringify(oldData));

                    // Update the likes for the specific post
                    let postUpdated = false;

                    newData.pages.forEach(page => {
                        page.data.forEach(post => {
                            if (post.documentId === variables.post.documentId) {
                                postUpdated = true;

                                // Ensure postLikes exists and has data array
                                if (!post.postLikes) {
                                    post.postLikes = { data: [] };
                                }

                                if (result.isLiked) {
                                    // Add the new like to the post's likes if it doesn't already exist
                                    const likeExists = post.postLikes.data.some(like =>
                                        like.documentId === result.likeId ||
                                        (like.user_id === variables.userData.documentId)
                                    );

                                    if (!likeExists) {

                                        // Create a new like object with the correct structure
                                        const newLike = {
                                            id: result.likeId,
                                            user_id: variables.userData.documentId
                                        };

                                        post.postLikes.data.push(newLike);
                                    } else {
                                        console.log('Like already exists in cache, not adding duplicate');
                                    }
                                } else {
                                    // Remove the like from the post's likes

                                    const oldLikesCount = post.postLikes.data.length;

                                    // Remove by ID or by user ID
                                    post.postLikes.data = post.postLikes.data.filter(like => {
                                        const likeId = like.documentId;
                                        const likeUserId = typeof like.user_id === 'string'
                                            ? like.user_id
                                            : like.user_id?.documentId || like.user_id?.data?.id;

                                        return likeId !== result.likeId && likeUserId !== variables.userData.documentId;
                                    });

                                }

                            }
                        });
                    });

                    return newData;
                });
            },
            onError: (error) => {
                console.error("Error toggling like status:", error);
                throw error;
            }
        }
    );
};

export const useAddComment = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ postId, userId, content, parent_id }) => {
            const response = await socialApiService.addComment(postId, userId, content, parent_id);
            return response;
        },
        {
            onSuccess: (newComment, variables) => {
                // Get the current post data from the cache
                queryClient.setQueryData(['posts'], (oldData) => {
                    if (!oldData) return oldData;

                    // Create a deep copy of the old data
                    const newData = JSON.parse(JSON.stringify(oldData));

                    // Find the user data from the cache
                    const userData = queryClient.getQueryData(['userData']);

                    // Create a properly structured comment object that works for both PostCard and CommentsModal
                    const commentObj = {
                        ...newComment.data,
                        documentId: newComment.data.documentId,
                        user_id: {
                            documentId: userData?.documentId,
                            fullname: userData?.fullname || 'Unknown User',
                            username: userData?.username || '',
                            avatar_url_id: userData?.avatar_url_id || null
                        },
                        parent_id: variables.parent_id ? { documentId: variables.parent_id } : null,
                        createdAt: new Date().toISOString()
                    };

                    // Update the comments for the specific post in all pages
                    newData.pages.forEach(page => {
                        page.data.forEach(post => {
                            if (post.documentId === variables.postId) {
                                // Initialize comments array if it doesn't exist
                                if (!post.comments) {
                                    post.comments = [];
                                }

                                // Add the new comment to the post's comments
                                post.comments.unshift(commentObj);

                                // Also update postComments if it exists (for backward compatibility)
                                if (!post.postComments) {
                                    post.postComments = [];
                                }

                                // Add to postComments with the structure expected by some components
                                post.postComments.unshift({
                                    id: newComment.id,
                                    attributes: {
                                        ...newComment,
                                        user_id: {
                                            data: {
                                                id: variables.userId,
                                                attributes: {
                                                    documentId: variables.userId,
                                                    fullname: userData?.fullname || 'Unknown User',
                                                    username: userData?.username || '',
                                                    avatar_url_id: userData?.avatar_url_id ? {
                                                        data: {
                                                            id: userData.avatar_url_id.documentId,
                                                            attributes: {
                                                                file_path: userData.avatar_url_id.file_path
                                                            }
                                                        }
                                                    } : null
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    });

                    return newData;
                });

                // Force a refresh of the posts data
                queryClient.invalidateQueries(['posts']);
            },
            onError: (error) => {
                console.error("Error adding comment:", error);
                throw error;
            }
        }
    );
};

export const useSharePost = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ postId, userId, content }) => {
            return await socialApiService.sharePost(postId, userId, content);
        },
        {
            onSuccess: () => {
                // Invalidate and refetch posts query to update UI
                queryClient.invalidateQueries(['posts']);
            },
            onError: (error) => {
                console.error("Error sharing post:", error);
                throw error;
            }
        }
    );
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ content, userId, isPublic = true, post_tags = [], post_medias = [] }) => {
            // First create the post
            const postResponse = await socialApiService.createPost({
                content: content,
                post_created_by: userId,
                isPublic: isPublic
            });

            const postId = postResponse.data.documentId;

            // If there are media files, upload them
            if (post_medias.length > 0) {
                const mediaUploadPromises = post_medias.map(async (file) => {
                    try {
                        // 1. Upload file to Strapi Media Library
                        const uploadedFile = await imageService.uploadToMediaLibrary(file);

                        // 2. Create media file record with file information
                        const mediaFileData = {
                            file_path: uploadedFile.url,
                            file_type: uploadedFile.mime,
                            file_size: uploadedFile.size,
                        };

                        const mediaFileResponse = await imageService.createMediaFileRecord(mediaFileData);
                        const mediaFileId = mediaFileResponse.data.documentId;

                        // 3. Create relationship between post and media file
                        return await imageService.createPostMediaRelation(postId, mediaFileId);
                    } catch (error) {
                        console.error("Error processing media file:", error);
                        throw error;
                    }
                });

                await Promise.all(mediaUploadPromises);
            }

            // Handle tags
            if (post_tags.length > 0) {
                const tagUploadPromises = post_tags.map(async (tag) => {
                    return await socialApiService.createPostTag({
                        post_id: postId,
                        tag_id: tag
                    });
                });

                await Promise.all(tagUploadPromises);
            }

            return postResponse.data;
        },
        {
            onSuccess: () => {
                // Invalidate and refetch posts query to update UI
                queryClient.invalidateQueries(['posts']);
                notifySuccess("Post created successfully!");
            },
            onError: (error) => {
                console.error("Error creating post:", error);
                throw error;
            }
        }
    );
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ postId, content, isPublic, post_tags = [], post_medias = [], existingMediaIds = [], oldData }) => {
            // 1. Update the post content and privacy setting
            const postResponse = await socialApiService.updatePost(postId, {
                content: content,
                isPublic: isPublic
            });
            const newTags = post_tags.filter(tag => !oldData?.postTags?.data?.some(t => t?.tag_id?.documentId === tag));
            const removedTags = oldData?.postTags?.data?.filter(tag => !post_tags.includes(tag?.tag_id?.documentId));
            const removedMediaFiles = oldData?.postMedias?.data?.filter(media => !post_medias.some(f => f.existingMediaId === media?.documentId));

            if (post_medias && post_medias.length && post_medias.filter(f => !f.existingMediaId).length > 0) {

                const newMediaFiles = post_medias.filter(f => !f.existingMediaId);
                const mediaUploadPromises = newMediaFiles.map(async (file) => {
                    try {
                        // Upload file to Strapi Media Library
                        const uploadedFile = await imageService.uploadToMediaLibrary(file);

                        // Create media file record with file information
                        const mediaFileData = {
                            file_path: uploadedFile.url,
                            file_type: uploadedFile.mime,
                            file_size: uploadedFile.size,
                        };

                        const mediaFileResponse = await imageService.createMediaFileRecord(mediaFileData);
                        const mediaFileId = mediaFileResponse.data.documentId;

                        // Create relationship between post and media file
                        return await imageService.createPostMediaRelation(postId, mediaFileId);
                    } catch (error) {
                        console.error("Error processing media file:", error);
                        throw error;
                    }
                });

                await Promise.all(mediaUploadPromises);
            }

            if (removedMediaFiles && removedMediaFiles.length > 0) {
                removedMediaFiles.forEach(async (media) => {
                    try {
                        await socialApiService.deletePostMedia(media?.documentId);
                    } catch (error) {
                        message.error('Error deleting post media:', error);
                        console.error("Error deleting post media:", error);
                        throw error;
                    }
                });
            }

            // 4. Handle tags (remove old ones and add new ones)
            if (newTags && newTags.length > 0) {
                try {
                    // First remove all existing tags
                    // await socialApiService.deletePostTags(postId);

                    // Then add the new tags
                    const tagUploadPromises = newTags.map(async (tag) => {
                        return await socialApiService.createPostTag({
                            post_id: postId,
                            tag_id: tag
                        });
                    });

                    await Promise.all(tagUploadPromises);
                } catch (error) {
                    message.error('Error updating post tags:', error);
                    console.error("Error updating post tags:", error);
                }
            }

            if (removedTags && removedTags.length > 0) {
                try {
                    removedTags.forEach(async (tag) => {
                        await socialApiService.deletePostTags(tag?.documentId);
                    });
                } catch (error) {
                    message.error('Error deleting post tags:', error);
                    console.error("Error deleting post tags:", error);
                }
            }

            return postResponse.data;
        },
        {
            onSuccess: () => {
                // Invalidate and refetch posts query to update UI
                queryClient.invalidateQueries(['posts']);
                notifySuccess('Post updated successfully');
            },
            onError: (error) => {
                console.error("Error updating post:", error);
                throw error;
            }
        }
    );
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    let group_post = null;

    return useMutation(
        async ({ postId, group = null }) => {
            group_post = group;
            return await apiClient.delete(`${API_BASE_URL}/posts/${postId}`);
        },
        {
            onSuccess: () => {
                // Invalidate and refetch posts query to update UI
                queryClient.invalidateQueries(['posts']);
                if (group_post) {
                    queryClient.invalidateQueries(['query-groups-posts']);
                    queryClient.invalidateQueries(['query-post-group', group_post?.documentId]);
                }
            },
            onError: (error) => {
                console.error("Error deleting post:", error);
                throw error;
            }
        }
    );
};

export const useMarkPost = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ postId, userId }) => {
            return await socialApiService.toggleBookmarkPost(postId, userId);
        },
        {
            onSuccess: () => {
                // Invalidate relevant queries to refresh data
                queryClient.invalidateQueries(['posts']);
                queryClient.invalidateQueries(['mark-posts']);
            },
            onError: (error) => {
                console.error('Error marking post: ', error);
            }
        }
    );
};

export const useCheckPostMarked = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ postId, userId }) => {
            return await socialApiService.checkUserBookmarkedPost(postId, userId)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['posts']);
                queryClient.invalidateQueries(['mark-posts'])
            },
            onError: (error) => {
                console.error('Error remove mark post: ', error)
            }
        }
    )
}
