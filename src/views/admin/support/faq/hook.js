import { useQuery } from 'react-query';

// Mock data for FAQs
const mockFaqs = [
    {
        documentId: '1',
        question: 'Làm thế nào để đặt lại mật khẩu?',
        answer: 'Để đặt lại mật khẩu, bạn có thể nhấp vào liên kết "Quên mật khẩu" trên trang đăng nhập. Sau đó, làm theo hướng dẫn được gửi đến email của bạn để tạo mật khẩu mới.',
        category_id: '1', // Technical Support
        createdAt: '2023-01-10T08:30:00Z',
        updatedAt: '2023-01-10T08:30:00Z',
        deletedAt: null,
        category: {
            documentId: '1',
            name_vi: 'Hỗ trợ kỹ thuật',
            name_en: 'Technical Support'
        }
    },
    {
        documentId: '2',
        question: 'Làm cách nào để tải tài liệu lên hệ thống?',
        answer: 'Để tải tài liệu, bạn cần đăng nhập vào tài khoản của mình, sau đó di chuyển đến mục "Tài liệu" và nhấp vào nút "Tải lên". Chọn tệp từ máy tính của bạn và hoàn tất quá trình tải lên.',
        category_id: '3', // Account Support
        createdAt: '2023-01-12T09:45:00Z',
        updatedAt: '2023-01-12T09:45:00Z',
        deletedAt: null,
        category: {
            documentId: '3',
            name_vi: 'Hỗ trợ tài khoản',
            name_en: 'Account Support'
        }
    },
    {
        documentId: '3',
        question: 'Tôi có thể tìm kiếm bạn học như thế nào?',
        answer: 'Bạn có thể tìm kiếm bạn học bằng cách sử dụng tính năng tìm kiếm trong mục "Bạn bè" hoặc "Kết nối". Nhập tên hoặc mã số sinh viên của người bạn muốn tìm và hệ thống sẽ hiển thị kết quả phù hợp.',
        category_id: '2', // Learning Support
        createdAt: '2023-01-15T10:15:00Z',
        updatedAt: '2023-01-15T10:15:00Z',
        deletedAt: null,
        category: {
            documentId: '2',
            name_vi: 'Hỗ trợ học tập',
            name_en: 'Learning Support'
        }
    },
    {
        documentId: '4',
        question: 'Tôi có thể báo cáo lỗi hệ thống như thế nào?',
        answer: 'Để báo cáo lỗi hệ thống, bạn có thể sử dụng tính năng "Báo cáo lỗi" trong mục "Hỗ trợ". Mô tả chi tiết lỗi bạn gặp phải và đính kèm ảnh chụp màn hình nếu có thể, để đội ngũ kỹ thuật có thể hỗ trợ bạn hiệu quả hơn.',
        category_id: '4', // Feedback and Bug Report
        createdAt: '2023-01-20T14:30:00Z',
        updatedAt: '2023-01-20T14:30:00Z',
        deletedAt: null,
        category: {
            documentId: '4',
            name_vi: 'Góp ý, báo lỗi',
            name_en: 'Feedback and Bug Report'
        }
    },
    {
        documentId: '5',
        question: 'Tôi có thể xem lịch học của mình ở đâu?',
        answer: 'Bạn có thể xem lịch học của mình trong mục "Lịch" hoặc "Thời khóa biểu" từ trang chủ sau khi đăng nhập. Lịch học sẽ hiển thị tất cả các lớp học và sự kiện theo tuần hoặc tháng.',
        category_id: '2', // Learning Support
        createdAt: '2023-01-25T11:20:00Z',
        updatedAt: '2023-01-25T11:20:00Z',
        deletedAt: null,
        category: {
            documentId: '2',
            name_vi: 'Hỗ trợ học tập',
            name_en: 'Learning Support'
        }
    }
];

// Mock data for categories (imported from category_supports)
const mockCategories = [
    {
        documentId: '1',
        name_vi: 'Hỗ trợ kỹ thuật',
        name_en: 'Technical Support',
        description_vi: 'Hỗ trợ các vấn đề kỹ thuật liên quan đến hệ thống',
        description_en: 'Support for technical issues related to the system'
    },
    {
        documentId: '2',
        name_vi: 'Hỗ trợ học tập',
        name_en: 'Learning Support',
        description_vi: 'Hỗ trợ các vấn đề liên quan đến học tập',
        description_en: 'Support for issues related to learning'
    },
    {
        documentId: '3',
        name_vi: 'Hỗ trợ tài khoản',
        name_en: 'Account Support',
        description_vi: 'Hỗ trợ các vấn đề liên quan đến tài khoản người dùng',
        description_en: 'Support for issues related to user accounts'
    },
    {
        documentId: '4',
        name_vi: 'Góp ý, báo lỗi',
        name_en: 'Feedback and Bug Report',
        description_vi: 'Nhận góp ý và báo cáo lỗi từ người dùng',
        description_en: 'Receive feedback and bug reports from users'
    },
    {
        documentId: '5',
        name_vi: 'Hỗ trợ khác',
        name_en: 'Other Support',
        description_vi: 'Các vấn đề hỗ trợ khác',
        description_en: 'Other support issues'
    }
];

// Hook to fetch FAQs with filtering, sorting, and pagination
export const useFaqs = (filters = {}) => {
    return useQuery(
        ['faqs', filters],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredData = [...mockFaqs];

            // Apply search filter if provided
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredData = filteredData.filter(faq =>
                    faq.question.toLowerCase().includes(searchTerm) ||
                    faq.answer.toLowerCase().includes(searchTerm)
                );
            }

            // Apply category filter if provided
            if (filters.categoryId) {
                filteredData = filteredData.filter(faq =>
                    faq.category_id === filters.categoryId
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

            // Add category information to each FAQ
            const faqs = paginatedData.map(faq => {
                const category = mockCategories.find(cat => cat.documentId === faq.category_id);
                return {
                    ...faq,
                    category
                };
            });

            return {
                data: faqs,
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

// Hook to fetch a single FAQ by ID
export const useFaq = (id) => {
    return useQuery(
        ['faq', id],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const faq = mockFaqs.find(faq => faq.documentId === id);

            if (!faq) {
                throw new Error('FAQ not found');
            }

            // Add category information
            const category = mockCategories.find(cat => cat.documentId === faq.category_id);
            return {
                ...faq,
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
