import { useQuery, useMutation } from "react-query";
import { API_BASE_URL } from "../../../../constants";
import apiClient from "../../../../utils/api";


export const useProjectUser = (documentId) => {
    const fetchProjectUser = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/project-members?user_id=${documentId}&page=1&limit=100`);

        await Promise.all(response?.data?.data?.map(async item => {
            const projectMember = await apiClient.get(`${API_BASE_URL}/project-members/projects/${item?.project_id}?page=1&limit=100`)
            const projectTasks = await apiClient.get(`${API_BASE_URL}/tasks?project_id=${item?.project_id}&page=1&limit=10&sortBy=createdAt&sortOrder=DESC`)

            item.project_member = projectMember?.data?.data
            item.project_tasks = projectTasks?.data?.data
            return item;
        }));

        return response?.data;
    }

    return useQuery(['query-projectUser', documentId], fetchProjectUser, {
        enabled: !!documentId,
        refetchOnWindowFocus: false,
        staleTime: 10000, // 10 seconds
        cacheTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const useTaskUser = (arrTaskIds) => {
    const fetchTaskUser = async () => {
        if (!arrTaskIds?.length) return { data: [] };

        const filter = arrTaskIds?.map((item, index) => `filters[$or][${index}][documentId][$eq]=${item}`).join('&');
        const response = await apiClient.get(`${API_BASE_URL}/tasks?populate=*&${filter}&filters[$and][0][task_deleted_at][$null]=true&sort=updatedAt:DESC`);

        await Promise.all(response?.data?.data?.map(async item => {
            const detailAssignBy = await apiClient.get(`${API_BASE_URL}/users?filters[$and][0][documentId][$eq]=${item?.task_assigned_by?.documentId}&populate[0]=avatar_url_id&populate[1]=banner_url_id&sort=updatedAt:DESC`)
            const detailAssignTo = await apiClient.get(`${API_BASE_URL}/users?filters[$and][0][documentId][$eq]=${item?.task_assigned_to?.documentId}&populate[0]=avatar_url_id&populate[1]=banner_url_id&sort=updatedAt:DESC`)
            item.task_assigned_by = detailAssignBy?.data[0]
            item.task_assigned_to = detailAssignTo?.data[0]
            return item;
        }));

        return response?.data;
    }

    return useQuery(['query-taskUser', arrTaskIds], fetchTaskUser, {
        enabled: !!arrTaskIds?.length,
        refetchOnWindowFocus: false,
        staleTime: 10000, // 10 seconds
        cacheTime: 5 * 60 * 1000, // 5 minutes
    });
}


export const useDetailProject = (projectId) => {
    const fetchDetailProject = async () => {
        if (!projectId) return null;

        const response = await apiClient.get(`${API_BASE_URL}/projects?filters[$and][0][documentId][$eq]=${projectId}&populate=*&sort=updatedAt:DESC`);

        if (response?.data?.data && response.data.data.length > 0) {
            const project = response.data.data[0];
            const detailLeaderProject = await apiClient.get(`${API_BASE_URL}/users?filters[$and][0][documentId][$eq]=${project?.leader_project_id?.documentId}&populate[0]=avatar_url_id&populate[1]=banner_url_id&sort=updatedAt:DESC`)
            project.leader_project_id = detailLeaderProject?.data[0]
            // Populate project members with detailed information
            if (project.project_members && project.project_members.length > 0) {
                await Promise.all(project.project_members.map(async item => {
                    const detailMemberProject = await apiClient.get(`${API_BASE_URL}/project-members?filters[$and][0][documentId][$eq]=${item.documentId}&populate=*&sort=updatedAt:DESC`);

                    if (detailMemberProject?.data?.data && detailMemberProject.data.data.length > 0) {
                        const detailMember = await apiClient.get(`${API_BASE_URL}/users?filters[$and][0][documentId][$eq]=${detailMemberProject.data.data[0].user_id.documentId}&populate[0]=avatar_url_id&populate[1]=banner_url_id&sort=updatedAt:DESC`);

                        if (detailMember?.data && detailMember.data.length > 0) {
                            item.detail_member_project = detailMember.data[0];
                        }
                    }
                    return item;
                }));
            }

            return project;
        }

        return null;
    };

    return useQuery(['detailProject', projectId], fetchDetailProject, {
        enabled: !!projectId, // Chỉ gọi API khi có projectId
        refetchOnWindowFocus: false,
        staleTime: 10000, // 10 seconds
    });
};



