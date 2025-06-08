import { toast } from 'react-toastify';
import userService from '../../../services/api/userService';
import actionTypes from './actionTypes';

// export const fetchGenderStart = () => {
//     return async (dispatch, getState) => {
//         try {
//             dispatch({ type: actionTypes.FETCH_GENDER_START })
//             let res = await getAllCodeServices("GENDER")
//             if (res && res?.errCode === 0) {
//                 dispatch(fetchGenderSuccess(res?.data))
//             } else {
//                 dispatch(fetchGenderFailed())
//             }
//         } catch (error) {
//             dispatch(fetchGenderFailed());
//         }
//     }
// }

export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

// export const fetchPositionStart = () => {
//     return async (dispatch, getState) => {
//         try {
//             let res = await getAllCodeServices("POSITION")
//             if (res && res?.errCode === 0) {
//                 dispatch(fetchPositionSuccess(res?.data))
//             } else {
//                 dispatch(fetchPositionFailed())
//             }
//         } catch (error) {
//             dispatch(fetchPositionFailed());
//         }
//     }
// }

export const fetchPositionSuccess = (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data: positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

// export const fetchRoleStart = () => {
//     return async (dispatch, getState) => {
//         try {
//             let res = await getAllCodeServices("ROLE")
//             if (res && res?.errCode === 0) {
//                 dispatch(fetchRoleSuccess(res?.data))
//             } else {
//                 dispatch(fetchRoleFailed())
//             }
//         } catch (error) {
//             dispatch(fetchRoleFailed());
//         }
//     }
// }

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})

export const saveUserSuccess = () => ({
    type: 'SAVE_USER_SUCCESS'
})

export const saveUserFailed = () => ({
    type: 'SAVE_USER_FAILED'
})

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.register(data);
            if (res && res.errCode === 0) {
                toast.success('Create new user successfully! ')
                dispatch(saveUserSuccess())
                dispatch(fetchAllUsersStart())
            } else {
                dispatch(saveUserFailed())
            }
        } catch (error) {
            dispatch(saveUserFailed());
        }
    }
}

export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await userService.getAllUsers()
            if (res && res?.errCode === 0) {
                dispatch(fetchAllUsersSuccess(res?.users.reverse()))
            } else {
                toast.success('fetch all users error! ')
                dispatch(fetchAllUsersFailed())
            }
        } catch (error) {
            dispatch(fetchAllUsersFailed());
            toast.success('fetch all users error! ')

        }
    }
}

export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data
})

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED
})

// export const deleteNewUser = (userId) => {
//     return async (dispatch, getState) => {
//         try {
//             let res = await deleteUser(userId);
//             if (res && res.errCode === 0) {
//                 toast.success('Delete user successfully! ')
//                 dispatch(deleteUsersSuccess())
//                 dispatch(fetchAllUsersStart())
//             } else {
//                 toast.success('Delete user failed! ')
//                 dispatch(deleteUsersFailed())
//             }
//         } catch (error) {
//             toast.success('Delete user failed! ')
//             dispatch(deleteUsersFailed());
//         }
//     }
// }

export const deleteUsersSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS,
})

export const deleteUsersFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

