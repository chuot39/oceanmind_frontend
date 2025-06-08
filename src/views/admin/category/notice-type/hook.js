import { useQuery } from 'react-query';

// Mock data for notice types
const mockNoticeTypes = [
    {
        documentId: '1',
        name_vi: 'Thông báo hệ thống',
        name_en: 'System Notification',
        description_vi: 'Thông báo từ hệ thống về bảo trì, cập nhật, v.v.',
        description_en: 'Notifications from the system about maintenance, updates, etc.',
        createdAt: '2023-01-10T08:30:00Z',
        updatedAt: '2023-01-10T08:30:00Z',
        deletedAt: null
    },
    {
        documentId: '2',
        name_vi: 'Thông báo khóa học',
        name_en: 'Course Notification',
        description_vi: 'Thông báo liên quan đến khóa học, bài tập, v.v.',
        description_en: 'Notifications related to courses, assignments, etc.',
        createdAt: '2023-01-12T09:45:00Z',
        updatedAt: '2023-01-12T09:45:00Z',
        deletedAt: null
    },
    {
        documentId: '3',
        name_vi: 'Thông báo sự kiện',
        name_en: 'Event Notification',
        description_vi: 'Thông báo về các sự kiện, hội thảo, v.v.',
        description_en: 'Notifications about events, workshops, etc.',
        createdAt: '2023-01-15T10:15:00Z',
        updatedAt: '2023-01-15T10:15:00Z',
        deletedAt: null
    },
    {
        documentId: '4',
        name_vi: 'Thông báo khẩn cấp',
        name_en: 'Emergency Notification',
        description_vi: 'Thông báo khẩn cấp cần được chú ý ngay lập tức',
        description_en: 'Urgent notifications that require immediate attention',
        createdAt: '2023-01-20T14:30:00Z',
        updatedAt: '2023-01-20T14:30:00Z',
        deletedAt: null
    },
    {
        documentId: '5',
        name_vi: 'Thông báo cá nhân',
        name_en: 'Personal Notification',
        description_vi: 'Thông báo cá nhân gửi riêng cho người dùng',
        description_en: 'Personal notifications sent specifically to the user',
        createdAt: '2023-01-25T11:20:00Z',
        updatedAt: '2023-01-25T11:20:00Z',
        deletedAt: null
    }
];

// Hook to fetch notice types with filtering, sorting, and pagination
export const useNoticeTypes = (filters = {}) => {
    return useQuery(
        ['noticeTypes', filters],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredData = [...mockNoticeTypes];

            // Apply name filter if provided
            if (filters.name) {
                const searchTerm = filters.name.toLowerCase();
                filteredData = filteredData.filter(type =>
                    type.name_vi.toLowerCase().includes(searchTerm) ||
                    type.name_en.toLowerCase().includes(searchTerm) ||
                    (type.description_vi && type.description_vi.toLowerCase().includes(searchTerm)) ||
                    (type.description_en && type.description_en.toLowerCase().includes(searchTerm))
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

// Hook to fetch a single notice type by ID
export const useNoticeType = (id) => {
    return useQuery(
        ['noticeType', id],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const noticeType = mockNoticeTypes.find(type => type.documentId === id);

            if (!noticeType) {
                throw new Error('Notice type not found');
            }

            return noticeType;
        },
        {
            enabled: !!id // Only run the query if an ID is provided
        }
    );
};

// Hook to fetch all notice types (for dropdowns, etc.)
export const useAllNoticeTypes = () => {
    return useQuery(
        'allNoticeTypes',
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            return mockNoticeTypes;
        }
    );
};
