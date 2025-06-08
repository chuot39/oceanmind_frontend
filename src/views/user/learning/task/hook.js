import { useQuery, useMutation } from "react-query";
import { API_BASE_URL } from "../../../../constants";
import apiClient from "../../../../utils/api";


export const useCategoryTask = () => {
    const fetchCategoryTask = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/task-categories?sort=task_priority:ASC`);
        return response?.data;
    }

    return useQuery(['CategoryTask'], fetchCategoryTask, {
        enabled: true,
        refetchOnWindowFocus: false,
    });
}

export const useProjectSelect = (username) => {
    const fetchProjectSelect = async () => {
        const responseProject = await apiClient.get(`${API_BASE_URL}/projects?populate=*&filters[$and][0][leader_project_id][username][$eq]=${username}&filters[$and][1][project_completed_on][$null]=true&sort:updatedAt:DESC`);
        const responseMemberProject = await apiClient.get(`${API_BASE_URL}/project-members?populate=*&filters[$and][0][user_id][username][$eq]=${username}&sort:updatedAt:DESC`);

        return {
            leader: responseProject?.data,
            memberOfProject: responseMemberProject?.data
        }
    }

    return useQuery(['projectSelect'], fetchProjectSelect, {
        enabled: true,
        refetchOnWindowFocus: false
    })
}

export const useMemberOfProject = (projectId) => {
    const fetchMemberOfProject = async () => {
        if (!projectId) return null;
        const projectMember = await apiClient.get(`${API_BASE_URL}/project-members/projects/${projectId}?page=1&limit=100`)

        return projectMember?.data;
    }

    return useQuery(['memberOfProject', projectId], fetchMemberOfProject, {
        enabled: !!projectId, // Chỉ gọi API khi có projectId
        refetchOnWindowFocus: false
    });
}

export const useDetailProject = (projectId) => {
    const fetchDetailProject = async () => {
        if (!projectId) return null;

        const response = await apiClient.get(`${API_BASE_URL}/projects?populate=*&filters[$and][0][documentId][$eq]=${projectId}`);
        return response?.data;
    }

    return useQuery(['detailProject', projectId], fetchDetailProject, {
        enabled: !!projectId, // Chỉ gọi API khi có projectId
        refetchOnWindowFocus: false
    });
}

export const useTaskCategory = () => {
    const fetchTaskCategory = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/task-categories?sort=task_priority:asc`);
        return response?.data;
    }
    return useQuery(['taskCategory'], fetchTaskCategory, {
        enabled: true,
        refetchOnWindowFocus: false
    });
}

export const useMemberProjectSelect = () => {
    return useMutation(async (projectId) => {
        // Nếu có projectId, lấy thành viên của project đó
        if (projectId) {
            const response = await apiClient.get(`${API_BASE_URL}/project-members?populate=*&filters[$and][0][project_id][documentId][$eq]=${projectId}`);
            return response?.data;
        }
        // Nếu không có projectId, lấy tất cả project-members
        else {
            const response = await apiClient.get(`${API_BASE_URL}/project-members?populate=*`);
            return response?.data;
        }
    });
}