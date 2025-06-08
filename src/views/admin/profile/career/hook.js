import { useQuery } from 'react-query';

// Mock data for careers
const mockCareers = [
    {
        documentId: '1',
        name: 'Software Engineer',
        description: 'Develops and maintains software applications and systems',
        createdAt: '2023-01-10T08:30:00Z',
        updatedAt: '2023-01-10T08:30:00Z',
        deletedAt: null
    },
    {
        documentId: '2',
        name: 'Data Scientist',
        description: 'Analyzes and interprets complex data to help organizations make better decisions',
        createdAt: '2023-01-12T09:45:00Z',
        updatedAt: '2023-01-12T09:45:00Z',
        deletedAt: null
    },
    {
        documentId: '3',
        name: 'UI/UX Designer',
        description: 'Creates user-friendly interfaces and optimizes user experiences for websites and applications',
        createdAt: '2023-01-15T10:15:00Z',
        updatedAt: '2023-01-15T10:15:00Z',
        deletedAt: null
    },
    {
        documentId: '4',
        name: 'Network Administrator',
        description: 'Manages and maintains computer networks within an organization',
        createdAt: '2023-01-20T14:30:00Z',
        updatedAt: '2023-01-20T14:30:00Z',
        deletedAt: null
    },
    {
        documentId: '5',
        name: 'Cybersecurity Analyst',
        description: 'Protects computer systems and networks from information disclosure, theft, or damage',
        createdAt: '2023-01-25T11:20:00Z',
        updatedAt: '2023-01-25T11:20:00Z',
        deletedAt: null
    },
    {
        documentId: '6',
        name: 'Project Manager',
        description: 'Plans, organizes, and oversees the completion of specific projects for an organization',
        createdAt: '2023-02-01T09:10:00Z',
        updatedAt: '2023-02-01T09:10:00Z',
        deletedAt: null
    },
    {
        documentId: '7',
        name: 'Database Administrator',
        description: 'Manages, secures, and ensures the performance of database systems',
        createdAt: '2023-02-05T13:45:00Z',
        updatedAt: '2023-02-05T13:45:00Z',
        deletedAt: null
    },
    {
        documentId: '8',
        name: 'DevOps Engineer',
        description: 'Combines software development and IT operations to shorten the development lifecycle',
        createdAt: '2023-02-10T15:30:00Z',
        updatedAt: '2023-02-10T15:30:00Z',
        deletedAt: null
    },
    {
        documentId: '9',
        name: 'Machine Learning Engineer',
        description: 'Designs and implements machine learning models to solve business problems',
        createdAt: '2023-02-15T10:20:00Z',
        updatedAt: '2023-02-15T10:20:00Z',
        deletedAt: null
    },
    {
        documentId: '10',
        name: 'Cloud Architect',
        description: 'Designs and oversees the implementation of cloud computing strategies',
        createdAt: '2023-02-20T09:15:00Z',
        updatedAt: '2023-02-20T09:15:00Z',
        deletedAt: null
    }
];

// Hook to fetch careers with filtering, sorting, and pagination
export const useCareers = (filters = {}) => {
    return useQuery(
        ['careers', filters],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredData = [...mockCareers];

            // Apply name filter if provided
            if (filters.name) {
                const searchTerm = filters.name.toLowerCase();
                filteredData = filteredData.filter(career =>
                    career.name.toLowerCase().includes(searchTerm)
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

// Hook to fetch a single career by ID
export const useCareer = (id) => {
    return useQuery(
        ['career', id],
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            const career = mockCareers.find(career => career.documentId === id);

            if (!career) {
                throw new Error('Career not found');
            }

            return career;
        },
        {
            enabled: !!id // Only run the query if an ID is provided
        }
    );
};

// Hook to fetch all careers (for dropdowns, etc.)
export const useAllCareers = () => {
    return useQuery(
        'allCareers',
        async () => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 300));

            return mockCareers;
        }
    );
};
