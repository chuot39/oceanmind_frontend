import { useInfiniteQuery, useQuery } from "react-query"
import { API_BASE_URL } from "../../../../constants"
import apiClient from "../../../../utils/api"
import moment from "moment"

//used in card carousel
export const useEvent = () => {
    const fetchEvent = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/events?sort=createdAt:desc&limit=1`)
        return response?.data
    }

    return useQuery(['query-event'], fetchEvent, {
        enabled: true, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

export const useEventDetail = () => {
    const fetchEvents = async ({ pageParam = 1 }) => {
        const response = await apiClient.get(
            `${API_BASE_URL}/events?sort=createdAt:desc&page=${pageParam}&limit=10`
        );
        return response?.data;
    };

    return useInfiniteQuery(['query-event-detail'], fetchEvents, {
        enabled: true,
        refetchOnWindowFocus: false,
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.pagination;
            return currentPage < totalPages ? currentPage + 1 : undefined;
        }
    });
};

//used in card carousel 
export const useTaskInWeek = () => {
    const startOfWeek = moment().startOf('week').format('YYYY-MM-DD')
    const endOfWeek = moment().endOf('week').format('YYYY-MM-DD')
    const fetchTaskInWeek = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/tasks?startDate=${startOfWeek}&endDate=${endOfWeek}&limit=1`)
        return response?.data
    }

    return useQuery(['task-in-week'], fetchTaskInWeek, {
        enabled: true, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

//used in card carousel
export const usePost = () => {
    const fetchPost = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/posts?limit=1`)
        return response?.data
    }

    return useQuery(['post'], fetchPost, {
        enabled: true, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

//used in card post of month
export const useUserPost = (userId) => {
    const fetchUserPost = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/posts?post_created_by=${userId}`)
        return response?.data
    }

    return useQuery(['query-user-post', userId], fetchUserPost, {
        enabled: !!userId, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

//used in card carousel
export const useTaskUserCurrentWeek = (userId) => {
    const startOfWeek = moment().startOf('week').format('YYYY-MM-DD')
    const endOfWeek = moment().endOf('week').format('YYYY-MM-DD')
    const fetchTaskUserCurrentWeek = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/tasks?task_assigned_to=${userId}&startDate=${startOfWeek}&endDate=${endOfWeek}&limit=100`)
        return response?.data
    }

    return useQuery(['query-task-user-current-week', userId], fetchTaskUserCurrentWeek, {
        enabled: !!userId, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

//used 
export const useGroup = () => {
    const fetchGroup = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/groups?limit=1`)
        return response?.data
    }

    return useQuery(['query-group'], fetchGroup, {
        enabled: true, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

//used in card carousel
export const useUserOnline = () => {
    const fetchUserOnline = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/users?isOnline=true`)
        return response?.data
    }

    return useQuery(['query-user-online'], fetchUserOnline, {
        enabled: true, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}


//used in card training process
export const useTrainingProcess = (documentId) => {
    const fetchUserTrainingProcess = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/scores?studentId=${documentId}&limit=100`)
        return response?.data
    }

    return useQuery(['user-training-process', documentId], fetchUserTrainingProcess, {
        enabled: !!documentId, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

