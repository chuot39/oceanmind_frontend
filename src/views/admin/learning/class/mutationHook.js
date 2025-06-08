import learningService from '@/services/api/learningService';
import { notifyError, notifySuccess, notifyWarning } from '@/utils/Utils';
import { useIntl } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new class
export const useCreateClass = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ data }) => {
        try {
            const response = await learningService.createClass(data);
            return response.data;
        } catch (error) {
            console.error("Error creating class:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.class.create_success' }));
            queryClient.invalidateQueries('admin-query-classes');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.class.create_failed' }));
            notifyWarning(error?.response?.data?.message);
            console.log('error', error);
        }
    });
};

// Mutation hook to update a class
export const useUpdateClass = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId, data }) => {
        try {
            const response = await learningService.updateClass({ documentId, data });
            return response.data;
        } catch (error) {
            console.error("Error updating class:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.class.update_success' }));
            queryClient.invalidateQueries('admin-query-classes');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.class.update_failed' }));
            notifyWarning(error?.response?.data?.message);
            console.log('error', error);
        }
    });
};

// Mutation hook to delete a class
export const useDeleteClass = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.deleteClass({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error deleting class:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.class.delete_success' }));
            queryClient.invalidateQueries('admin-query-classes');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.class.delete_failed' }));
            console.log('error', error);
        }
    });
};

export const useRestoreClass = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.restoreClass({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error restoring class:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.class.restore_success' }));
            queryClient.invalidateQueries('admin-query-classes');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.class.restore_failed' }));
            console.log('error', error);
        }
    });
};
