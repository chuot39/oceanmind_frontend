import { API_BASE_URL } from '@/constants';
import apiClient from '@/utils/api';
import { useInfiniteQuery, useQuery } from 'react-query';



// Hook to fetch notifications
export const useNotifications = (filters = {}) => {

    const fetchNotifications = async ({ pageParam = 1 }) => {
        let query = `?page=${filters.page || pageParam}&limit=${filters.limit || 10}&sortBy=createdAt&sortOrder=DESC&includeUser=true&includeDeleted=true`

        filters?.search ? query += `&title=${filters.search}` : null
        filters?.noticeType ? query += `&notice_type_id=${filters.noticeType}` : null
        filters?.isGlobal ? query += `&global=${filters.isGlobal}` : null
        filters?.startDate ? query += `&startDate=${filters.startDate}` : null
        filters?.endDate ? query += `&endDate=${filters.endDate}` : null
        // filters?.deleted ? query += `&includeDeleted=true` : null

        const response = await apiClient.get(`${API_BASE_URL}/notifications${query}`)
        return response?.data
    }

    return useInfiniteQuery(['admin-query-notifications', filters], fetchNotifications, {
        getNextPageParam: (lastPage, pages) => lastPage.nextPage,
        refetchOnWindowFocus: false
    });
};


// Hook to fetch notice types
export const useNoticeTypes = () => {
    const fetchNoticeTypes = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/notice-types`)
        return response?.data
    }

    return useQuery('admin-query-noticeTypes', fetchNoticeTypes, {
        refetchOnWindowFocus: false
    });
};

// Hook to fetch notification statistics
export const useNotificationStats = () => {
    const fetchNotificationStats = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/user-notifications/stats`)
        return response?.data
    }

    return useQuery('admin-query-notificationStats', fetchNotificationStats, {
        refetchOnWindowFocus: false
    });

};
