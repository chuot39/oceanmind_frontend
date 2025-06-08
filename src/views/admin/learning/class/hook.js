import { useQuery } from 'react-query';
import { API_BASE_URL } from '@/constants';
import apiClient from '@/utils/api';

// Hook to fetch classes with filters
export const useClasses = (filters = {}) => {
    const fetchClasses = async () => {
        let query = `?page=${filters.page || 1}&limit=${filters.limit || 10}&includeDeleted=true`;

        // Add search filter if provided
        if (filters.search) {
            query += `&search=${filters.search}`;
        }

        // Add specialization filter if provided
        if (filters.specialized_id) {
            query += `&specializedId=${filters.specialized_id}`;
        }

        // Add batch filter if provided
        if (filters.batche_id) {
            query += `&batcheId=${filters.batche_id}`;
        }

        // Add sorting
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'name_asc':
                    query += '&sortBy=name&sortOrder=asc';
                    break;
                case 'name_desc':
                    query += '&sortBy=name&sortOrder=desc';
                    break;
                case 'newest':
                    query += '&sortBy=createdAt&sortOrder=desc';
                    break;
                case 'oldest':
                    query += '&sortBy=createdAt&sortOrder=asc';
                    break;
                default:
                    query += '&sortBy=updatedAt&sortOrder=desc';
                    break;
            }
        } else {
            query += '&sortBy=updatedAt&sortOrder=desc';
        }

        const response = await apiClient.get(`${API_BASE_URL}/classes${query}`);
        return response.data;
    };

    return useQuery(['admin-query-classes', filters], fetchClasses, {
        keepPreviousData: true,
        refetchOnWindowFocus: false
    });
};

// Hook to fetch specializations for dropdown
export const useSpecializations = () => {
    return useQuery('specializations-dropdown', async () => {
        const response = await apiClient.get(`${API_BASE_URL}/specializeds?page=1&limit=100&sortOrder=asc&sortBy=name_vi`);
        return response.data.data;
    }, {
        refetchOnWindowFocus: false
    });
};

// Hook to fetch batches for dropdown
export const useBatches = () => {
    return useQuery('batches-dropdown', async () => {
        const response = await apiClient.get(`${API_BASE_URL}/batches?page=1&limit=100&sortOrder=asc&sortBy=name`);
        return response.data.data;
    }, {
        refetchOnWindowFocus: false
    });
};
