import studyService from "@/services/api/studyService";
import { useUserData } from "@/utils/hooks/useAuth";
import { notifyError, notifySuccess } from "@/utils/Utils";
import { useMutation, useQueryClient } from "react-query";


export const useCreateSubjectLearn = () => {
    const queryClient = useQueryClient();
    const { userData } = useUserData

    return useMutation(async ({ data }) => {
        return await studyService.createSubjectLearn(data)
    }, {
        onSuccess: (response) => {
            // Invalidate specific queries to ensure data is refreshed
            queryClient.invalidateQueries('SubjectLearned', userData?.username);

            notifySuccess('SubjectLearned created successfully');
            return response;
        },
        onError: (error) => {
            console.error("Error creating SubjectLearned:", error);
            notifyError('Failed to create SubjectLearned');
            // throw error;
        }
    })
}

export const useUpdateSubjectLearn = () => {
    const queryClient = useQueryClient();
    const { userData } = useUserData

    return useMutation(async ({ scoreId, data }) => {
        return await studyService.updateSubjectLearn({ scoreId, data })
    }, {
        onSuccess: (data) => {
            queryClient.invalidateQueries('SubjectLearned', userData?.username);

            notifySuccess('SubjectLearned updated successfully');

            return data;
        },
        onError: (error) => {
            console.error("Error updating SubjectLearned:", error);
            notifyError('Failed to update SubjectLearned');
            // throw error;
        }
    })
}

export const useDeleteSubjectLearn = () => {
    const queryClient = useQueryClient();
    const { userData } = useUserData


    return useMutation(async ({ scoreId }) => {
        return await studyService.deleteSubjectLearn({ scoreId })
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries('SubjectLearned', userData?.username);

            notifySuccess('SubjectLearned deleted successfully');
        },
        onError: (error) => {
            console.error("Error deleting SubjectLearned:", error);
            notifyError('Failed to delete SubjectLearned');
            throw error;
        }
    })
}

