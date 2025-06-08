import { API_BASE_URL } from '@/constants';
import apiClient from '@/utils/api';
import { useInfiniteQuery, useQuery } from 'react-query';
import dayjs from 'dayjs';
// Hook to fetch events
export const useEvents = (filters = {}) => {
    const fetchEvents = async ({ pageParam = 1 }) => {
        let query = `?page=${filters.page || pageParam}&limit=${filters.limit || 10}&includeDeleted=true`

        filters?.search ? query += `&search=${filters.search}` : null

        filters?.status ? query += `&status=${filters.status}` : null

        filters?.startDate ? query += `&startDate=${filters.startDate}` : null
        filters?.endDate ? query += `&endDate=${filters.endDate}` : null

        filters?.sortBy === 'date_desc' ? query += `&sortBy=createdAt&sortOrder=DESC` : null
        filters?.sortBy === 'date_asc' ? query += `&sortBy=createdAt&sortOrder=ASC` : null
        filters?.sortBy === 'name' ? query += `&sortBy=name&sortOrder=ASC` : null

        filters?.dateRange ? query += `&startDate=${dayjs(filters.dateRange[0]).format('YYYY-MM-DD')}&endDate=${dayjs(filters.dateRange[1]).format('YYYY-MM-DD')}` : null

        const response = await apiClient.get(`${API_BASE_URL}/events${query}`)
        return response?.data
    }

    return useInfiniteQuery(['admin-query-events', filters], fetchEvents, {
        getNextPageParam: (lastPage, pages) => lastPage.nextPage,
        refetchOnWindowFocus: false
    });
};
