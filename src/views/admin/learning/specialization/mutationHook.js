import learningService from '@/services/api/learningService';
import { notifyError, notifySuccess, notifyWarning } from '@/utils/Utils';
import { useIntl } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new specialization
export const useCreateSpecialization = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ data }) => {
        try {
            const response = await learningService.createSpecialization(data);
            return response.data;
        } catch (error) {
            console.error("Error creating specialization:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.specialization.create_success' }));
            queryClient.invalidateQueries('admin-query-specialization');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.specialization.create_failed' }));
            notifyWarning(error?.response?.data?.message)
            console.log('error', error);
        }
    });
};

// Mutation hook to update a specialization
export const useUpdateSpecialization = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId, data }) => {
        try {
            const response = await learningService.updateSpecialization({ documentId, data });
            return response.data;
        } catch (error) {
            console.error("Error updating specialization:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.specialization.update_success' }));
            queryClient.invalidateQueries('admin-query-specialization');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.specialization.update_failed' }));
            notifyWarning(error?.response?.data?.message)

            console.log('error', error);
        }
    });
};

// Mutation hook to delete a specialization
export const useDeleteSpecialization = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.deleteSpecialization({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error deleting specialization:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.specialization.delete_success' }));
            queryClient.invalidateQueries('admin-query-specialization');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.specialization.delete_failed' }));
            console.log('error', error);
        }
    });
};

export const useRestoreSpecialization = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.restoreSpecialization({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error restoring specialization:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.specialization.restore_success' }));
            queryClient.invalidateQueries('admin-query-specialization');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.specialization.restore_failed' }));
            console.log('error', error);
        }
    });
};
