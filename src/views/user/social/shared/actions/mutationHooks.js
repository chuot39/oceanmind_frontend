import { useMutation, useQueryClient } from "react-query";
import socialApiService from "@services/api/socialApiService";
import imageService from "@services/media/imageService";
import { message } from "antd";
import { notifyError, notifySuccess } from "@/utils/Utils";
import apiClient from "@/utils/api";
import { API_BASE_URL } from "@/constants";
import { useIntl } from "react-intl";
import groupService from "@/services/api/groupService";
import friendshipService from "../../../../../services/api/friendshipService";
import { useUserData } from "@/utils/hooks/useAuth";


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

export const useAddComment = ({ type }) => {
    const intl = useIntl()
    const queryClient = useQueryClient();
    const { userData } = useUserData();

    let groupPostId = null;
    return useMutation(
        async ({ postId, userId, content, parentCommentId = null, groupId = null }) => {
            groupPostId = groupId;
            return await socialApiService.addComment(postId, userId, content, parentCommentId);
        },
        {
            onSuccess: () => {
                // Invalidate queries to refresh data
                queryClient.invalidateQueries(['posts']);
                queryClient.invalidateQueries(['groups']);
                queryClient.invalidateQueries(['group']);
                queryClient.invalidateQueries(['query-mark-post', userData?.documentId]);

                type === 'group' && queryClient.invalidateQueries(['query-groups-posts', userData?.documentId]); // Comment of Post In Group
                type === 'group' && queryClient.invalidateQueries(['query-post-group', groupPostId]); // Comment of Post In Group
            },
            onError: (error) => {
                console.error("Error adding comment:", error);
                notifyError(intl.formatMessage({ id: 'social.comment.added_error' }))
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
    const { userData } = useUserData();
    let group_id_post = null;

    return useMutation(
        async ({ content, userId, isPublic = true, post_tags = [], post_medias = [], group_id = null, media_type = 'post_private' }) => {
            group_id_post = group_id;

            // First create the post
            const postResponse = await socialApiService.createPost({
                content: content,
                post_created_by: userId,
                isPublic: isPublic,
                group_id: group_id
            });

            const postId = postResponse.data.documentId;

            // If there are media files, upload them
            if (post_medias.length > 0) {
                const mediaFileIds = [];

                const mediaUploadPromises = post_medias.map(async (file) => {
                    try {
                        // 1. Upload file to Strapi Media Library
                        const uploadedFile = await imageService.uploadToCloudinary(file, media_type);

                        // 2. Create media file record with file information
                        const mediaFileData = {
                            file_path: uploadedFile.url,
                            file_type: uploadedFile.mime,
                            file_size: uploadedFile.size,
                            media_type: media_type
                        };

                        const mediaFileResponse = await imageService.createMediaFileRecord(mediaFileData);
                        const mediaFileId = mediaFileResponse.data.documentId;

                        // Add to the array of media file IDs
                        mediaFileIds.push(mediaFileId);

                    } catch (error) {
                        console.error("Error processing media file:", error);
                        throw error;
                    }
                });

                await Promise.all(mediaUploadPromises);

                // Create bulk relationship between post and media files
                if (mediaFileIds.length > 0) {
                    await imageService.createPostMediaRelation(postId, mediaFileIds);
                }
            }

            // Handle tags
            if (post_tags.length > 0) {
                const dataSubmit = {
                    sourceId: postId,
                    tagIds: post_tags,
                    isPost: true
                }
                return await socialApiService.createPostTag(dataSubmit);
            }

            return postResponse.data;
        },
        {
            onSuccess: () => {
                // Invalidate and refetch posts query to update UI
                queryClient.invalidateQueries(['posts', userData?.documentId]);
                if (group_id_post) {
                    queryClient.invalidateQueries(['query-post-group', group_id_post]);
                }
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
    let group_id_post = null;
    return useMutation(
        async ({ postId, content, isPublic, post_tags = [], post_medias = [], group_id = null, existingMediaIds = [], oldData, media_type = 'post_private' }) => {
            group_id_post = group_id;
            // 1. Update the post content and privacy setting
            const postResponse = await socialApiService.updatePost(postId, {
                content: content,
                isPublic: isPublic
            });
            const newTags = post_tags.filter(tag => !oldData?.tags?.some(t => t?.documentId === tag));
            const removedTags = oldData?.tags?.filter(tag => !post_tags.includes(tag?.documentId));
            const removedMediaFiles = oldData?.media?.filter(media => !post_medias.some(f => f.existingMediaId === media?.documentId));

            if (post_medias && post_medias.length && post_medias.filter(f => !f.existingMediaId).length > 0) {
                // Handle new media files
                const newMediaFiles = post_medias.filter(f => !f.existingMediaId);
                const mediaFileIds = [];

                const mediaUploadPromises = newMediaFiles.map(async (file) => {
                    try {
                        // 1. Upload file to Cloudinary
                        const uploadedFile = await imageService.uploadToCloudinary(file, media_type);

                        // 2. Create media file record with file information
                        const mediaFileData = {
                            file_path: uploadedFile.url,
                            file_type: uploadedFile.mime,
                            file_size: uploadedFile.size,
                            media_type: media_type
                        };

                        const mediaFileResponse = await imageService.createMediaFileRecord(mediaFileData);
                        const mediaFileId = mediaFileResponse.data.documentId;

                        // Add to the array of media file IDs
                        mediaFileIds.push(mediaFileId);
                    } catch (error) {
                        console.error("Error processing media file:", error);
                        throw error;
                    }
                });

                await Promise.all(mediaUploadPromises);

                // Create bulk relationship between post and media files
                if (mediaFileIds.length > 0) {
                    await imageService.createPostMediaRelation(postId, mediaFileIds);
                }
            }

            if (removedMediaFiles && removedMediaFiles.length > 0) {
                try {
                    await socialApiService.deletePostMedia(postId, removedMediaFiles.map(media => media?.documentId));
                } catch (error) {
                    message.error('Error deleting post media:', error);
                    console.error("Error deleting post media:", error);
                    throw error;
                }
            }

            // 4. Handle tags (remove old ones and add new ones)
            if (newTags && newTags.length > 0) {
                try {
                    const dataSubmit = {
                        sourceId: postId,
                        tagIds: newTags,
                        isPost: true
                    }
                    await socialApiService.createPostTag(dataSubmit);

                } catch (error) {
                    message.error('Error updating post tags:', error);
                    console.error("Error updating post tags:", error);
                }
            }

            if (removedTags && removedTags.length > 0) {
                const listTagIds = removedTags.map(tag => tag?.documentId);
                try {
                    await socialApiService.deletePostTags({ postId, documentIds: listTagIds });
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
                queryClient.invalidateQueries(['groups']);
                queryClient.invalidateQueries(['post-group']);
                if (group_id_post) {
                    queryClient.invalidateQueries(['query-post-group', group_id_post]);
                }

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

    return useMutation(
        async (postId) => {
            return await apiClient.delete(`${API_BASE_URL}/posts/${postId}`);
        },
        {
            onSuccess: () => {
                // Invalidate and refetch posts query to update UI
                queryClient.invalidateQueries(['posts']);

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
        async ({ post, userData }) => {
            return await socialApiService.toggleBookmarkPost(post, userData);
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

export const useMarkDocument = () => {
    const queryClient = useQueryClient();
    const { userData } = useUserData();

    return useMutation(
        async ({ documentShareId }) => {
            return await socialApiService.toggleBookmarkDocument(documentShareId, userData?.documentId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['query-document', userData?.documentId]);
            },
            onError: (error) => {
                console.error('Error marking document: ', error);
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

export const useCheckDocumentMarked = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ documentId, userId }) => {
            return await socialApiService.checkUserBookmarkedDocument(documentId, userId)
        },
        {
            onSuccess: (result) => {
                console.log('result', result)
            },
            onError: (error) => {
                console.error('Error remove mark document: ', error)
            }
        }
    )
}

export const useUpdateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ groupId, data }) => {
            return await groupService.updateGroup(groupId, data);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['query-group-by-id']);
                notifySuccess('Group updated successfully');
            },
            onError: (error) => {
                console.error("Error updating group:", error);
                notifyError('Group updated failed');
                throw error;
            }
        }
    );
};

export const useCreateGroup = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (data) => {
            const response = await groupService.createGroup(data);
            await groupService.joinGroup(response?.data?.documentId, data?.group_created_by, true);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['query-group-by-id']);
                notifySuccess('Group created successfully');
            },
            onError: (error) => {
                console.error("Error creating group:", error);
                notifyError('Group created failed');
                throw error;
            }
        }
    );
};

export const useInviteMember = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ groupId, memberIds, userId }) => {
            return await Promise.all(memberIds.map(async (memberId) => {
                return await groupService.inviteMember(groupId, memberId, userId);
            }));
        },
        {
            onSuccess: () => {
                // queryClient.invalidateQueries(['query-group-by-id']);
            },
            onError: (error) => {
                console.error("Error inviting member:", error);
                // Không throw lỗi ở đây sẽ giúp state loading được reset đúng
                // throw error;
            }
        }
    );
}

export const useDeleteGroup = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(
        async (groupId) => {

            const response = await groupService.deleteGroup(groupId);
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['query-group-by-id']);
                notifySuccess(intl.formatMessage({ id: 'social.group.deleted_successfully' }));
            },
            onError: (error) => {
                console.error("Error deleting group:", error);
                notifyError(intl.formatMessage({ id: 'social.group.deleted_failed' }));
                throw error;
            }
        }
    );
}

export const useLeaveGroup = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ groupId, userId }) => {
            const groupMemberId = await groupService.getGroupMemberId({ groupId, userId });

            console.log('groupMemberId', groupMemberId);
            return await groupService.deleteGroupMember(groupMemberId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['query-group-by-id']);
                notifySuccess('Leave group successfully');
            },
            onError: (error) => {
                console.error("Error leaving group:", error);
                notifyError('Leave group failed');
                throw error;
            }
        }
    );
}

export const useResolveGroupJoinRequest = () => {
    const queryClient = useQueryClient();
    let status = null;

    return useMutation(
        async ({ requestId, statusRequest, groupId = null, userId = null }) => {
            status = statusRequest;
            const response = await groupService.resolveGroupJoinRequest(requestId, statusRequest);

            if (statusRequest === 'accepted' && groupId && userId) {
                await groupService.joinGroup(groupId, userId, false);
            }
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['query-group-join-request']);
                notifySuccess(`The group join request was successfully ${status}.`);
            },
            onError: (error) => {
                console.error("Error resolving request:", error);
                notifyError(`Group join request processed ${status} failed.`);
                throw error;
            }
        }
    )
}

export const useRequestJoinGroup = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(
        async ({ groupId, userId }) => {
            return await groupService.requestJoinGroup({ group_id: groupId, user_request: userId, request_status: 'pending' });
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['query-group-by-id']);
                notifySuccess(intl.formatMessage({ id: 'social.group.send_request' }));
            },
            onError: (error) => {
                console.error("Error joining group:", error);
                notifyError(intl.formatMessage({ id: 'social.group.send_request_failed' }));
                throw error;
            }
        }
    )
}

export const useJoinGroup = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();
    let idGroup = null;

    return useMutation(
        async ({ groupId, userId }) => {
            idGroup = groupId;
            return await groupService.joinGroup(groupId, userId, false);
        },
        {
            onSuccess: () => {
                // Làm mới tất cả các truy vấn liên quan
                queryClient.invalidateQueries(['query-group-by-id', idGroup]);
                queryClient.invalidateQueries(['query-group-member', idGroup]);
                queryClient.invalidateQueries(['query-joined-group']);
                queryClient.invalidateQueries(['post-group', idGroup]);
                queryClient.invalidateQueries(['query-groups-posts']);

                // Thông báo thành công
                notifySuccess(intl.formatMessage({ id: 'social.group.join_group_successfully' }));
            },
            onError: (error) => {
                console.error("Error joining group:", error);
                notifyError(intl.formatMessage({ id: 'social.group.join_group_failed' }));
                throw error;
            }
        }
    )
}

export const useUpdateNotification = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ documentId, groupId, userId, isEnabled }) => {
            const data = {
                group_id: groupId,
                user_id: userId,
                is_enabled: isEnabled,
            }

            if (documentId === null || documentId === undefined) {
                data.notice_type_id = "atiq3fj9pobqwtfipwdudxh8";
            }

            let response = null;
            documentId !== null && documentId !== undefined && (response = await groupService.updateNotification(documentId, data));
            documentId === null || documentId === undefined && (response = await groupService.createNotification(data));
            return response;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['query-notification-group']);
                // notifySuccess('Notification updated successfully');
            },
            onError: (error) => {
                console.error("Error updating notification:", error);
                notifyError('Notification updated failed');
                throw error;
            }
        }
    );
}

export const useAcceptFriendRequest = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (requestId) => {
            return await friendshipService.acceptFriendRequest(requestId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['friendRequest']);
                queryClient.invalidateQueries(['query-friend']);
                notifySuccess('Friend request accepted');
            },
            onError: (error) => {
                console.error("Error accepting friend request:", error);
                notifyError('Failed to accept friend request');
                throw error;
            }
        }
    );
};
