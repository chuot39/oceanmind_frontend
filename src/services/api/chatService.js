import apiClient from "@/utils/api";
import { API_BASE_URL } from "@/constants";

const chatService = {
    sendTextMessage: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/messages`, {
                data: data
            })
            return response.data;
        } catch (error) {
            console.error("Error sending text message:", error);
            throw error;
        }
    },

    createStatusMessage: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/message-statuses`, {
                data: data
            })
            return response.data;
        } catch (error) {
            console.error("Error creating status message:", error);
            throw error;
        }
    },

    updateMessageStatus: async (data) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/message-statuses/${data?.documentId}`, {
                data: {
                    is_read: data?.is_read
                }
            })
            return response.data;
        } catch (error) {
            console.error("Error updating message status:", error);
            throw error;
        }
    },

    createConversation: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/conversations`, {
                data: data
            })
            return response.data;
        } catch (error) {
            console.error("Error creating conversation:", error);
            throw error;
        }
    }
}

export default chatService;
