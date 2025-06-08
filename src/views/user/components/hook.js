import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from "react-query";
import { API_BASE_URL } from "../../../constants";
import apiClient from "../../../utils/api";
import socialApiService from "@/services/api/socialApiService";
import moment from "moment";

export const useFriend = (userId) => {
    const fetchFriends = async ({ pageParam = 1 }) => {
        const response = await apiClient.get(`${API_BASE_URL}/friendships/users/${userId}?page=${pageParam}&limit=30`);
        return {
            data: response?.data?.data || [],
            nextPage: response?.data?.pagination?.totalPages > pageParam ? pageParam + 1 : undefined,
            totalPages: response?.data?.pagination?.totalPages || 1
        };
    };

    return useInfiniteQuery(['query-friends', userId], fetchFriends, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: !!userId,
        refetchOnWindowFocus: false,
    });
}

//used in card suggest friend
export const useSuggestFriend = (userId) => {
    const fetchSuggestFriend = async ({ pageParam = 1 }) => {
        const response = await apiClient.get(`${API_BASE_URL}/friendships/suggestions?userId=${userId}&limit=30&page=${pageParam}`)
        return {
            data: response?.data?.data || [],
            nextPage: response?.data?.pagination?.totalPages > pageParam ? pageParam + 1 : undefined,
            totalPages: response?.data?.pagination?.totalPages || 1
        };
    };
    return useInfiniteQuery(['query-suggestFriend', userId], fetchSuggestFriend, {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        enabled: !!userId,
        refetchOnWindowFocus: false,
    });
}

export const useDetailClass = (classId) => {
    const fetchDetailClass = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/classes/${classId}?populate[specialized_id][populate]=*`)
        return response?.data
    }

    return useQuery(['detail-class', classId], fetchDetailClass, {
        enabled: !!classId, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

//used in card task
export const useUserTaskCount = (documentId) => {

    const fetchTaskUser = async () => {
        const today = moment().format('YYYY-MM-DD')

        const taskUser = {}
        const response = await apiClient.get(`${API_BASE_URL}/tasks?task_assigned_to=${documentId}&limit=1`);
        const responseCompleted = await apiClient.get(`${API_BASE_URL}/tasks?task_assigned_to=${documentId}&limit=1&is_completed=true`);
        const responseIncompleted = await apiClient.get(`${API_BASE_URL}/tasks?task_assigned_to=${documentId}&limit=1&is_completed=false`);
        const responseOverdue = await apiClient.get(`${API_BASE_URL}/tasks?task_assigned_to=${documentId}&limit=1&is_completed=false&due_date_end=${today}`);

        taskUser.total = response?.data?.pagination?.total
        taskUser.completed = responseCompleted?.data?.pagination?.total
        taskUser.incompleted = responseIncompleted?.data?.pagination?.total
        taskUser.overdue = responseOverdue?.data?.pagination?.total

        return taskUser;
    }

    return useQuery(['query-taskUser', documentId], fetchTaskUser, {
        enabled: !!documentId,
        refetchOnWindowFocus: false,
    });
}

export const useTag = (search) => {
    const fetchTag = async () => {
        const searchQuery = search ? `/search/${search}` : '';
        const response = await apiClient.get(`${API_BASE_URL}/tags${searchQuery}`);
        return response?.data;
    };

    return useQuery(['tag', search], fetchTag, {
        enabled: true, // Always fetch initial data
        refetchOnWindowFocus: false,
        keepPreviousData: true, // Keep old data while fetching new data
    });
};

export const useReportPost = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ postId, userId, reason, email }) => {
            return await socialApiService.reportPost({
                post_id: postId,
                user_id: userId,
                reason: reason,
                notification_email: email || null
            });
        },
        {
            onSuccess: () => {
                // No need to invalidate queries as reporting doesn't change the post list
                notifySuccess('Report submitted successfully');
            },
            onError: (error) => {
                console.error("Error reporting post:", error);
                message.error('Failed to submit report. Please try again.');
                throw error;
            }
        }
    );
};

//used in card group
export const useGroupUser = (userId) => {
    const fetchGroupUser = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/group-members/groups?userId=${userId}`)

        console.log('response: ', response)
        const groupItems = response?.data?.data?.map(group => group.group)

        const fetchAllMembersByGroup = async (groupItem) => {
            // Fetch first page to get pagination info
            const fetchPage = async (page) => {
                const response = await apiClient.get(
                    `${API_BASE_URL}/group-members/groups/${groupItem.documentId}/members?page=${page}&limit=50`
                );
                return response?.data;
            };

            const firstPageData = await fetchPage(1);
            const totalPages = firstPageData?.meta?.pagination?.pageCount || 1;
            let members = [...(firstPageData?.data || [])];

            if (totalPages > 1) {
                const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
                const remainingData = await Promise.all(
                    remainingPages.map(page => fetchPage(page))
                );

                remainingData.forEach(data => {
                    if (data?.data) {
                        members = [...members, ...data.data];
                    }
                });
            }

            return {
                group: groupItem,
                members,
            };
        };

        // Fetch members for all groupIds
        const allGroupsData = await Promise.all(groupItems.map(fetchAllMembersByGroup));
        return allGroupsData;

        // return response?.data
    }

    return useQuery(['query-group-user', userId], fetchGroupUser, {
        enabled: !!userId, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

export const useGroupMembers = (groupIds = []) => {
    const fetchGroupMembers = async () => {
        if (!groupIds.length) return [];

        const fetchAllMembersByGroup = async (groupId) => {
            // Fetch first page to get pagination info
            const fetchPage = async (page) => {
                const response = await apiClient.get(
                    `${API_BASE_URL}/group-members/groups/${groupId}/members?page=${page}&limit=50`
                );
                return response?.data;
            };

            const firstPageData = await fetchPage(1);
            const totalPages = firstPageData?.meta?.pagination?.pageCount || 1;
            let members = [...(firstPageData?.data || [])];

            if (totalPages > 1) {
                const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
                const remainingData = await Promise.all(
                    remainingPages.map(page => fetchPage(page))
                );

                remainingData.forEach(data => {
                    if (data?.data) {
                        members = [...members, ...data.data];
                    }
                });
            }

            return {
                groupId,
                members,
            };
        };

        // Fetch members for all groupIds
        const allGroupsData = await Promise.all(groupIds.map(fetchAllMembersByGroup));
        return allGroupsData;
    };

    return useQuery(['group-members-with-details', groupIds], fetchGroupMembers, {
        enabled: groupIds.length > 0,
        refetchOnWindowFocus: false,
    });
};

//used in card notice
export const useUserNotice = (userId) => {
    const fetchNotifications = async ({ pageParam = 1 }) => {
        const response = await apiClient.get(
            `${API_BASE_URL}/user-notifications?user_id=${userId}&sort=createdAt:DESC&page=${pageParam}&limit=10&sortBy=createdAt&sortOrder=DESC`
        );
        return response?.data;
    };

    return useInfiniteQuery(['query-user-notice', userId], fetchNotifications,
        {
            enabled: !!userId,
            refetchOnWindowFocus: false,
            getNextPageParam: (lastPage) => {
                const { currentPage, totalPages } = lastPage.pagination;
                return currentPage < totalPages ? currentPage + 1 : undefined;
            }
        }
    );
};

export const useUserTask = (filterParams) => {
    const fetchUserTask = async () => {
        if (!filterParams || !filterParams.task_assigned_to) return null;

        // Build query string from filterParams
        const queryParams = new URLSearchParams();
        Object.entries(filterParams).forEach(([key, value]) => {
            queryParams.append(key, value);
        });

        const response = await apiClient.get(`${API_BASE_URL}/tasks?${queryParams.toString()}`);
        return response?.data;
    };

    return useQuery(['query-user-task', filterParams], fetchUserTask, {
        enabled: !!filterParams?.task_assigned_to,
        refetchOnWindowFocus: false,
    });
}
