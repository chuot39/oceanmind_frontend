// import { handleLogin } from '../../../utils/api';
import actionTypes from './actionTypes';

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})


export const userLoginSuccess = (user, jwt) => ({
    type: actionTypes.USER_LOGIN_SUCCESS,
    userInfo: user,
    jwt_token: jwt
})

export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL
})

export const userLogout = () => {
    localStorage.removeItem('jwt_token');
    return {
        type: actionTypes.PROCESS_LOGOUT
    };
};

export const updateUserInfoSuccess = (updatedUser) => ({
    type: actionTypes.UPDATE_USER_INFO_SUCCESS,
    userInfo: updatedUser
});

export const updateUserInfoFail = () => ({
    type: actionTypes.UPDATE_USER_INFO_FAIL
});

// export const userLogin = (identifier, password) => async (dispatch) => {
//     try {
//         const { user, jwt } = await handleLogin(identifier, password);
//         localStorage.setItem('jwt_token', jwt);
//         dispatch(userLoginSuccess(user, jwt));
//     } catch (error) {
//         dispatch(userLoginFail());
//         throw new Error(error.message);
//     }
// };