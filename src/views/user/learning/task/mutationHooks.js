import studyService from "@/services/api/studyService";
import { useUserData } from "@/utils/hooks/useAuth";
import { notifyError, notifySuccess } from "@/utils/Utils";
import { useIntl } from "react-intl";
import { useMutation, useQueryClient } from "react-query";


export const useCreateTask = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ data }) => {
        return await studyService.createTask(data)
    }, {
        onSuccess: (response, variables) => {
            // Invalidate specific queries to ensure data is refreshed
            queryClient.invalidateQueries('query-user-task');

            // Nếu có projectId, invalidate cả cache của project đó
            if (variables.data && variables.data.project_id) {
                queryClient.invalidateQueries(['taskUser', variables.data.project_id]);

                // Invalidate cache của detailProject để cập nhật danh sách tasks
                queryClient.invalidateQueries(['detailProject', variables.data.project_id]);
            }

            // Invalidate cache cho task mới được tạo
            if (response && response.documentId) {
                queryClient.invalidateQueries(['taskUser', [response.documentId]]);
            }

            // Invalidate cache của projects để cập nhật danh sách projects
            queryClient.invalidateQueries(['projects']);

            notifySuccess(intl.formatMessage({ id: 'learning.learn_exercise.create_task_success' }));
            return response;
        },
        onError: (error) => {
            console.error("Error creating task:", error);
            notifyError(intl.formatMessage({ id: 'learning.learn_exercise.create_task_failed' }));
            throw error;
        }
    })
}

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    const { userData } = useUserData();
    const intl = useIntl();

    return useMutation(async ({ data, taskId, options = {} }) => {
        return await studyService.updateTask({ taskId, data })
    }, {
        onSuccess: (data, variables) => {
            // Lấy options nếu có
            const options = variables.options || {};
            queryClient.invalidateQueries(['query-projectUser', userData?.documentId]);
            queryClient.invalidateQueries('query-user-task');

            // Chỉ hiển thị thông báo nếu không có options.silent
            if (!options.silent) {
                notifySuccess(intl.formatMessage({ id: 'learning.learn_exercise.update_task_success' }));
            }

            return data;
        },
        onError: (error, variables) => {
            // Lấy options nếu có
            const options = variables.options || {};

            console.error("Error updating task:", error);

            // Chỉ hiển thị thông báo lỗi nếu không có options.silent
            if (!options.silent) {
                notifyError(intl.formatMessage({ id: 'learning.learn_exercise.update_task_failed' }));
            }

            // throw error;
        }
    })
}

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ taskId }) => {
        return await studyService.deleteTask({ taskId })
    }, {
        onSuccess: (data, variables) => {
            notifySuccess(intl.formatMessage({ id: 'learning.learn_exercise.delete_task_success' }));
            queryClient.invalidateQueries('query-user-task');
            return data;
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'learning.learn_exercise.delete_task_failed' }));
            throw error;
        }
    })
}

export const useRestoreTask = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();
    const { userData } = useUserData();

    return useMutation(async ({ taskId }) => {
        return await studyService.restoreTask({ taskId })
    }, {
        onSuccess: (data, variables) => {
            notifySuccess(intl.formatMessage({ id: 'learning.learning_progress.restore_task_success', defaultMessage: 'Task restored successfully' }));
            queryClient.invalidateQueries('query-user-task');
            return data;
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'learning.learning_progress.restore_task_failed', defaultMessage: 'Failed to restore task' }));
            throw error;
        }
    })
}

export const usePermanentDeleteTask = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ taskId }) => {
        return await studyService.permanentDeleteTask({ taskId })
    }, {
        onSuccess: (data, variables) => {
            notifySuccess(intl.formatMessage({ id: 'learning.learning_progress.permanent_delete_task_success', defaultMessage: 'Task permanently deleted' }));
            // Invalidate cả hai query key để cập nhật dữ liệu ở cả hai tab
            queryClient.invalidateQueries('query-user-task');
            return data;
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'learning.learning_progress.permanent_delete_task_failed', defaultMessage: 'Failed to permanently delete task' }));
            // throw error;
        }
    })
}
