import { API_BASE_URL } from "@/constants";
import apiClient from "@/utils/api";


const studyService = {
    updateProject: async ({ documentId, data }) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/projects/${documentId}`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error updating project:", error);
            throw error;
        }
    },

    createProject: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/projects`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error creating project:", error);
            throw error;
        }
    },

    updateTask: async ({ taskId, data }) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/tasks/${taskId}`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    },

    createTask: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/tasks`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error creating task:", error);
            throw error;
        }
    },

    deleteTask: async ({ taskId }) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/tasks/${taskId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    },

    restoreTask: async ({ taskId }) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/tasks/${taskId}/restore`);
            return response.data;
        } catch (error) {
            console.error("Error restoring task:", error);
            throw error;
        }
    },

    permanentDeleteTask: async ({ taskId }) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/tasks/${taskId}/force`);
            return response.data;
        } catch (error) {
            console.error("Error permanently deleting task:", error);
            throw error;
        }
    },

    addMembersToProject: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/project-members`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error adding members to project:", error);
            throw error;
        }
    },

    removeMembersFromProject: async ({ documentId }) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/project-members/${documentId}`);
            return response.data;
        } catch (error) {
            console.error("Error removing members from project:", error);
            throw error;
        }
    },

    getProjectMembers: async ({ projectId, userId }) => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/project-members?user_id=${userId}&project_id=${projectId}`);
            return response.data;
        } catch (error) {
            console.error("Error getting project members:", error);
            throw error;
        }
    },

    createSubjectLearn: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/scores`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error creating subjectLearn:", error);
            throw error;
        }
    },

    updateSubjectLearn: async ({ scoreId, data }) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/scores/${scoreId}`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error updating subjectLearn:", error);
            throw error;
        }
    },

    deleteSubjectLearn: async ({ scoreId }) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/scores/${scoreId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting subjectLearn:", error);
            throw error;
        }
    },

    createDocument: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/document-shares`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error creating document:", error);
            throw error;
        }
    },

    updateDocument: async ({ documentId, data }) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/document-shares/${documentId}`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error updating document:", error);
            throw error;
        }
    },

    createDocumentTag: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/post-tags/bulk`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error creating document tag:", error);
            throw error;
        }
    },

    getDocumentTag: async ({ documentShareId, tagId }) => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/post-tags?document_share_id=${documentShareId}&tag_id=${tagId}`);
            return response.data;
        } catch (error) {
            console.error("Error getting document tag:", error);
            throw error;
        }
    },

    deleteDocumentTag: async ({ documentId }) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/post-tags/${documentId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting document tag:", error);
            throw error;
        }
    },

    deleteDocument: async ({ documentId }) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/document-shares/${documentId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting document:", error);
            throw error;
        }
    }
}
export default studyService;
