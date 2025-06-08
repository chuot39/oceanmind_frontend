import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
import { LOGIN_API } from "@/constants";
import { userLoginFail, userLoginSuccess } from "@/redux/store/actions";
import apiClient from "@/utils/api";
import userService from "@/services/api/userService";
import imageService from "@/services/media/imageService";
import { uploadImage } from "@/helpers/imgHelper";

export const useLogin = () => {
    const dispatch = useDispatch();
    return useMutation(async ({ username, password }) => {
        const loginResponse = await apiClient.post(LOGIN_API, { usernameOrEmail: username, password });
        const { token, user } = loginResponse.data.data;

        const userDetails = user;

        return { user, userDetails, token };
    }, {
        onSuccess: (data) => {
            localStorage.setItem('jwt_token', data.token)
            localStorage.setItem('user', JSON.stringify(data.userDetails))
            dispatch(userLoginSuccess(data.userDetails, data.token));
        },
        onError: (error) => {
            console.error('Login error:', error);
            dispatch(userLoginFail());
            localStorage.removeItem('jwt_token');
        }
    })
}


export const useRegister = () => {
    return useMutation(async (userData) => {
        // const imgUploadResponse = await uploadImage(userData.avatar_url_id);
        // const avatarUrl = imgUploadResponse.data.data.url;
        // userData.avatar_url_id = avatarUrl;

        const response = await userService.register(userData);
        return response;
    }, {
        onSuccess: (data) => {
            console.log('data', data)
        },
        onError: (error) => {
            console.error('Register error:', error);
        }
    })
};

