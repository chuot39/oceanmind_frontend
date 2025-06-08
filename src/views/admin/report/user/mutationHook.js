import { useMutation, useQueryClient } from 'react-query';
import apiClient from '@/utils/api';
import { API_BASE_URL } from '@/constants';
import { message } from 'antd';
import { useIntl } from 'react-intl';
import systemService from '@/services/api/systemService';
import { notifyError, notifySuccess } from '@/utils/Utils';
import userService from '@/services/api/userService';

// Mutation hook to update report status
export const useUpdateReportStatus = () => {
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
    },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('admin-query-users-report');
                notifySuccess(intl.formatMessage({ id: 'admin.report.action.resolve_success' }));
            },
            onError: (error) => {
                notifyError(intl.formatMessage({ id: 'admin.report.action.resolve_failed' }));
            }
        }
    );
};

// Mutation hook to ban a user
export const useBanUser = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ userId, reason, duration }) => {
            try {
                const response = await apiClient.post(`${API_BASE_URL}/users/${userId}/ban`, {
                    reason,
                    duration
                });
                return response?.data;
            } catch (error) {
                console.error('Error banning user:', error);
                throw error;
            }
        },
        {
            onSuccess: () => {
                message.success('User banned successfully');
                queryClient.invalidateQueries('admin-query-users-report');
            },
            onError: (error) => {
                message.error(error?.response?.data?.message || 'Failed to ban user');
            }
        }
    );
};

// Mutation hook to warn a user
export const useWarnUser = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ userId, warning_message }) => {
            try {
                const response = await apiClient.post(`${API_BASE_URL}/users/${userId}/warn`, {
                    warning_message
                });
                return response?.data;
            } catch (error) {
                console.error('Error warning user:', error);
                throw error;
            }
        },
        {
            onSuccess: () => {
                message.success('User warned successfully');
                queryClient.invalidateQueries('admin-query-users-report');
            },
            onError: (error) => {
                message.error(error?.response?.data?.message || 'Failed to warn user');
            }
        }
    );
};

// Mutation hook to delete a user
export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ userId }) => {
            try {
                const response = await userService.deleteUser(userId);
                return response?.data;
            } catch (error) {
                console.error('Error deleting user:', error);
                throw error;
            }
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('admin-query-users-report');
            },
            onError: (error) => {
                console.error("Error delete user: ", error)
            }
        }
    );
};

export const useActiveUser = () => {
    const queryClient = useQueryClient();
    return useMutation(async ({ userId }) => {
        const response = await userService.restoreUser(userId);
        return response?.data;
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('admin-query-users-report');
        },
        onError: (error) => {
            console.error("Error active user:", error);
            throw error;
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
            queryClient.invalidateQueries('admin-query-users-report');
            notifySuccess(intl.formatMessage({ id: 'admin.report.action.restore_success' }));
        },
        onError: (error) => {
            console.error("Error updating report:", error);
            notifyError(intl.formatMessage({ id: 'admin.report.action.restore_failed' }));
        }
    });
};
