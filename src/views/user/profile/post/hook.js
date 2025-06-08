import { useQuery } from "react-query"
import apiClient from "../../../../utils/api"
import { API_BASE_URL } from "../../../../constants"
import { useSelector } from "react-redux"


export const usePost = (username) => {
    const fetchPost = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/posts?filters[$and][0][post_created_by][username][$eq]=${username}&populate=*&pagination[pageSize]=100&pagination[page]=1&sort=createdAt:desc`);

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