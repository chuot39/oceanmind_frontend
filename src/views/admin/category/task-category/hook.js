import { useQuery } from 'react-query';

// Mock data for task categories
const mockTaskCategories = [
    {
        documentId: '1',
        name_vi: 'Nhiệm vụ hàng ngày',
        name_en: 'Daily Task',
        task_priority: 1,
        createdAt: '2023-01-10T08:30:00Z',
        updatedAt: '2023-01-10T08:30:00Z',
        deletedAt: null
    },
    {
        documentId: '2',
        name_vi: 'Nhiệm vụ hàng tuần',
        name_en: 'Weekly Task',
        task_priority: 2,
        createdAt: '2023-01-12T09:45:00Z',
        updatedAt: '2023-01-12T09:45:00Z',
        deletedAt: null
    },
    {
        documentId: '3',
        name_vi: 'Nhiệm vụ hàng tháng',
        name_en: 'Monthly Task',
        task_priority: 3,
        createdAt: '2023-01-15T10:15:00Z',
        updatedAt: '2023-01-15T10:15:00Z',
        deletedAt: null
    },
    {
        documentId: '4',
        name_vi: 'Nhiệm vụ khẩn cấp',
        name_en: 'Urgent Task',
        task_priority: 0,
        createdAt: '2023-01-20T14:30:00Z',
        updatedAt: '2023-01-20T14:30:00Z',
        deletedAt: null
    },
    {
        documentId: '5',
        name_vi: 'Nhiệm vụ dài hạn',
        name_en: 'Long-term Task',
        task_priority: 4,
        createdAt: '2023-01-25T11:20:00Z',
        updatedAt: '2023-01-25T11:20:00Z',
        deletedAt: null
    }
];

// Hook to fetch task categories with filtering, sorting, and pagination
export const useTaskCategories = (filters = {}) => {
    return useQuery(
        ['taskCategories', filters],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredData = [...mockTaskCategories];

            // Apply name filter if provided
            if (filters.name) {
                const searchTerm = filters.name.toLowerCase();
                filteredData = filteredData.filter(category =>
                    category.name_vi.toLowerCase().includes(searchTerm) ||
                    category.name_en.toLowerCase().includes(searchTerm)
                );
            }

            // Apply priority filter if provided
            if (filters.priority !== undefined) {
                filteredData = filteredData.filter(category =>
                    category.task_priority === filters.priority
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

// Hook to fetch a single task category by ID
export const useTaskCategory = (id) => {
    return useQuery(
        ['taskCategory', id],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const category = mockTaskCategories.find(cat => cat.documentId === id);

            if (!category) {
                throw new Error('Task category not found');
            }

            return category;
        },
        {
            enabled: !!id // Only run the query if an ID is provided
        }
    );
};

// Hook to fetch all task categories (for dropdowns, etc.)
export const useAllTaskCategories = () => {
    return useQuery(
        'allTaskCategories',
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            return mockTaskCategories;
        }
    );
};
