import { useQuery } from 'react-query';

// Mock data for category supports
const mockCategorySupports = [
    {
        documentId: '1',
        name_vi: 'Hỗ trợ kỹ thuật',
        name_en: 'Technical Support',
        description_vi: 'Hỗ trợ các vấn đề kỹ thuật liên quan đến hệ thống',
        description_en: 'Support for technical issues related to the system',
        createdAt: '2023-01-10T08:30:00Z',
        updatedAt: '2023-01-10T08:30:00Z',
        deletedAt: null
    },
    {
        documentId: '2',
        name_vi: 'Hỗ trợ học tập',
        name_en: 'Learning Support',
        description_vi: 'Hỗ trợ các vấn đề liên quan đến học tập',
        description_en: 'Support for issues related to learning',
        createdAt: '2023-01-12T09:45:00Z',
        updatedAt: '2023-01-12T09:45:00Z',
        deletedAt: null
    },
    {
        documentId: '3',
        name_vi: 'Hỗ trợ tài khoản',
        name_en: 'Account Support',
        description_vi: 'Hỗ trợ các vấn đề liên quan đến tài khoản người dùng',
        description_en: 'Support for issues related to user accounts',
        createdAt: '2023-01-15T10:15:00Z',
        updatedAt: '2023-01-15T10:15:00Z',
        deletedAt: null
    },
    {
        documentId: '4',
        name_vi: 'Góp ý, báo lỗi',
        name_en: 'Feedback and Bug Report',
        description_vi: 'Nhận góp ý và báo cáo lỗi từ người dùng',
        description_en: 'Receive feedback and bug reports from users',
        createdAt: '2023-01-20T14:30:00Z',
        updatedAt: '2023-01-20T14:30:00Z',
        deletedAt: null
    },
    {
        documentId: '5',
        name_vi: 'Hỗ trợ khác',
        name_en: 'Other Support',
        description_vi: 'Các vấn đề hỗ trợ khác',
        description_en: 'Other support issues',
        createdAt: '2023-01-25T11:20:00Z',
        updatedAt: '2023-01-25T11:20:00Z',
        deletedAt: null
    }
];

// Hook to fetch category supports with filtering, sorting, and pagination
export const useCategorySupports = (filters = {}) => {
    return useQuery(
        ['categorySupports', filters],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredData = [...mockCategorySupports];

            // Apply name filter if provided
            if (filters.name) {
                const searchTerm = filters.name.toLowerCase();
                filteredData = filteredData.filter(category =>
                    category.name_vi.toLowerCase().includes(searchTerm) ||
                    category.name_en.toLowerCase().includes(searchTerm) ||
                    (category.description_vi && category.description_vi.toLowerCase().includes(searchTerm)) ||
                    (category.description_en && category.description_en.toLowerCase().includes(searchTerm))
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

// Hook to fetch a single category support by ID
export const useCategorySupport = (id) => {
    return useQuery(
        ['categorySupport', id],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const category = mockCategorySupports.find(cat => cat.documentId === id);

            if (!category) {
                throw new Error('Category support not found');
            }

            return category;
        },
        {
            enabled: !!id // Only run the query if an ID is provided
        }
    );
};

// Hook to fetch all category supports (for dropdowns, etc.)
export const useAllCategorySupports = () => {
    return useQuery(
        'allCategorySupports',
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            return mockCategorySupports;
        }
    );
};
