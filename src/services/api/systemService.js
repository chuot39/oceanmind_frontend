import { API_BASE_URL } from "@/constants";
import apiClient from "@/utils/api";

const systemService = {
    createNotification: async (data) => {
        return await apiClient.post(`${API_BASE_URL}/notifications`, { data });
    },
    createUserNotification: async (user_id, notification_id) => {
        return await apiClient.post(`${API_BASE_URL}/user-notifications`, {
            data: {
                user_id: user_id,
                notification_id: notification_id,
                is_read: false
            }
        });
    },

    createUserNotificationBulk: async (data) => {
        return await apiClient.post(`${API_BASE_URL}/user-notifications/bulk`, { data });
    },

    deleteNotification: async ({ documentId }) => {
        return await apiClient.delete(`${API_BASE_URL}/notifications/${documentId}`);
    },

    restoreNotification: async ({ documentId }) => {
        return await apiClient.patch(`${API_BASE_URL}/notifications/${documentId}/restore`);
    },

    permanentDeleteNotification: async ({ documentId }) => {
        return await apiClient.delete(`${API_BASE_URL}/notifications/${documentId}/force`);
    },


    // Event
    createEvent: async (data) => {
        return await apiClient.post(`${API_BASE_URL}/events`, { data });
    },

    deleteEvent: async ({ documentId }) => {
        return await apiClient.delete(`${API_BASE_URL}/events/${documentId}`);
    },

    restoreEvent: async ({ documentId }) => {
        return await apiClient.patch(`${API_BASE_URL}/events/${documentId}/restore`);
    },

    permanentDeleteEvent: async ({ documentId }) => {
        return await apiClient.delete(`${API_BASE_URL}/events/${documentId}/force`);
    },

    updateEvent: async ({ documentId, data }) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/events/${documentId}`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error updating task:", error);
            // throw error; 
        }
    },

    // Report
    updateReport: async ({ documentId, data }) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/reports/${documentId}`, { data });
            return response.data;
        } catch (error) {
            console.error("Error updating report:", error);
            throw error;
        }
    },

};

export default systemService;
