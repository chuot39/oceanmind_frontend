import axios from "axios";
import { API_BASE_URL, USER_DATA_API } from "../constants";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(config => {
    const jwt_token = localStorage.getItem("jwt_token");
    if (jwt_token) {
        config.headers.Authorization = `Bearer ${jwt_token}`
    }
    return config
}, error => {
    return Promise.reject(error)
})
export default apiClient;

export const getAuthHeaders = () => {
    const jwt_token = localStorage.getItem('jwt_token');
    return {
        'Authorization': `Bearer ${jwt_token}`
    }
}

export const fetchUserData = async () => {
    const response = await fetch(USER_DATA_API, {
        method: 'GET',
        headers: getAuthHeaders()
    })

    if (!response.ok) {
        throw new Error('Failed to fetch user data')
    }

    return await response.json();
}


export const handleLogout = () => {
    try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return true
    } catch (error) {
        return false
    }
};