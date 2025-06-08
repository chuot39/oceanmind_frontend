import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    jwt_token: null
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                userInfo: action.userInfo,
                jwt_token: action.jwt_token
            }
        case actionTypes.USER_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
                jwt_token: null
            }
        case actionTypes.PROCESS_LOGOUT:
            return initialState

        case actionTypes.UPDATE_USER_INFO_SUCCESS:
            console.log('Updating Redux store with new user info:', action.userInfo);
            const updatedUserInfo = {
                ...state.userInfo,
                ...action.userInfo,
            };

            if (action.userInfo.avatar) {
                updatedUserInfo.avatar = action.userInfo.avatar;
            }

            if (action.userInfo.avatar_url_id) {
                updatedUserInfo.avatar_url_id = action.userInfo.avatar_url_id;
            }

            if (action.userInfo.banner_url_id) {
                updatedUserInfo.banner_url_id = action.userInfo.banner_url_id;
            }

            return {
                ...state,
                userInfo: updatedUserInfo
            };
        case actionTypes.UPDATE_USER_INFO_FAIL:
            return state
        default:
            return state;
    }
}

export default appReducer; 