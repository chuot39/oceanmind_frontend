import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new category support
export const useCreateCategorySupport = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (categoryData) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Creating category support:', categoryData);

            // Mock successful response
            return {
                success: true,
                message: 'Category support created successfully',
                data: {
                    documentId: Math.random().toString(36).substr(2, 9),
                    ...categoryData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    deletedAt: null
                }
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('categorySupports');
                queryClient.invalidateQueries('allCategorySupports');
            }
        }
    );
};

// Mutation hook to update a category support
export const useUpdateCategorySupport = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ id, data }) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Updating category support:', { id, data });

            // Mock successful response
            return {
                success: true,
                message: 'Category support updated successfully',
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
                queryClient.invalidateQueries('categorySupports');
                queryClient.invalidateQueries(['categorySupport', variables.id]);
                queryClient.invalidateQueries('allCategorySupports');
            }
        }
    );
};

// Mutation hook to delete a category support
export const useDeleteCategorySupport = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (id) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Deleting category support:', id);

            // Mock successful response
            return {
                success: true,
                message: 'Category support deleted successfully'
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('categorySupports');
                queryClient.invalidateQueries('allCategorySupports');
            }
        }
    );
};
