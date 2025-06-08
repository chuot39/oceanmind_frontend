import { useQuery } from 'react-query';

// Mock data for subject categories
const mockSubjectCategories = [
    {
        documentId: '1',
        name_vi: 'Cơ sở ngành',
        name_en: 'Foundation',
        createdAt: '2023-01-10T08:30:00Z',
        updatedAt: '2023-01-10T08:30:00Z',
        deletedAt: null
    },
    {
        documentId: '2',
        name_vi: 'Chuyên ngành',
        name_en: 'Specialization',
        createdAt: '2023-01-12T09:45:00Z',
        updatedAt: '2023-01-12T09:45:00Z',
        deletedAt: null
    },
    {
        documentId: '3',
        name_vi: 'Đại cương',
        name_en: 'General',
        createdAt: '2023-01-15T10:15:00Z',
        updatedAt: '2023-01-15T10:15:00Z',
        deletedAt: null
    },
    {
        documentId: '4',
        name_vi: 'Tự chọn',
        name_en: 'Elective',
        createdAt: '2023-01-20T14:30:00Z',
        updatedAt: '2023-01-20T14:30:00Z',
        deletedAt: null
    },
    {
        documentId: '5',
        name_vi: 'Thực hành',
        name_en: 'Practical',
        createdAt: '2023-01-25T11:20:00Z',
        updatedAt: '2023-01-25T11:20:00Z',
        deletedAt: null
    }
];

// Hook to fetch subject categories with filtering, sorting, and pagination
export const useSubjectCategories = (filters = {}) => {
    return useQuery(
        ['subjectCategories', filters],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredData = [...mockSubjectCategories];

            // Apply name filter if provided
            if (filters.name) {
                const searchTerm = filters.name.toLowerCase();
                filteredData = filteredData.filter(category =>
                    category.name_vi.toLowerCase().includes(searchTerm) ||
                    category.name_en.toLowerCase().includes(searchTerm)
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

// Hook to fetch a single subject category by ID
export const useSubjectCategory = (id) => {
    return useQuery(
        ['subjectCategory', id],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const category = mockSubjectCategories.find(cat => cat.documentId === id);

            if (!category) {
                throw new Error('Subject category not found');
            }

            return category;
        },
        {
            enabled: !!id // Only run the query if an ID is provided
        }
    );
};

// Hook to fetch all subject categories (for dropdowns, etc.)
export const useAllSubjectCategories = () => {
    return useQuery(
        'allSubjectCategories',
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            return mockSubjectCategories;
        }
    );
};
