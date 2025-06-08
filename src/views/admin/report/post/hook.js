import { useInfiniteQuery, useQuery } from 'react-query';
import apiClient from '@/utils/api';
import { API_BASE_URL } from '@/constants';
import dayjs from 'dayjs';

export const usePostReport = (filters = {}) => {
    const fetchEvents = async ({ pageParam = 1 }) => {

        console.log('filters', filters)
        let query = `?page=${filters.page || pageParam}&limit=${filters.limit || 10}&includeDeleted=true&objReport=post`

        filters?.search ? query += `&search=${filters.search}` : null
        filters?.status_report ? query += `&status_report=${filters.status_report}` : null

        filters?.sortBy === 'oldest' ? query += `&sortBy=createdAt&sortOrder=ASC` : null
        filters?.sortBy === 'newest' ? query += `&sortBy=createdAt&sortOrder=DESC` : null
        filters?.sortBy === 'status_report_asc' ? query += `&sortBy=status_report&sortOrder=ASC` : null
        filters?.sortBy === 'status_report_desc' ? query += `&sortBy=status_report&sortOrder=DESC` : null

        filters?.dateRange ? query += `&startDate=${dayjs(filters.dateRange[0]).format('YYYY-MM-DD')}&endDate=${dayjs(filters.dateRange[1]).format('YYYY-MM-DD')}` : null

        const response = await apiClient.get(`${API_BASE_URL}/reports${query}`)
        return response?.data
    }

    return useInfiniteQuery(['admin-query-posts-report', filters], fetchEvents, {
        getNextPageParam: (lastPage, pages) => lastPage.nextPage,
        refetchOnWindowFocus: false
    });
};

export const usePostDetail = (documentId) => {
    return useQuery(['admin-query-post-detail', documentId], async () => {

        if (!documentId) return null

        const response = await apiClient.get(`${API_BASE_URL}/posts/${documentId}?includeDeleted=true`)
        return response?.data
    })
}
