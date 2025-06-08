import { useInfiniteQuery, useQuery } from 'react-query';
import { API_BASE_URL } from '@/constants';
import apiClient from '@/utils/api';

// Hook to fetch subjects with filters
export const useSubjects = (filters = {}) => {
    return useQuery(['admin-query-subjects', filters], async () => {
        let query = `?page=${filters.page || 1}&limit=${filters.limit || 10}&includeDeleted=true`;

        // Add search filter if provided
        if (filters.search) {
            query += `&search=${filters.search}`;
        }

        // Add specialization filter if provided
        if (filters.specialized_id) {
            query += `&specialized_id=${filters.specialized_id}`;
        }

        // Add category filter if provided
        if (filters.category_id) {
            query += `&category_id=${filters.category_id}`;
        }

        // Add sorting
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'code_asc':
                    query += '&sortBy=subject_code&sortOrder=asc';
                    break;
                case 'code_desc':
                    query += '&sortBy=subject_code&sortOrder=desc';
                    break;
                case 'name_asc':
                    query += '&sortBy=name&sortOrder=asc';
                    break;
                case 'name_desc':
                    query += '&sortBy=name&sortOrder=desc';
                    break;
                case 'credits_asc':
                    query += '&sortBy=credits&sortOrder=asc';
                    break;
                case 'credits_desc':
                    query += '&sortBy=credits&sortOrder=desc';
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

        const response = await apiClient.get(`${API_BASE_URL}/subjects${query}`);
        return response.data;
    }, {
        keepPreviousData: true,
        refetchOnWindowFocus: false
    });
};

// Hook to fetch a single subject with all its relationships
export const useSubject = (id) => {
    return useQuery(['subject', id], async () => {
        if (!id) return null;
        const response = await apiClient.get(`${API_BASE_URL}/subjects/${id}?includeRelationships=true`);
        return response.data;
    }, {
        enabled: !!id,
        refetchOnWindowFocus: false
    });
};

// Hook to fetch all subjects for dropdowns
export const useAllSubjects = () => {
    return useQuery('all-subjects-dropdown', async () => {
        const response = await apiClient.get(`${API_BASE_URL}/subjects?page=1&limit=100&sortOrder=asc&sortBy=name`);
        return response.data.data;
    }, {
        refetchOnWindowFocus: false
    });
};

// Hook to fetch all specializations for dropdowns
export const useAllSpecializations = () => {
    return useQuery('all-specializations-dropdown', async () => {
        const response = await apiClient.get(`${API_BASE_URL}/specializeds?page=1&limit=100&sortOrder=asc&sortBy=name_vi`);
        return response.data.data;
    }, {
        refetchOnWindowFocus: false
    });
};

// Hook to fetch all categories for dropdowns
export const useAllCategories = () => {
    return useQuery('all-categories-dropdown', async () => {
        const response = await apiClient.get(`${API_BASE_URL}/categories?page=1&limit=100&sortOrder=asc&sortBy=name_vi`);
        return response.data.data;
    }, {
        refetchOnWindowFocus: false
    });
};

// Hook to fetch all batches for dropdowns
export const useAllBatches = () => {
    return useQuery('all-batches-dropdown', async () => {
        const response = await apiClient.get(`${API_BASE_URL}/batches?page=1&limit=100&sortOrder=asc&sortBy=name`);
        return response.data.data;
    }, {
        refetchOnWindowFocus: false
    });
};
