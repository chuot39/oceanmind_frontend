import { API_BASE_URL } from '@/constants';
import apiClient from '@/utils/api';
import { useQuery } from 'react-query';


// Hook to fetch batches
export const useBatches = () => {

    const fetchBatches = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/batches?page=1&limit=100&sortOrder=desc&sortBy=updatedAt&includeDeleted=true`);
        return response.data;
    }
    return useQuery(['admin-query-batch'], fetchBatches, {
        refetchOnWindowFocus: false
    });
};

// Hook to fetch a single batch
export const useBatch = (id) => {
    return useQuery(['batch', id], async () => {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const batch = mockBatches.find(b => b.documentId === id);

        if (!batch) {
            throw new Error('Batch not found');
        }

        return batch;
    }, {
        enabled: !!id,
        refetchOnWindowFocus: false
    });
};

// Hook to get available years for filtering
export const useYearsForFilter = () => {
    return useQuery('yearsForFilter', async () => {
        // Get the range of years from all batches
        const years = new Set();
        mockBatches.forEach(batch => {
            const startYear = new Date(batch.start_year).getFullYear();
            const endYear = new Date(batch.end_year).getFullYear();
            for (let year = startYear; year <= endYear; year++) {
                years.add(year);
            }
        });

        return Array.from(years).sort((a, b) => b - a); // Sort descending (newest first)
    }, {
        refetchOnWindowFocus: false
    });
};
