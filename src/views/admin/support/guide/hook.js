import { useQuery } from 'react-query';

// Mock data for Guides
const mockGuides = [
    {
        documentId: '1',
        title: 'Hướng dẫn đăng ký tài khoản',
        content: 'Bước 1: Truy cập trang chủ của hệ thống.\nBước 2: Nhấp vào nút "Đăng ký" ở góc phải màn hình.\nBước 3: Điền đầy đủ thông tin cá nhân theo yêu cầu.\nBước 4: Xác nhận email và hoàn tất quá trình đăng ký.',
        category_id: '1', // Registration
        createdAt: '2023-01-15T09:30:00Z',
        updatedAt: '2023-01-15T09:30:00Z',
        deletedAt: null,
        category: {
            documentId: '1',
            name_vi: 'Đăng ký tài khoản',
            name_en: 'Registration'
        }
    },
    {
        documentId: '2',
        title: 'Hướng dẫn sử dụng diễn đàn thảo luận',
        content: 'Bước 1: Đăng nhập vào tài khoản của bạn.\nBước 2: Chọn mục "Diễn đàn" trên thanh điều hướng.\nBước 3: Chọn chủ đề hoặc tạo chủ đề mới bằng cách nhấp vào nút "Tạo chủ đề".\nBước 4: Viết nội dung bài đăng và nhấp "Đăng".\nBước 5: Tham gia thảo luận bằng cách bình luận vào các bài đăng khác.',
        category_id: '2', // Forums
        createdAt: '2023-01-20T10:45:00Z',
        updatedAt: '2023-01-20T10:45:00Z',
        deletedAt: null,
        category: {
            documentId: '2',
            name_vi: 'Diễn đàn',
            name_en: 'Forums'
        }
    },
    {
        documentId: '3',
        title: 'Hướng dẫn tải và nộp bài tập',
        content: 'Bước 1: Đăng nhập và truy cập khoá học của bạn.\nBước 2: Tìm bài tập cần nộp và nhấp vào nút "Nộp bài".\nBước 3: Chọn tệp từ máy tính hoặc viết nội dung trực tiếp.\nBước 4: Nhấp vào nút "Nộp" để hoàn tất.\nBước 5: Chờ phản hồi từ giảng viên.',
        category_id: '3', // Assignments
        createdAt: '2023-01-25T11:15:00Z',
        updatedAt: '2023-01-25T11:15:00Z',
        deletedAt: null,
        category: {
            documentId: '3',
            name_vi: 'Bài tập',
            name_en: 'Assignments'
        }
    },
    {
        documentId: '4',
        title: 'Hướng dẫn sử dụng thư viện tài liệu',
        content: 'Bước 1: Đăng nhập vào hệ thống.\nBước 2: Truy cập mục "Thư viện" từ thanh điều hướng.\nBước 3: Sử dụng bộ lọc để tìm kiếm tài liệu theo chủ đề, tác giả hoặc năm xuất bản.\nBước 4: Nhấp vào tài liệu để xem trực tuyến hoặc tải xuống.\nBước 5: Đánh dấu tài liệu yêu thích để truy cập nhanh hơn sau này.',
        category_id: '4', // Library
        createdAt: '2023-01-30T12:30:00Z',
        updatedAt: '2023-01-30T12:30:00Z',
        deletedAt: null,
        category: {
            documentId: '4',
            name_vi: 'Thư viện',
            name_en: 'Library'
        }
    },
    {
        documentId: '5',
        title: 'Hướng dẫn đặt lịch hẹn với giảng viên',
        content: 'Bước 1: Đăng nhập vào tài khoản của bạn.\nBước 2: Truy cập mục "Lịch hẹn" hoặc "Giảng viên".\nBước 3: Tìm kiếm và chọn giảng viên bạn muốn gặp.\nBước 4: Xem lịch trống của giảng viên và chọn thời gian phù hợp.\nBước 5: Điền thông tin lý do cuộc hẹn và xác nhận đặt lịch.',
        category_id: '5', // Appointments
        createdAt: '2023-02-05T14:00:00Z',
        updatedAt: '2023-02-05T14:00:00Z',
        deletedAt: null,
        category: {
            documentId: '5',
            name_vi: 'Lịch hẹn',
            name_en: 'Appointments'
        }
    }
];

// Mock data for categories (imported from category_supports)
const mockCategories = [
    {
        documentId: '1',
        name_vi: 'Đăng ký tài khoản',
        name_en: 'Registration',
        description_vi: 'Hướng dẫn về quy trình đăng ký tài khoản',
        description_en: 'Guides about account registration process'
    },
    {
        documentId: '2',
        name_vi: 'Diễn đàn',
        name_en: 'Forums',
        description_vi: 'Hướng dẫn sử dụng diễn đàn thảo luận',
        description_en: 'Guides for using discussion forums'
    },
    {
        documentId: '3',
        name_vi: 'Bài tập',
        name_en: 'Assignments',
        description_vi: 'Hướng dẫn làm và nộp bài tập',
        description_en: 'Guides for completing and submitting assignments'
    },
    {
        documentId: '4',
        name_vi: 'Thư viện',
        name_en: 'Library',
        description_vi: 'Hướng dẫn sử dụng thư viện tài liệu',
        description_en: 'Guides for using the document library'
    },
    {
        documentId: '5',
        name_vi: 'Lịch hẹn',
        name_en: 'Appointments',
        description_vi: 'Hướng dẫn đặt lịch hẹn với giảng viên',
        description_en: 'Guides for scheduling appointments with instructors'
    }
];

// Hook to fetch Guides with filtering, sorting, and pagination
export const useGuides = (filters = {}) => {
    return useQuery(
        ['guides', filters],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredData = [...mockGuides];

            // Apply search filter if provided
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredData = filteredData.filter(guide =>
                    guide.title.toLowerCase().includes(searchTerm) ||
                    guide.content.toLowerCase().includes(searchTerm)
                );
            }

            // Apply category filter if provided
            if (filters.categoryId) {
                filteredData = filteredData.filter(guide =>
                    guide.category_id === filters.categoryId
                );
            }

            // Apply sorting if provided
            if (filters.sorter) {
                const { field, order } = filters.sorter;
                filteredData.sort((a, b) => {
                    let comparison = 0;
                    if (field === 'category') {
                        const categoryA = mockCategories.find(cat => cat.documentId === a.category_id);
                        const categoryB = mockCategories.find(cat => cat.documentId === b.category_id);
                        if (categoryA?.name_vi < categoryB?.name_vi) comparison = -1;
                        if (categoryA?.name_vi > categoryB?.name_vi) comparison = 1;
                    } else {
                        if (a[field] < b[field]) comparison = -1;
                        if (a[field] > b[field]) comparison = 1;
                    }
                    return order === 'ascend' ? comparison : -comparison;
                });
            }

            // Calculate pagination
            const total = filteredData.length;
            const { current = 1, pageSize = 10 } = filters.pagination || {};
            const start = (current - 1) * pageSize;
            const end = start + pageSize;
            const paginatedData = filteredData.slice(start, end);

            // Add category information to each Guide
            const guides = paginatedData.map(guide => {
                const category = mockCategories.find(cat => cat.documentId === guide.category_id);
                return {
                    ...guide,
                    category
                };
            });

            return {
                data: guides,
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

// Hook to fetch a single Guide by ID
export const useGuide = (id) => {
    return useQuery(
        ['guide', id],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const guide = mockGuides.find(guide => guide.documentId === id);

            if (!guide) {
                throw new Error('Guide not found');
            }

            // Add category information
            const category = mockCategories.find(cat => cat.documentId === guide.category_id);
            return {
                ...guide,
                category
            };
        },
        {
            enabled: !!id // Only run the query if an ID is provided
        }
    );
};

// Hook to fetch all support categories (for dropdown selection)
export const useAllCategories = () => {
    return useQuery(
        'allSupportCategories',
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            return mockCategories;
        }
    );
};
