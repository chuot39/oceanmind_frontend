import { useQuery } from "react-query";
import { API_BASE_URL } from "../../../../constants";
import apiClient from "../../../../utils/api";
import { useUserData } from "@/utils/hooks/useAuth";

export const useSubject = (specializedId) => {
    const fetchSubject = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/specialized-subjects?specialized_id=${specializedId}&limit=100`);
        return response?.data;
    }

    return useQuery(['query-subject', specializedId], fetchSubject, {
        enabled: !!specializedId,
        refetchOnWindowFocus: false,
    });
}

export const useSubjectUserLearn = () => {
    const { userData } = useUserData();

    const fetchSubjectLearned = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/scores?studentId=${userData?.documentId}&page=1&limit=100&sortBy=createdAt&sortOrder=desc`);
        await Promise.all(response?.data?.data?.map(async (item) => {
            const subject = await apiClient.get(`${API_BASE_URL}/specialized-subjects?specialized_id=${userData?.regularClass?.specialized?.documentId}&subject_id=${item?.subject_id}`);
            item.subject = subject?.data?.data[0];
        }));
        return response?.data;
    }

    return useQuery(['query-subject-learned', userData?.documentId], fetchSubjectLearned, {
        enabled: !!userData?.documentId,
        refetchOnWindowFocus: false,
    });
}
