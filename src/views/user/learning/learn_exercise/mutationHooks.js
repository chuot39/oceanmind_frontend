import studyService from "@/services/api/studyService";
import { notifyError, notifySuccess } from "@/utils/Utils";
import { useIntl } from "react-intl";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useUserData } from "@/utils/hooks/useAuth";

export const useUpdateProject = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const { userData } = useUserData();

    return useMutation(
        async ({ documentId, newData, oldData }) => {

            const oldMembers = oldData?.project_member?.map(member => member?.user?.documentId);
            const newMembers = newData?.project_members?.map(member => member?.documentId);

            const membersToAdd = newMembers && newMembers?.filter(member => !oldMembers?.includes(member));
            const membersToRemove = oldMembers && oldMembers?.filter(member => !newMembers?.includes(member));

            if (membersToAdd?.length > 0) {
                membersToAdd?.forEach(async (member) => {
                    await studyService.addMembersToProject({ project_id: documentId, user_id: member });
                });
            }

            if (membersToRemove?.length > 0) {
                membersToRemove?.forEach(async (member) => {
                    const response = await studyService.getProjectMembers({ projectId: documentId, userId: member });

                    if (response?.data?.length === 1) {
                        await studyService.removeMembersFromProject({ documentId: response?.data[0]?.documentId });
                    } else {
                        console.error('member not found in project');
                        throw new Error('member not found in project');
                    }
                });
            }

            const dataSubmit = {
                name: newData?.name || '',
                description: newData?.description || '',
                document_url: newData?.document_url || '',
                project_url: newData?.project_url || '',
                due_date: newData?.due_date || '',
                subject_id: newData?.subject_id?.documentId || '',
                leader_project_id: newData?.leader_project_id?.value || '',
                project_completed_on: newData?.project_completed_on || null,
            }

            !newData?.name && delete dataSubmit?.name;
            !newData?.description && delete dataSubmit?.description;
            !newData?.document_url && delete dataSubmit?.document_url;
            !newData?.project_url && delete dataSubmit?.project_url;
            !newData?.due_date && delete dataSubmit?.due_date;
            !newData?.subject_id && delete dataSubmit?.subject_id;
            !newData?.leader_project_id && delete dataSubmit?.leader_project_id;


            // Return the promise so react-query can handle it properly
            return studyService.updateProject({ documentId, data: dataSubmit });
        },
        {
            onSuccess: () => {
                notifySuccess(intl.formatMessage({ id: 'learning.learn_exercise.project_updated_success' }));
                queryClient.invalidateQueries(['query-projectUser', userData?.documentId]);
            },
            onError: (error) => {
                console.error("Error updating project:", error);
                notifyError(intl.formatMessage({ id: 'learning.learn_exercise.project_updated_failed' }));
                // No need to throw error again here as react-query will handle it
            }
        }
    );
}

export const useCreateProject = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const { userData } = useUserData();

    return useMutation(async (data) => {
        const listMembers = data?.project_members?.map(member => member?.documentId);
        const dataSubmit = {
            name: data?.name || '',
            description: data?.description || '',
            document_url: data?.document_url || '',
            project_url: data?.project_url || '',
            due_date: data?.due_date || '',
            subject_id: data?.subject_id?.documentId || '',
            leader_project_id: data?.leader_project_id?.documentId || '',
        }
        const response = await studyService.createProject(dataSubmit);

        if (listMembers?.length > 0) {
            await Promise.all(listMembers.map(async (member) => {
                await studyService.addMembersToProject({ project_id: response?.data?.documentId, user_id: member });
            }));
        }

        return response.data;
    },
        {
            onSuccess: async () => {
                notifySuccess(intl.formatMessage({ id: 'learning.learn_exercise.project_created_success' }));
                // Invalidate and refetch immediately
                await queryClient.invalidateQueries(['query-projectUser', userData?.documentId]);
                await queryClient.refetchQueries(['query-projectUser', userData?.documentId]);
            },
            onError: (error) => {
                console.error("Error creating project:", error);
                notifyError(intl.formatMessage({ id: 'learning.learn_exercise.project_created_failed' }));
                throw error;
            }
        }
    )
}

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data) => {
            const response = await axios.post(`${API_BASE_URL}/tasks`, data);
            return response.data;
        },
        onSuccess: () => {
            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['taskUser']);
            queryClient.invalidateQueries(['projects']);
        }
    });
};

export const useUpdateMembersProject = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const { userData } = useUserData();

    return useMutation(async ({ documentId, newData, oldData }) => {
        const oldMembers = oldData?.project_member?.map(member => member?.user?.documentId);
        const newMembers = newData?.members?.map(member => member?.documentId);

        const membersToAdd = newMembers && newMembers?.filter(member => !oldMembers?.includes(member));
        const membersToRemove = oldMembers && oldMembers?.filter(member => !newMembers?.includes(member));

        const promises = [];

        // Handle adding members properly with Promise.all
        if (membersToAdd?.length > 0) {
            const addPromises = membersToAdd.map(member =>
                studyService.addMembersToProject({ project_id: documentId, user_id: member })
            );
            promises.push(Promise.all(addPromises));
        }

        // Handle removing members properly with Promise.all
        if (membersToRemove?.length > 0) {
            const removePromises = membersToRemove.map(async member => {
                const response = await studyService.getProjectMembers({ projectId: documentId, userId: member });
                if (response?.data?.length === 1) {
                    return studyService.removeMembersFromProject({ documentId: response?.data[0]?.documentId });
                } else {
                    console.error('member not found in project');
                    return Promise.resolve(); // Resolve anyway to continue with other removals
                }
            });
            promises.push(Promise.all(removePromises));
        }

        // Wait for all operations to complete before returning
        return Promise.all(promises);
    },
        {
            onSuccess: () => {
                notifySuccess(intl.formatMessage({ id: 'learning.learn_exercise.project_updated_success' }));
                queryClient.invalidateQueries(['query-projectUser', userData?.documentId]);
            },
            onError: (error) => {
                console.error("Error updating project:", error);
                notifyError(intl.formatMessage({ id: 'learning.learn_exercise.project_updated_failed' }));
                throw error;
            }
        }
    )
}