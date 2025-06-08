import { API_BASE_URL } from "@/constants";
import apiClient from "@/utils/api";

const learningService = {
    getFaculty: async () => {
        const response = await apiClient.get(`${API_BASE_URL}/faculties?page=1&limit=100&sortOrder=asc&sortBy=name_vi`);
        return response.data;
    },
    updateFaculty: async ({ documentId, data }) => {
        const response = await apiClient.put(`${API_BASE_URL}/faculties/${documentId}`, { data });
        return response.data;
    },
    createFaculty: async (data) => {
        const response = await apiClient.post(`${API_BASE_URL}/faculties`, { data });
        return response.data;
    },
    deleteFaculty: async ({ documentId }) => {
        const response = await apiClient.delete(`${API_BASE_URL}/faculties/${documentId}`);
        return response.data;
    },
    restoreFaculty: async ({ documentId }) => {
        const response = await apiClient.post(`${API_BASE_URL}/faculties/${documentId}/restore`);
        return response.data;
    },


    getSpecialization: async () => {
        const response = await apiClient.get(`${API_BASE_URL}/specializeds?page=1&limit=100&sortOrder=asc&sortBy=name_vi`);
        return response.data;
    },
    updateSpecialization: async ({ documentId, data }) => {
        const response = await apiClient.put(`${API_BASE_URL}/specializeds/${documentId}`, { data });
        return response.data;
    },
    createSpecialization: async (data) => {
        const response = await apiClient.post(`${API_BASE_URL}/specializeds`, { data });
        return response.data;
    },
    deleteSpecialization: async ({ documentId }) => {
        const response = await apiClient.delete(`${API_BASE_URL}/specializeds/${documentId}`);
        return response.data;
    },
    restoreSpecialization: async ({ documentId }) => {
        const response = await apiClient.post(`${API_BASE_URL}/specializeds/${documentId}/restore`);
        return response.data;
    },


    getBatch: async () => {
        const response = await apiClient.get(`${API_BASE_URL}/batches?page=1&limit=100&sortOrder=asc&sortBy=name_vi`);
        return response.data;
    },
    updateBatch: async ({ documentId, data }) => {
        const response = await apiClient.put(`${API_BASE_URL}/batches/${documentId}`, { data });
        return response.data;
    },
    createBatch: async (data) => {
        const response = await apiClient.post(`${API_BASE_URL}/batches`, { data });
        return response.data;
    },
    deleteBatch: async ({ documentId }) => {
        const response = await apiClient.delete(`${API_BASE_URL}/batches/${documentId}`);
        return response.data;
    },
    restoreBatch: async ({ documentId }) => {
        const response = await apiClient.post(`${API_BASE_URL}/batches/${documentId}/restore`);
        return response.data;
    },


    getClass: async () => {
        const response = await apiClient.get(`${API_BASE_URL}/classes?page=1&limit=100&sortOrder=asc&sortBy=name_vi`);
        return response.data;
    },
    updateClass: async ({ documentId, data }) => {
        const response = await apiClient.put(`${API_BASE_URL}/classes/${documentId}`, { data });
        return response.data;
    },
    createClass: async (data) => {
        const response = await apiClient.post(`${API_BASE_URL}/classes`, { data });
        return response.data;
    },
    deleteClass: async ({ documentId }) => {
        const response = await apiClient.delete(`${API_BASE_URL}/classes/${documentId}`);
        return response.data;
    },
    restoreClass: async ({ documentId }) => {
        const response = await apiClient.post(`${API_BASE_URL}/classes/${documentId}/restore`);
        return response.data;
    },


}

export default learningService;
