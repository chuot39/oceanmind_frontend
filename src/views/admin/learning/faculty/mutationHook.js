import learningService from '@/services/api/learningService';
import { notifyError, notifySuccess } from '@/utils/Utils';
import { useIntl } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new faculty
export const useCreateFaculty = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ data }) => {
        try {
            const response = await learningService.createFaculty(data);
            return response.data;
        } catch (error) {
            console.error("Error updating faculty:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.faculty.create_success' }));
            queryClient.invalidateQueries('admin-query-faculty');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.faculty.create_failed' }));
            console.log('error', error);
        }
    });
};

// Mutation hook to update a faculty
export const useUpdateFaculty = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId, data }) => {
        try {
            const response = await learningService.updateFaculty({ documentId, data });
            return response.data;
        } catch (error) {
            console.error("Error updating faculty:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.faculty.update_success' }));
            queryClient.invalidateQueries('admin-query-faculty');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.faculty.update_failed' }));
            console.log('error', error);
        }
    });
};

// Mutation hook to delete a faculty
export const useDeleteFaculty = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.deleteFaculty({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error updating faculty:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.faculty.delete_success' }));
            queryClient.invalidateQueries('admin-query-faculty');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.faculty.delete_failed' }));
            console.log('error', error);
        }
    });
};


export const useRestoreFaculty = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.restoreFaculty({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error restoring faculty:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.faculty.restore_success' }));
            queryClient.invalidateQueries('admin-query-faculty');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.faculty.restore_failed' }));
            console.log('error', error);
        }
    });
};