import { useQuery, useInfiniteQuery } from "react-query";
import { API_BASE_URL } from "../../../../constants";
import apiClient from "../../../../utils/api";

export const useDetailClassUser = (classId) => {
    const fetchDetailClassUser = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/classes/${classId}?populate[specialized_id][populate]=*`);
        return response?.data;
    }

    return useQuery(['DetailClassUser', classId], fetchDetailClassUser, {
        enabled: !!classId,
        refetchOnWindowFocus: false,
    });
}

export const useDocumentUser = (documentId) => {
    const fetchDocumentUser = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/document-shares/author/${documentId}?limit=1`);
        return response?.data;
    }

    return useQuery(['query-document-user', documentId], fetchDocumentUser, {
        enabled: !!documentId,
        refetchOnWindowFocus: false,
    });
}

export const useSubjectUserLearn = (documentId) => {
    const fetchSubjectLearned = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/scores?studentId=${documentId}&page=1&limit=100&sortBy=createdAt&sortOrder=desc`);

        return response?.data;
    }

    return useQuery(['query-subject-learned', documentId], fetchSubjectLearned, {
        enabled: !!documentId,
        refetchOnWindowFocus: false,
    });

}


