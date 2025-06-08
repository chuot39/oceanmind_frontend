import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new notice type
export const useCreateNoticeType = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (noticeTypeData) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Creating notice type:', noticeTypeData);

            // Mock successful response
            return {
                success: true,
                message: 'Notice type created successfully',
                data: {
                    documentId: Math.random().toString(36).substr(2, 9),
                    ...noticeTypeData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    deletedAt: null
                }
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('noticeTypes');
                queryClient.invalidateQueries('allNoticeTypes');
            }
        }
    );
};

// Mutation hook to update a notice type
export const useUpdateNoticeType = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ id, data }) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Updating notice type:', { id, data });

            // Mock successful response
            return {
                success: true,
                message: 'Notice type updated successfully',
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
                queryClient.invalidateQueries('noticeTypes');
                queryClient.invalidateQueries(['noticeType', variables.id]);
                queryClient.invalidateQueries('allNoticeTypes');
            }
        }
    );
};

// Mutation hook to delete a notice type
export const useDeleteNoticeType = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (id) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Deleting notice type:', id);

            // Mock successful response
            return {
                success: true,
                message: 'Notice type deleted successfully'
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('noticeTypes');
                queryClient.invalidateQueries('allNoticeTypes');
            }
        }
    );
};
