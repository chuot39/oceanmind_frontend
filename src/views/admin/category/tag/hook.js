import { useQuery } from 'react-query';

// Mock data for tags
const mockTags = [
    {
        documentId: '1',
        name_vi: 'Công nghệ',
        name_en: 'Technology',
        createdAt: '2023-01-10T08:30:00Z',
        updatedAt: '2023-01-10T08:30:00Z',
        deletedAt: null
    },
    {
        documentId: '2',
        name_vi: 'Giáo dục',
        name_en: 'Education',
        createdAt: '2023-01-12T09:45:00Z',
        updatedAt: '2023-01-12T09:45:00Z',
        deletedAt: null
    },
    {
        documentId: '3',
        name_vi: 'Khoa học',
        name_en: 'Science',
        createdAt: '2023-01-15T10:15:00Z',
        updatedAt: '2023-01-15T10:15:00Z',
        deletedAt: null
    },
    {
        documentId: '4',
        name_vi: 'Du lịch',
        name_en: 'Travel',
        createdAt: '2023-01-20T14:30:00Z',
        updatedAt: '2023-01-20T14:30:00Z',
        deletedAt: null
    },
    {
        documentId: '5',
        name_vi: 'Sức khỏe',
        name_en: 'Health',
        createdAt: '2023-01-25T11:20:00Z',
        updatedAt: '2023-01-25T11:20:00Z',
        deletedAt: null
    }
];

// Hook to fetch tags with filtering, sorting, and pagination
export const useTags = (filters = {}) => {
    return useQuery(
        ['tags', filters],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredData = [...mockTags];

            // Apply name filter if provided
            if (filters.name) {
                const searchTerm = filters.name.toLowerCase();
                filteredData = filteredData.filter(tag =>
                    tag.name_vi.toLowerCase().includes(searchTerm) ||
                    tag.name_en.toLowerCase().includes(searchTerm)
                );
            }

            // Apply sorting if provided
            if (filters.sorter) {
                const { field, order } = filters.sorter;
                filteredData.sort((a, b) => {
                    let comparison = 0;
                    if (a[field] < b[field]) comparison = -1;
                    if (a[field] > b[field]) comparison = 1;
                    return order === 'ascend' ? comparison : -comparison;
                });
            }

            // Calculate pagination
            const total = filteredData.length;
            const { current = 1, pageSize = 10 } = filters.pagination || {};
            const start = (current - 1) * pageSize;
            const end = start + pageSize;
            const paginatedData = filteredData.slice(start, end);

            return {
                data: paginatedData,
                pagination: {
                    current,
                    pageSize,
                    total
                }
            };
        },
        {
            keepPreviousData: true
        }
    );
};

// Hook to fetch a single tag by ID
export const useTag = (id) => {
    return useQuery(
        ['tag', id],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const tag = mockTags.find(tag => tag.documentId === id);

            if (!tag) {
                throw new Error('Tag not found');
            }

            return tag;
        },
        {
            enabled: !!id // Only run the query if an ID is provided
        }
    );
};

// Hook to fetch all tags (for dropdowns, etc.)
export const useAllTags = () => {
    return useQuery(
        'allTags',
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            return mockTags;
        }
    );
};
