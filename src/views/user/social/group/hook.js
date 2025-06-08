import { useInfiniteQuery, useQuery } from "react-query"
import apiClient from "../../../../utils/api"
import { API_BASE_URL } from "../../../../constants"
import socialApiService from "@/services/api/socialApiService"

export const usePost = (username) => {
    const fetchPost = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/posts?filters[$or][0][isPublic][$eq]=true&filters[$or][1][post_created_by][username][$eq]=${username}&populate=*&pagination[pageSize]=10&pagination[page]=1&sort=createdAt:desc`);

        // Get all unique usernames from posts
        const usernames = [...new Set(response?.data?.data?.map(post => post?.post_created_by?.username))];
        const postIds = [...new Set(response?.data?.data?.map(post => post?.documentId))];

        // Fetch user details for all post creators
        const userDetailsPromises = usernames.map(async username => {
            if (!username) return null;
            const userResponse = await apiClient.get(`${API_BASE_URL}/users?filters[$and][0][username][$eq]=${username}&populate[0]=avatar_url_id`);
            return { username, details: userResponse?.data[0] };
        });

        const postMediasPromises = postIds.map(async (postId) => {
            const postResponse = await apiClient.get(`${API_BASE_URL}/post-medias?populate=*&filters[$and][0][post_id][documentId][$eq]=${postId}`);
            return { postId, details: postResponse?.data };
        });

        const postCommentsPromises = postIds.map(async (postId) => {
            const postResponse = await apiClient.get(`${API_BASE_URL}/comments?populate=*&filters[$and][0][post_id][documentId][$eq]=${postId}`);

            const commentsWithUserDetails = await Promise.all(postResponse?.data?.data?.map(async comment => {
                const userResponse = await apiClient.get(`${API_BASE_URL}/users?filters[$and][0][username][$eq]=${comment?.user_id?.username}&populate[0]=avatar_url_id`);
                return { comment, user: userResponse?.data[0] };
            }));
            return { postId, details: commentsWithUserDetails };
        });

        const postLikesPromises = postIds.map(async (postId) => {
            const postResponse = await apiClient.get(`${API_BASE_URL}/likes?populate=*&filters[$and][0][post_id][documentId][$eq]=${postId}`);
            return { postId, details: postResponse?.data };
        });

        const postSharesPromises = postIds.map(async (postId) => {
            const postResponse = await apiClient.get(`${API_BASE_URL}/shares?populate=*&filters[$and][0][post_id][documentId][$eq]=${postId}`);
            return { postId, details: postResponse?.data };
        });

        const userDetails = await Promise.all(userDetailsPromises);
        const postMedias = await Promise.all(postMediasPromises);
        const postComments = await Promise.all(postCommentsPromises);
        const postLikes = await Promise.all(postLikesPromises);
        const postShares = await Promise.all(postSharesPromises);

        // Create a map of username to user details
        const userDetailsMap = {};
        const postMediasMap = {};
        const postCommentsMap = {};
        const postLikesMap = {};
        const postSharesMap = {};

        userDetails.forEach(user => {
            if (user && user.username) {
                userDetailsMap[user.username] = user.details;
            }
        });

        postMedias.forEach(media => {
            if (media && media.postId) {
                postMediasMap[media.postId] = media.details;
            }
        });

        postComments.forEach(comment => {
            if (comment && comment.postId) {
                postCommentsMap[comment.postId] = comment.details;
            }
        });

        postLikes.forEach(like => {
            if (like && like.postId) {
                postLikesMap[like.postId] = like.details;
            }
        });

        postShares.forEach(share => {
            if (share && share.postId) {
                postSharesMap[share.postId] = share.details;
            }
        });

        // Add user details to each post
        const postsWithUserDetails = response?.data?.data?.map(post => ({
            ...post,
            userDetail: userDetailsMap[post?.post_created_by?.username],
            postMedias: postMediasMap[post?.documentId],
            postComments: postCommentsMap[post?.documentId],
            postLikes: postLikesMap[post?.documentId],
            postShares: postSharesMap[post?.documentId]
        }));

        return {
            ...response?.data,
            data: postsWithUserDetails
        };
    };

    return useQuery(['post'], fetchPost, {
        enabled: true,
        refetchOnWindowFocus: false,
    });
};

export const useSuggestGroup = (userId) => {
    const fetchListSuggestGroup = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/groups/users/${userId}/stats?page=1&limit=100&isMember=false`)
        return response?.data
    };
    return useQuery(['query-list-suggest-group', userId], fetchListSuggestGroup, {
        enabled: !!userId,
        refetchOnWindowFocus: false,
    });
}

export const useListJoinedGroup = (userId) => {
    const fetchListJoinedGroup = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/groups/users/${userId}/stats?page=1&limit=100&isMember=true`)
        return response?.data
    };
    return useQuery(['query-list-joined-group', userId], fetchListJoinedGroup, {
        enabled: !!userId,
        refetchOnWindowFocus: false,
    });
}

// Get all groups of user
export const useGroup = (documentId) => {
    const fetchGroups = async ({ pageParam = 1 }) => {
        try {
            // Fetch groups with all necessary data in a single request
            const response = await apiClient.get(
                `${API_BASE_URL}/group-members/groups?userId=${documentId}&limit=10&page=${pageParam}&sortBy=createdAt&sortOrder=desc`
            );

            const groups = response?.data?.data || [];

            await Promise.all(groups.map(async group => {
                const postGroup = await apiClient.get(`${API_BASE_URL}/posts?page=1&limit=1&sortBy=createdAt&sortOrder=desc&groupId=${group?.group?.documentId}`)
                group.posts = postGroup?.data?.data
            }));

            // Calculate if there's a next page
            const totalPages = Math.ceil(response?.data?.pagination?.total / response?.data?.pagination?.limit);
            const nextPage = pageParam < totalPages ? pageParam + 1 : undefined;

            return {
                data: groups,
                nextPage,
                totalPages
            };
        } catch (error) {
            console.error("Error fetching groups:", error);
            throw error;
        }
    };

    return useInfiniteQuery(['query-groups-posts', documentId], fetchGroups, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        refetchOnWindowFocus: false,
    });
};

export const useGroupMember = (groupId) => {
    const fetchGroupMember = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/group-members?populate=*&filters[$and][0][group_id][documentId][$eq]=${groupId}`)

        await Promise.all(response?.data?.data?.map(async member => {
            const detailUser = await apiClient.get(`${API_BASE_URL}/users?filters[$and][0][username][$eq]=${member?.user_id?.username}&populate[0]=avatar_url_id`)
            member.detailUser = detailUser?.data[0]
            return member
        }))


        return response?.data
    }
    return useQuery(['query-group-member', groupId], fetchGroupMember, {
        enabled: !!groupId, // Only run if groupId is available
        refetchOnWindowFocus: false,
    })
}

export const usePostGroup = (documentId) => {
    const fetchPostGroup = async ({ pageParam = 1 }) => {
        const response = await apiClient.get(`${API_BASE_URL}/posts?page=${pageParam}&limit=10&sortBy=createdAt&sortOrder=desc&groupId=${documentId}`)
        const totalPages = Math.ceil(response?.data?.pagination?.total / response?.data?.pagination?.limit);
        const nextPage = pageParam < totalPages ? pageParam + 1 : undefined;

        return {
            data: response?.data?.data,
            nextPage,
            totalPages
        };
    }
    return useInfiniteQuery(['query-post-group', documentId], fetchPostGroup, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: !!documentId,
        refetchOnWindowFocus: false,
    })
}

//Use for detail group
export const useGroupById = (idGroup) => {
    const fetchGroupById = async () => {
        if (!idGroup) return null;

        try {
            // Fetch group details
            const response = await apiClient.get(
                `${API_BASE_URL}/groups/${idGroup}`
            );

            return response?.data?.data;
        } catch (error) {
            console.error("Error fetching group by ID:", error);
            throw error;
        }
    };

    return useQuery(['query-group-by-id', idGroup], fetchGroupById, {
        enabled: !!idGroup,
        refetchOnWindowFocus: false,
    });
};

export const useMediaGroup = (groupId) => {
    const fetchGroupMember = async ({ pageParam = 1 }) => {
        const response = await apiClient.get(`${API_BASE_URL}/groups/${groupId}/medias?limit=20&page=${pageParam}&sortBy=createdAt&sortOrder=desc`)
        const totalPages = Math.ceil(response?.data?.pagination?.total / response?.data?.pagination?.limit);
        const nextPage = pageParam < totalPages ? pageParam + 1 : undefined;

        return {
            data: response?.data?.data,
            nextPage,
            totalPages
        };
    }
    return useInfiniteQuery(['media-group', groupId], fetchGroupMember, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: !!groupId,
        refetchOnWindowFocus: false,
    })
}

export const useGroupJoinRequest = (groupId) => {
    const fetchGroupJoinRequest = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/group-requests?page=1&limit=100&sortBy=createdAt&sortOrder=desc&groupId=${groupId}`);

        return response?.data;
    }
    return useQuery(['query-group-join-request', groupId], fetchGroupJoinRequest, {
        enabled: !!groupId,
        refetchOnWindowFocus: false,
    })
}

export const useGroupMemberRequest = (groupId, username) => {
    const fetchGroupMemberRequest = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/group-requests?populate=*&filters[$and][0][group_id][documentId][$eq]=${groupId}&filters[$and][1][request_status][$eq]=pending&filters[$and][2][user_request][username][$eq]=${username}`);
        return response?.data;
    }
    return useQuery(['query-group-member-request', groupId, username], fetchGroupMemberRequest, {
        enabled: !!groupId && !!username,
        refetchOnWindowFocus: false,
    })
}

export const useNotificationGroup = (groupId, userId) => {
    const fetchNotificationGroup = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/user-settings?populate=*&filters[$and][0][group_id][documentId][$eq]=${groupId}&filters[$and][1][user_id][documentId][$eq]=${userId}&filters[$and][2][notice_type_id][name_en][$eq]=Notification&filters[$and][4][is_enabled][$eq]=true`);
        return response?.data;
    }

    return useQuery(['query-notification-group', groupId, userId], fetchNotificationGroup, {
        enabled: !!groupId && !!userId,
        refetchOnWindowFocus: false,
    })
}
