import { API_BASE_URL } from '@/constants';
import apiClient from '@/utils/api';
import { useQuery } from 'react-query';

// Hook to fetch specializations
export const useSpecializations = () => {
    const fetchSpecializations = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/specializeds?page=1&limit=100&sortOrder=desc&sortBy=updatedAt&includeDeleted=true`);
        return response.data;
    }
    return useQuery(['admin-query-specialization'], fetchSpecializations, {
        refetchOnWindowFocus: false
    });
};

// Hook to fetch faculties for dropdown selection
export const useFacultiesDropdown = () => {
    return useQuery('facultiesDropdown', async () => {
        const response = await apiClient.get(`${API_BASE_URL}/faculties?page=1&limit=100&sortOrder=asc&sortBy=name_vi`);
        return response.data.data;
    }, {
        refetchOnWindowFocus: false
    });
};
