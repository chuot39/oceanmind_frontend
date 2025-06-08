import { useInfiniteQuery, useQuery } from "react-query"
import { API_BASE_URL } from "../../../../constants"
import apiClient from "../../../../utils/api"
import moment from "moment"


//used in card carousel
export const useUser = () => {
    const fetchUser = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/users`)
        return response?.data
    }

    return useQuery(['admin-query-user'], fetchUser, {
        enabled: true, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

//used in card carousel
export const useProject = () => {
    const fetchProject = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/projects`)
        return response?.data
    }

    return useQuery(['admin-query-project'], fetchProject, {
        enabled: true, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

//used in card carousel
export const useGroup = () => {
    const fetchGroup = async () => {
        const response = await apiClient.get(`${API_BASE_URL}/groups`)
        return response?.data
    }

    return useQuery(['admin-query-group'], fetchGroup, {
        enabled: true, // Only run if username is available
        refetchOnWindowFocus: false,
    })
}

