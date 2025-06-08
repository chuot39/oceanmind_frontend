import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../api";
import { API_BASE_URL, LOGIN_API, USER_DATA_API } from "../../constants";
import { userLoginFail, userLoginSuccess, userLogout, updateUserInfoSuccess, updateUserInfoFail } from "../../redux/store/actions/userActions";
import { notifyError, notifySuccess } from "../Utils";
import { useIntl } from "react-intl";
import userService from "../../services/api/userService";
import imageService from "../../services/media/imageService";

export const useAuth = () => {
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    return { isLoggedIn };
}

// export const useLogin = () => {
//     const dispatch = useDispatch();
//     return useMutation(async ({ username, password }) => {
//         const loginResponse = await apiClient.post(LOGIN_API, { usernameOrEmail: username, password });
//         const { token, user } = loginResponse.data.data;
//         console.log('loginResponse', loginResponse)
//         const config = {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         };
//         const userDetails = user;

//         return { user, userDetails, token };
//     }, {
//         onSuccess: (data) => {
//             localStorage.setItem('jwt_token', data.token)
//             localStorage.setItem('user', JSON.stringify(data.userDetails))
//             dispatch(userLoginSuccess(data.userDetails, data.token));
//         },
//         onError: (error) => {
//             console.error('Login error:', error);
//             dispatch(userLoginFail());
//             localStorage.removeItem('jwt_token');
//         }
//     })
// }

export const useUserData = () => {
    const userData = useSelector(state => state.user.userInfo);

    return { userData };
}

export const useLogout = () => {
    const dispatch = useDispatch();
    return () => {
        dispatch(userLogout());
    };
}


export const useNotificationCreatedBy = (usernames) => {
    const fetchNotificationCreatedBy = async () => {
        const filters = usernames.map((username, index) =>
            `filters[$or][${index}][username][$eq]=${username}`
        ).join('&');

        const response = await apiClient.get(
            `${API_BASE_URL}/users?${filters}&populate[0]=avatar_url_id`
        );
        return response?.data;
    };

    return useQuery(
        ['notification-created-by', usernames],
        fetchNotificationCreatedBy,
        {
            enabled: !!usernames?.length,
            refetchOnWindowFocus: false,
        }
    );
};

export const updateUserInfoInRedux = async (userId) => {
    try {
        // Thêm timestamp để tránh cache
        const timestamp = new Date().getTime();
        const userDetailsResponse = await apiClient.get(`${API_BASE_URL}/users/${userId}?_t=${timestamp}`);

        // Thêm log để debug
        console.log('API response for updated user:', userDetailsResponse?.data?.data);

        return userDetailsResponse?.data?.data;
    } catch (error) {
        console.error('Error fetching updated user info:', error);
        throw error;
    }
};

export const useUpdateUserInfo = () => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const queryClient = useQueryClient();
    const { userData } = useUserData();

    return useMutation(async () => {

        // Chờ một chút để đảm bảo server đã cập nhật dữ liệu
        await new Promise(resolve => setTimeout(resolve, 300));
        const userDetails = await updateUserInfoInRedux(userData?.documentId);
        return userDetails;
    }, {
        onSuccess: (userDetails) => {
            console.log('userDetails to update Redux:', userDetails);
            localStorage.setItem('user', JSON.stringify(userDetails));
            // Cập nhật Redux store
            dispatch(updateUserInfoSuccess(userDetails));

            // Cập nhật React Query cache nếu có
            queryClient.invalidateQueries(['user-data']);
            queryClient.invalidateQueries(['user-profile']);

            notifySuccess(intl.formatMessage({ id: 'profile.manage_account.update_info_success' }));
            return userDetails;
        },
        onError: (error) => {
            console.error('Update user info error:', error);
            dispatch(updateUserInfoFail());
            notifyError(intl.formatMessage({ id: 'profile.manage_account.update_info_error' }));
            // throw error;
        }
    });
};
