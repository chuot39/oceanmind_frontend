import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new subject category
export const useCreateSubjectCategory = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (categoryData) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Creating subject category:', categoryData);

            // Mock successful response
            return {
                success: true,
                message: 'Subject category created successfully',
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
                queryClient.invalidateQueries('subjectCategories');
                queryClient.invalidateQueries('allSubjectCategories');
            }
        }
    );
};

// Mutation hook to update a subject category
export const useUpdateSubjectCategory = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ id, data }) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Updating subject category:', { id, data });

            // Mock successful response
            return {
                success: true,
                message: 'Subject category updated successfully',
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
                queryClient.invalidateQueries('subjectCategories');
                queryClient.invalidateQueries(['subjectCategory', variables.id]);
                queryClient.invalidateQueries('allSubjectCategories');
            }
        }
    );
};

// Mutation hook to delete a subject category
export const useDeleteSubjectCategory = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (id) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Deleting subject category:', id);

            // Mock successful response
            return {
                success: true,
                message: 'Subject category deleted successfully'
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('subjectCategories');
                queryClient.invalidateQueries('allSubjectCategories');
            }
        }
    );
};
