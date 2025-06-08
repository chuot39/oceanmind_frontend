import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new Guide
export const useCreateGuide = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (guideData) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Creating Guide:', guideData);

            // Mock successful response
            return {
                success: true,
                message: 'Guide created successfully',
                data: {
                    documentId: Math.random().toString(36).substr(2, 9),
                    ...guideData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    deletedAt: null
                }
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('guides');
            }
        }
    );
};

// Mutation hook to update a Guide
export const useUpdateGuide = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ id, data }) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Updating Guide:', { id, data });

            // Mock successful response
            return {
                success: true,
                message: 'Guide updated successfully',
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
                queryClient.invalidateQueries('guides');
                queryClient.invalidateQueries(['guide', variables.id]);
            }
        }
    );
};

// Mutation hook to delete a Guide
export const useDeleteGuide = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (id) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Deleting Guide:', id);

            // Mock successful response
            return {
                success: true,
                message: 'Guide deleted successfully'
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('guides');
            }
        }
    );
};
