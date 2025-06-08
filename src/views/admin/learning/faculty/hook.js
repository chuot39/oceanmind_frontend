import { API_BASE_URL } from '@/constants';
import apiClient from '@/utils/api';
import { useQuery } from 'react-query';


// Hook to fetch faculties
export const useFaculties = () => {

    const fetchFaculties = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/faculties?page=1&limit=100&sortOrder=desc&sortBy=updatedAt&includeDeleted=true`);
        return response.data;
    }
    return useQuery(['admin-query-faculty'], fetchFaculties, {
        refetchOnWindowFocus: false
    });
};

// Hook to fetch a single faculty
export const useFaculty = (id) => {
    return useQuery(['faculty', id], async () => {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const faculty = mockFaculties.find(f => f.documentId === id);

        if (!faculty) {
            throw new Error('Faculty not found');
        }

        return faculty;
    }, {
        enabled: !!id,
        refetchOnWindowFocus: false
    });
};
