import learningService from '@/services/api/learningService';
import { notifyError, notifySuccess, notifyWarning } from '@/utils/Utils';
import { useIntl } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';

// Mutation hook to create a new subject
export const useCreateSubject = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ data }) => {
        try {
            const response = await learningService.createSubject(data);
            return response.data;
        } catch (error) {
            console.error("Error creating subject:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.subject.create_success' }));
            queryClient.invalidateQueries('admin-query-subjects');
            queryClient.invalidateQueries('all-subjects-dropdown');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.subject.create_failed' }));
            notifyWarning(error?.response?.data?.message);
            console.log('error', error);
        }
    });
};

// Mutation hook to update a subject
export const useUpdateSubject = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId, data }) => {
        try {
            const response = await learningService.updateSubject({ documentId, data });
            return response.data;
        } catch (error) {
            console.error("Error updating subject:", error);
            throw error;
        }
    }, {
        onSuccess: (_, variables) => {
            notifySuccess(intl.formatMessage({ id: 'admin.subject.update_success' }));
            queryClient.invalidateQueries('admin-query-subjects');
            queryClient.invalidateQueries(['subject', variables.documentId]);
            queryClient.invalidateQueries('all-subjects-dropdown');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.subject.update_failed' }));
            notifyWarning(error?.response?.data?.message);
            console.log('error', error);
        }
    });
};

// Mutation hook to delete a subject
export const useDeleteSubject = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.deleteSubject({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error deleting subject:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.subject.delete_success' }));
            queryClient.invalidateQueries('admin-query-subjects');
            queryClient.invalidateQueries('all-subjects-dropdown');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.subject.delete_failed' }));
            console.log('error', error);
        }
    });
};

// Mutation hook to restore a subject
export const useRestoreSubject = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.restoreSubject({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error restoring subject:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.subject.restore_success' }));
            queryClient.invalidateQueries('admin-query-subjects');
            queryClient.invalidateQueries('all-subjects-dropdown');
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.subject.restore_failed' }));
            console.log('error', error);
        }
    });
};

// Mutation hook to add a specialization to a subject
export const useAddSpecializedSubject = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ data }) => {
        try {
            const response = await learningService.addSpecializedSubject(data);
            return response.data;
        } catch (error) {
            console.error("Error adding specialized subject:", error);
            throw error;
        }
    }, {
        onSuccess: (_, variables) => {
            notifySuccess(intl.formatMessage({ id: 'admin.subject.add_specialization_success' }));
            queryClient.invalidateQueries('admin-query-subjects');
            queryClient.invalidateQueries(['subject', variables.data.subject_id]);
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.subject.add_specialization_failed' }));
            notifyWarning(error?.response?.data?.message);
            console.log('error', error);
        }
    });
};

// Mutation hook to remove a specialization from a subject
export const useRemoveSpecializedSubject = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.removeSpecializedSubject({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error removing specialized subject:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.subject.remove_specialization_success' }));
            queryClient.invalidateQueries('admin-query-subjects');
            queryClient.invalidateQueries(['subject']);
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.subject.remove_specialization_failed' }));
            console.log('error', error);
        }
    });
};

// Mutation hook to add a previous subject
export const useAddPreviousSubject = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ data }) => {
        try {
            const response = await learningService.addPreviousSubject(data);
            return response.data;
        } catch (error) {
            console.error("Error adding previous subject:", error);
            throw error;
        }
    }, {
        onSuccess: (_, variables) => {
            notifySuccess(intl.formatMessage({ id: 'admin.subject.add_previous_success' }));
            queryClient.invalidateQueries('admin-query-subjects');
            queryClient.invalidateQueries(['subject', variables.data.subject_id]);
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.subject.add_previous_failed' }));
            notifyWarning(error?.response?.data?.message);
            console.log('error', error);
        }
    });
};

// Mutation hook to remove a previous subject
export const useRemovePreviousSubject = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.removePreviousSubject({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error removing previous subject:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.subject.remove_previous_success' }));
            queryClient.invalidateQueries('admin-query-subjects');
            queryClient.invalidateQueries(['subject']);
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.subject.remove_previous_failed' }));
            console.log('error', error);
        }
    });
};

// Mutation hook to add a prerequisite subject
export const useAddPrerequisiteSubject = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ data }) => {
        try {
            const response = await learningService.addPrerequisiteSubject(data);
            return response.data;
        } catch (error) {
            console.error("Error adding prerequisite subject:", error);
            throw error;
        }
    }, {
        onSuccess: (_, variables) => {
            notifySuccess(intl.formatMessage({ id: 'admin.subject.add_prerequisite_success' }));
            queryClient.invalidateQueries('admin-query-subjects');
            queryClient.invalidateQueries(['subject', variables.data.subject_id]);
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.subject.add_prerequisite_failed' }));
            notifyWarning(error?.response?.data?.message);
            console.log('error', error);
        }
    });
};

// Mutation hook to remove a prerequisite subject
export const useRemovePrerequisiteSubject = () => {
    const queryClient = useQueryClient();
    const intl = useIntl();

    return useMutation(async ({ documentId }) => {
        try {
            const response = await learningService.removePrerequisiteSubject({ documentId });
            return response.data;
        } catch (error) {
            console.error("Error removing prerequisite subject:", error);
            throw error;
        }
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.subject.remove_prerequisite_success' }));
            queryClient.invalidateQueries('admin-query-subjects');
            queryClient.invalidateQueries(['subject']);
        },
        onError: (error) => {
            notifyError(intl.formatMessage({ id: 'admin.subject.remove_prerequisite_failed' }));
            console.log('error', error);
        }
    });
};
