import { API_BASE_URL } from "@/constants";
import apiClient from "@/utils/api";
import imageService from "../../services/media/imageService";

const userService = {
    reportPost: async (reportData) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/reports`, {
                data: {
                    post_id: reportData.post_id,
                    user_id: reportData.user_id,
                    reason: reportData.reason,
                    notification_email: reportData.notification_email,
                    status: 'pending' // Default status for new reports
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error reporting post:", error);
            throw error;
        }
    },

    updateSocialInfo: async (documentId, account_url) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/user-socials/${documentId}`, {
                data: account_url
            });
            return response.data;
        } catch (error) {
            console.error("Error updating social info:", error);
            throw error;
        }
    },

    addSocialInfo: async (socialData) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/user-socials`, {
                data: socialData
            });
            return response.data;
        } catch (error) {
            console.error("Error adding social info:", error);
            throw error;
        }
    },

    deleteSocialInfo: async (documentId) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/user-socials/${documentId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting social info:", error);
            throw error;
        }
    },

    updateUserBanner: async (userId, bannerId) => {
        try {

            const jwt_token = localStorage.getItem('jwt_token');

            const config = {
                headers: {
                    Authorization: `Bearer ${jwt_token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await apiClient.put(`${API_BASE_URL}/users/${userId}`,
                { data: { banner_url_id: bannerId } },
                config
            );
            return response?.data;
        } catch (error) {
            console.error("Error updating user banner:", error);
            throw error;
        }
    },

    updateUserAvatar: async (userId, avatarId) => {
        try {
            const jwt_token = localStorage.getItem('jwt_token');

            const config = {
                headers: {
                    Authorization: `Bearer ${jwt_token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await apiClient.put(`${API_BASE_URL}/users/${userId}`,
                { data: { avatar_url_id: avatarId } },
                config
            );

            return response?.data;
        } catch (error) {
            console.error("Error updating user avatar:", error);
            throw error;
        }
    },

    updateUserInfo: async (userId, userData) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/users/${userId}`, { data: userData });
            return response?.data;
        } catch (error) {
            console.error("Error updating user info:", error);
            throw error;
        }
    },

    restoreUser: async (userId) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/users/${userId}/restore`);
            return response?.data;
        } catch (error) {
            console.error("Error restoring user:", error);
            throw error;
        }
    },
    register: async (userData) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/auth/register`, {
                data: userData
            });
            return response?.data;
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    },

    deleteUser: async (userId) => {
        try {
            const jwt_token = localStorage.getItem('jwt_token');

            const config = {
                headers: {
                    Authorization: `Bearer ${jwt_token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await apiClient.delete(`${API_BASE_URL}/users/${userId}`, config);
            return response?.data;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    getAllUsers: async () => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/users`);
            return response?.data;
        } catch (error) {
            console.error("Error getting all users:", error);
            throw error;
        }
    },

    getAllCodeServices: async (type) => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/code-services?type=${type}`);
            return response?.data;
        } catch (error) {
            console.error("Error getting all code services:", error);
            throw error;
        }
    },

    updateUserSecurity: async (userId, username, email, password, currentPassword) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/users/${userId}/update-security`, { data: { username, email, password, currentPassword } });
            return response?.data;
        } catch (error) {
            console.error("Error update user security:", error);
            throw error;
        }
    }
};

export default userService;
