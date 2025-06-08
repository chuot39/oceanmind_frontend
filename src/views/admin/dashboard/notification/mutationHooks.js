import { getNotificationLink } from '@/helpers/systemHelper';
import studyService from '@/services/api/studyService';
import systemService from '@/services/api/systemService';
import { useUserData } from '@/utils/hooks/useAuth';
import { notifyError, notifySuccess } from '@/utils/Utils';
import { useIntl } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';

// Mock function to create a notification
const createNotificationApi = async (data) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In a real API, this would send data to the server
    console.log('Creating notification:', data);

    // Return a mock response
    return {
        success: true,
        data: {
            documentId: Math.random().toString(36).substring(2, 15),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            stats: { total: 0, read: 0, unread: 0 }
        }
    };
};

// Mock function to update a notification
const updateNotificationApi = async ({ id, data }) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // In a real API, this would send data to the server
    console.log('Updating notification:', id, data);

    // Return a mock response
    return {
        success: true,
        data: {
            documentId: id,
            ...data,
            updatedAt: new Date().toISOString()
        }
    };
};


export const useCreateNotification = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const { userData } = useUserData();

    return useMutation(async (data) => {
        try {
            const listMembers = data?.user_ids?.map(member => member?.documentId);

            const dataSubmit = {
                title: data?.title || '',
                content: data?.content || '',
                link: getNotificationLink(data?.type?.name_en) || '',
                is_global: data?.is_global || false,
                notice_type_label: data?.type?.name_en || '',
                notification_created_by: userData?.documentId || ''
            };

            let notificationResponse;

            // Create notification
            try {
                notificationResponse = await systemService.createNotification(dataSubmit);
                console.log('Notification Response:', notificationResponse);
            } catch (error) {
                console.error('Error creating notification:', error);
                throw error;
            }

            // Only proceed if we have a response with documentId
            if (!notificationResponse?.data?.data?.documentId) {
                console.error('No documentId in response:', notificationResponse);
                throw new Error('Failed to get notification ID');
            }

            // Create user notifications if we have members
            if (listMembers?.length > 0 || data?.is_global) {
                try {
                    const dataBulkSubmit = {
                        notification_id: notificationResponse.data.data.documentId,
                        user_ids: listMembers,
                        is_global: data?.is_global || false,
                        is_read: false
                    };
                    console.log('Submitting bulk notifications:', dataBulkSubmit);
                    await systemService.createUserNotificationBulk(dataBulkSubmit);
                } catch (bulkError) {
                    console.error('Error creating bulk notifications:', bulkError);
                    // Continue even if bulk creation fails
                }
            }

            return notificationResponse.data;
        } catch (error) {
            console.error("Error in notification creation process:", error);
            throw error;
        }
    },
        {
            onSuccess: async () => {
                notifySuccess(intl.formatMessage({ id: 'learning.learn_exercise.project_created_success' }));
                // Invalidate and refetch immediately
                await queryClient.invalidateQueries(['admin-query-notifications']);
                await queryClient.invalidateQueries(['admin-query-notificationStats']);
            },
            onError: (error) => {
                console.error("Error creating notification:", error);
                notifyError(intl.formatMessage({ id: 'learning.learn_exercise.project_created_failed' }));
            }
        });
}


// Hook to update an existing notification
export const useUpdateNotification = () => {
    const queryClient = useQueryClient();

    return useMutation(updateNotificationApi, {
        onSuccess: (data) => {
            // Invalidate and refetch notifications list after update
            queryClient.invalidateQueries('notifications');
            queryClient.invalidateQueries('notificationStats');

            return data;
        }
    });
};


export const useDeleteNotification = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const filters = {}

    return useMutation(async ({ documentId }) => {
        await systemService.deleteNotification({ documentId });
    }, {
        onSuccess: () => {
            notifySuccess(
                intl.formatMessage({
                    id: 'admin.dashboard.notification.delete_success'
                })
            );
            queryClient.invalidateQueries(['admin-query-notifications', filters]);
        },
        onError: (error) => {
            console.error("Error handling notification:", error);
            notifyError(
                intl.formatMessage({
                    id: 'admin.dashboard.notification.delete_failed'
                })
            );
        }
    });
}


export const useRestoreNotification = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const filters = {}

    return useMutation(async ({ documentId }) => {
        await systemService.restoreNotification({ documentId });
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.dashboard.notification.actions.restore_success' }));
            queryClient.invalidateQueries(['admin-query-notifications', filters]);
        },
        onError: (error) => {
            console.error("Error restoring notification:", error);
            notifyError(intl.formatMessage({ id: 'admin.dashboard.notification.actions.restore_failed' }));
        }
    });
}

export const usePermanentDeleteNotification = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const filters = {}

    return useMutation(async ({ documentId }) => {
        await systemService.permanentDeleteNotification({ documentId });
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.dashboard.notification.actions.permanent_delete_success' }));
            queryClient.invalidateQueries(['admin-query-notifications', filters]);
        },
        onError: (error) => {
            console.error("Error deleting notification:", error);
            notifyError(intl.formatMessage({ id: 'admin.dashboard.notification.actions.permanent_delete_failed' }));
        }
    });
}

// Hook to mark a notification as read for specific users
export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ notificationId, userIds }) => {
            // Simulate API call with delay
            await new Promise(resolve => setTimeout(resolve, 400));

            // In a real API, this would send data to the server
            console.log('Marking notification as read:', notificationId, 'for users:', userIds);

            // Return a mock response
            return {
                success: true
            };
        },
        {
            onSuccess: () => {
                // Invalidate and refetch notifications list and stats
                queryClient.invalidateQueries('notifications');
                queryClient.invalidateQueries('notificationStats');
            }
        }
    );
};
