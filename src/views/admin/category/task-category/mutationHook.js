import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new task category
export const useCreateTaskCategory = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (categoryData) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Creating task category:', categoryData);

            // Mock successful response
            return {
                success: true,
                message: 'Task category created successfully',
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
                queryClient.invalidateQueries('taskCategories');
                queryClient.invalidateQueries('allTaskCategories');
            }
        }
    );
};

// Mutation hook to update a task category
export const useUpdateTaskCategory = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ id, data }) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Updating task category:', { id, data });

            // Mock successful response
            return {
                success: true,
                message: 'Task category updated successfully',
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
                queryClient.invalidateQueries('taskCategories');
                queryClient.invalidateQueries(['taskCategory', variables.id]);
                queryClient.invalidateQueries('allTaskCategories');
            }
        }
    );
};

// Mutation hook to delete a task category
export const useDeleteTaskCategory = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (id) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Deleting task category:', id);

            // Mock successful response
            return {
                success: true,
                message: 'Task category deleted successfully'
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('taskCategories');
                queryClient.invalidateQueries('allTaskCategories');
            }
        }
    );
};
