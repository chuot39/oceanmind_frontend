import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new career
export const useCreateCareer = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (careerData) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Creating career:', careerData);

            // Mock successful response
            return {
                success: true,
                message: 'Career created successfully',
                data: {
                    documentId: Math.random().toString(36).substr(2, 9),
                    ...careerData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    deletedAt: null
                }
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('careers');
                queryClient.invalidateQueries('allCareers');
            }
        }
    );
};

// Mutation hook to update a career
export const useUpdateCareer = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ id, data }) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Updating career:', { id, data });

            // Mock successful response
            return {
                success: true,
                message: 'Career updated successfully',
                data: {
                    documentId: id,
                    ...data,
                    updatedAt: new Date().toISOString()
                }
            };
        },
        {
            onSuccess: (result, variables) => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('careers');
                queryClient.invalidateQueries(['career', variables.id]);
                queryClient.invalidateQueries('allCareers');
            }
        }
    );
};

// Mutation hook to delete a career
export const useDeleteCareer = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (id) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Deleting career:', id);

            // Mock successful response
            return {
                success: true,
                message: 'Career deleted successfully'
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('careers');
                queryClient.invalidateQueries('allCareers');
            }
        }
    );
};
