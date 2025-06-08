import learningService from '@/services/api/learningService';
import { notifyError, notifySuccess, notifyWarning } from '@/utils/Utils';
import { useIntl } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new batch
export const useCreateBatch = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ data }) => {
        try {
            const response = await learningService.createBatch(data);
            return response.data;
        } catch (error) {
            console.error("Error creating batch:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.batch.create_success' }));
            queryClient.invalidateQueries('admin-query-batch');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.batch.create_failed' }));
            notifyWarning(error?.response?.data?.message)
            console.log('error', error);
        }
    });
}

// Mutation hook to update a batch
export const useUpdateBatch = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId, data }) => {
        try {
            const response = await learningService.updateBatch({ documentId, data });
            return response.data;
        } catch (error) {
            console.error("Error updating batch:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.batch.update_success' }));
            queryClient.invalidateQueries('admin-query-batch');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.batch.update_failed' }));
            notifyWarning(error?.response?.data?.message)

            console.log('error', error);
        }
    });
};

// Mutation hook to delete a batch
export const useDeleteBatch = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.deleteBatch({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error deleting batch:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.batch.delete_success' }));
            queryClient.invalidateQueries('admin-query-batch');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.batch.delete_failed' }));
            console.log('error', error);
        }
    });
};

export const useRestoreBatch = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.restoreBatch({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error restoring batch:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.batch.restore_success' }));
            queryClient.invalidateQueries('admin-query-batch');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.batch.restore_failed' }));
            console.log('error', error);
        }
    });
};
