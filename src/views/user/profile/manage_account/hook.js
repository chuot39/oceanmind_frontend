import { useQuery } from "react-query";
import { API_BASE_URL } from "../../../../constants";
import apiClient from "../../../../utils/api";

export const useDetailClassUser = (classId) => {
    const fetchDetailClassUser = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/classes/${classId}`);
        return response?.data;
    }

    return useQuery(['query-detailClassUser', classId], fetchDetailClassUser, {
        enabled: !!classId,
        refetchOnWindowFocus: false,
    });
}

export const useSubject = (specializedId) => {
    const fetchSubject = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/specialized-subjects?populate[subject_id][populate]=*&filters[$and][0][specialized_id][documentId][$eq]=${specializedId}&sort=updatedAt:DESC`);

        // await Promise.all(response?.data?.data?.map(async item => {
        //     const detailPreviousSubject = await apiClient.get(`${API_BASE_URL}/previous-subjects?filters[$and][0][subject_id][documentId][$eq]=${item?.subject_id?.documentId}&populate=*&sort=updatedAt:DESC`)
        //     item.subject_id.detail_previous_subjects = detailPreviousSubject?.data?.data
        //     return item;
        // }));

        // await Promise.all(response?.data?.data?.map(async item => {
        //     const detailPrepequisiteSubject = await apiClient.get(`${API_BASE_URL}/prepequisite-subjects?filters[$and][0][subject_id][documentId][$eq]=${item?.subject_id?.documentId}&populate=*&sort=updatedAt:DESC`)
        //     item.subject_id.detail_prepequisite_subjects = detailPrepequisiteSubject?.data?.data
        //     return item;
        // }));

        return response?.data;
    }

    return useQuery(['Subject', specializedId], fetchSubject, {
        enabled: !!specializedId,
        refetchOnWindowFocus: false,
    });
}

export const useFaculty = () => {
    const fetchFaculty = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/faculties?sort=updatedAt:DESC`);
        return response?.data;
    }
    return useQuery(['Faculty'], fetchFaculty, {
        enabled: true,
        refetchOnWindowFocus: false,
    });
}

export const useGender = () => {
    const fetchGender = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/genders?sort=updatedAt:DESC`);
        return response?.data;
    }
    return useQuery(['query-gender'], fetchGender, {
        enabled: true,
        refetchOnWindowFocus: false,
    });
}

export const useSpecialized = (facultyId) => {
    const fetchSpecialized = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/specializeds?facultyId=${facultyId}&sortBy=name_en&sortOrder=ASC&limit=100`);
        return response?.data;
    }
    return useQuery(['query-specialized', facultyId], fetchSpecialized, {
        enabled: !!facultyId,
        refetchOnWindowFocus: false,
    });
}

export const useClass = (specializedId) => {
    const fetchClass = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/classes?specializedId=${specializedId}&limit=30`);
        return response?.data;
    }

    return useQuery(['query-class', specializedId], fetchClass, {
        enabled: !!specializedId,
        refetchOnWindowFocus: false,
    });
}

export const useSocialUser = (documentId) => {
    const fetchSocialUser = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/user-socials?userId=${documentId}&sortBy=createdAt&sortOrder=DESC`);
        return response?.data;
    }

    return useQuery(['query-socialUser', documentId], fetchSocialUser, {
        enabled: !!documentId,
        refetchOnWindowFocus: false,
    });
}

export const useSocial = () => {
    const fetchSocial = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/socials?sort=platform:ASC`);
        return response?.data;
    }
    return useQuery(['query-social'], fetchSocial, {
        enabled: true,
        refetchOnWindowFocus: false,
    });
}
