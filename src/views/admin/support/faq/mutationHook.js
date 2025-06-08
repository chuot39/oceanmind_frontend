import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new FAQ
export const useCreateFaq = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (faqData) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Creating FAQ:', faqData);

            // Mock successful response
            return {
                success: true,
                message: 'FAQ created successfully',
                data: {
                    documentId: Math.random().toString(36).substr(2, 9),
                    ...faqData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    deletedAt: null
                }
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('faqs');
            }
        }
    );
};

// Mutation hook to update an FAQ
export const useUpdateFaq = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ id, data }) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Updating FAQ:', { id, data });

            // Mock successful response
            return {
                success: true,
                message: 'FAQ updated successfully',
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
                queryClient.invalidateQueries('faqs');
                queryClient.invalidateQueries(['faq', variables.id]);
            }
        }
    );
};

// Mutation hook to delete an FAQ
export const useDeleteFaq = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async (id) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 600));

            // In a real implementation, this would be an API call
            console.log('Deleting FAQ:', id);

            // Mock successful response
            return {
                success: true,
                message: 'FAQ deleted successfully'
            };
        },
        {
            onSuccess: () => {
                // Invalidate queries to refetch the updated data
                queryClient.invalidateQueries('faqs');
            }
        }
    );
};
