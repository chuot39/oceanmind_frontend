import { API_BASE_URL } from "@/constants";
import apiClient from "../../../utils/api";

const subjectService = {

    getSubjectsBySpecializedId: async (specializedId) => {
        const response = await apiClient.get(`${API_BASE_URL}/specialized-subjects?populate[subject_id][populate]=*&filters[$and][0][specialized_id][documentId][$eq]=${specializedId}&sort=updatedAt:DESC`);
        return response?.data;
    }
}
export default subjectService;
