import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new tag
export const useCreateTag = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (tagData) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Creating tag:', tagData);

            // Mock successful response
            return {
                success: true,
                message: 'Tag created successfully',
                data: {
                    documentId: Math.random().toString(36).substr(2, 9),
                    ...tagData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    deletedAt: null
                }
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('tags');
                queryClient.invalidateQueries('allTags');
            }
        }
    );
};

// Mutation hook to update a tag
export const useUpdateTag = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ id, data }) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Updating tag:', { id, data });

            // Mock successful response
            return {
                success: true,
                message: 'Tag updated successfully',
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
                queryClient.invalidateQueries('tags');
                queryClient.invalidateQueries(['tag', variables.id]);
                queryClient.invalidateQueries('allTags');
            }
        }
    );
};

// Mutation hook to delete a tag
export const useDeleteTag = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (id) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Deleting tag:', id);

            // Mock successful response
            return {
                success: true,
                message: 'Tag deleted successfully'
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('tags');
                queryClient.invalidateQueries('allTags');
            }
        }
    );
};
