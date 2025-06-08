import apiClient from "@utils/api";
import { API_BASE_URL } from "@constants";

const groupService = {

    updateGroup: async (groupId, data) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/groups/${groupId}`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error updating group:", error);
            throw error;
        }
    },

    createGroup: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/groups`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error creating group:", error);
            throw error;
        }
    },

    joinGroup: async (groupId, userId, isAdmin) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/group-members`, {
                data: {
                    group_id: groupId,
                    user_id: userId,
                    isAdmin: isAdmin
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error joining group:", error);
            throw error;
        }
    },

    inviteMember: async (groupId, memberId, userId) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/group-invitations`, {
                data: {
                    group_id: groupId,
                    invited_to: memberId,
                    invited_by: userId,
                    invitation_status: 'pending'
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error inviting member:", error);
            throw error;

        };
    },

    deleteGroup: async (groupId) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/groups/${groupId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting group:", error);
            throw error;
        }
    },

    getGroupMembers: async (groupId) => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/group-members?filters[$and][0][group_id][documentId][$eq]=${groupId}`);
            return response.data;
        } catch (error) {
            console.error("Error getting group members:", error);
            throw error;
        }
    },

    deleteGroupMember: async (groupMemberId) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/group-members/${groupMemberId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting group member:", error);
            throw error;
        }
    },

    deleteGroupInvitation: async (groupInvitationId) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/group-invitations/${groupInvitationId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting group invitation:", error);
            throw error;
        }
    },

    getInvitations: async (groupId) => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/group-invitations?filters[$and][0][group_id][documentId][$eq]=${groupId}`);
            return response.data;
        } catch (error) {
            console.error("Error getting invitations:", error);
            throw error;
        }
    },

    getGroupPosts: async (groupId) => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/posts?filters[$and][0][group_id][documentId][$eq]=${groupId}`);
            return response.data;
        } catch (error) {
            console.error("Error getting group posts:", error);
            throw error;
        }
    },

    deleteGroupPost: async (groupPostId) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/posts/${groupPostId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting group post:", error);
            throw error;
        }
    },

    getGroupRequests: async (groupId) => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/group-requests?filters[$and][0][group_id][documentId][$eq]=${groupId}`);
            return response.data;
        } catch (error) {
            console.error("Error getting group requests:", error);
            throw error;
        }
    },

    deleteGroupRequest: async (groupRequestId) => {
        try {
            const response = await apiClient.delete(`${API_BASE_URL}/group-requests/${groupRequestId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting group request:", error);
            throw error;
        }
    },

    getGroupMemberId: async ({ groupId, userId }) => {
        try {
            const response = await apiClient.get(`${API_BASE_URL}/group-members/groups?userId=${userId}&groupId=${groupId}`);
            return response?.data?.data[0]?.documentId;
        } catch (error) {
            console.error("Error getting group member id:", error);
            throw error;
        }
    },

    resolveGroupJoinRequest: async (requestId, status) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/group-requests/${requestId}`, {
                data: { request_status: status }
            });
            return response.data;
        } catch (error) {
            console.error("Error resolving group join request:", error);
            throw error;
        }
    },

    requestJoinGroup: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/group-requests`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error requesting to join group:", error);
            throw error;
        }
    },

    updateNotification: async (documentId, data) => {
        try {
            const response = await apiClient.put(`${API_BASE_URL}/user-settings/${documentId}`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error updating notification:", error);
            throw error;
        }
    },

    createNotification: async (data) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/user-settings`, {
                data: data
            });
            return response.data;
        } catch (error) {
            console.error("Error creating notification:", error);
            throw error;
        }
    }
};
export default groupService;
