import { useQuery } from "react-query";
import { API_BASE_URL } from "../../../../constants";
import apiClient from "../../../../utils/api";


export const useSubject = (specializedId, batchId) => {
    const fetchSubject = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/specialized-subjects?specialized_id=${specializedId}&batch_id=${batchId}&limit=100`);
        return response?.data;
    }

    return useQuery(['query-subject-program', specializedId, batchId], fetchSubject, {
        enabled: !!specializedId && !!batchId,
        refetchOnWindowFocus: false,
    });
}

export const useDetailClassUser = (classId) => {
    const fetchDetailClassUser = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/classes/${classId}?populate[specialized_id][populate]=*`);
        const detailBatch = await apiClient.get(`${API_BASE_URL}/classes/${classId}?populate=*`);
        response.data.data.batch_id = detailBatch?.data?.data;

        return response?.data;
    }

    return useQuery(['DetailClassUser', classId], fetchDetailClassUser, {
        enabled: !!classId,
        refetchOnWindowFocus: false,
    });
}

export const useFaculty = () => {
    const fetchFaculty = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/faculties?sortBy=updatedAt&sortOrder=DESC&limit=100`);
        return response?.data;
    }

    return useQuery(['query-faculty'], fetchFaculty, {
        enabled: true,
        refetchOnWindowFocus: false,
    });
}

export const useCategorySubject = () => {
    const fetchCategorySubject = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/category-subjects?sortBy=updatedAt&sortOrder=DESC`);
        return response?.data;
    }

    return useQuery(['query-category-subject'], fetchCategorySubject, {
        enabled: true,
        refetchOnWindowFocus: false,
    });
}

export const useSpecialized = (facultyId) => {
    const fetchSpecialized = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/specializeds?sort=updatedAt:DESC&filters[$and][0][faculty_id][documentId][$eq]=${facultyId}`);
        return response?.data;
    }

    return useQuery(['Specialized', facultyId], fetchSpecialized, {
        enabled: !!facultyId,
        refetchOnWindowFocus: false,
    });
}

export const useBatch = () => {
    const fetchBatch = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/batches?sort=name:DESC`);
        return response?.data;
    }

    return useQuery(['query-batch'], fetchBatch, {
        enabled: true,
        refetchOnWindowFocus: false,
    });
}

