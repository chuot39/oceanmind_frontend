import systemService from '@/services/api/systemService';
import { notifyError, notifySuccess } from '@/utils/Utils';
import { useMutation, useQueryClient } from 'react-query';
import { useIntl } from 'react-intl';

// Hook to update an existing event
export const useResolvePostReport = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId, data }) => {
        try {
            const response = await systemService.updateReport({ documentId, data });
            return response.data;
        } catch (error) {
            console.error("Error updating report:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('admin-query-posts-report');
            notifySuccess(intl.formatMessage({ id: 'admin.report.action.resolve_success' }));
        },
        onError: (error) => {
            console.error("Error updating report:", error);
            notifyError(intl.formatMessage({ id: 'admin.report.action.resolve_failed' }));
        }
    });
};

// Mutation hook to restore a report
export const useRestoreReport = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await systemService.updateReport({ documentId, data: { status_report: 'pending' } });
            return response.data;
        } catch (error) {
            console.error("Error updating report:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('admin-query-posts-report');
            notifySuccess(intl.formatMessage({ id: 'admin.report.action.resolve_success' }));
        },
        onError: (error) => {
            console.error("Error updating report:", error);
            notifyError(intl.formatMessage({ id: 'admin.report.action.resolve_failed' }));
        }
    });
};

