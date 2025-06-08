import userService from "@/services/api/userService";
import { useUpdateUserInfo } from "@/utils/hooks/useAuth";
import { notifyError, notifySuccess } from "@/utils/Utils";
import { useIntl } from "react-intl";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";

export const useUpdateSocialInfo = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();

    return useMutation(async ({ userId, socialData, oldData }) => {

        const oldSocialData = oldData?.map(item => item?.social?.documentId);
        const newSocialData = socialData?.map(item => item?.platform);

        const updateSocialData = oldData?.filter(oldItem => {
            const matchingNewData = socialData?.find(newItem =>
                newItem?.platform === oldItem?.social?.documentId
            );
            if (matchingNewData) {
                oldItem.account_url = matchingNewData.account_url;
                return oldItem;
            }
            return false;
        });

        const socialDataToAdd = socialData?.filter(item => !oldSocialData?.some(oldItem => oldItem === item?.platform));
        const socialDataToRemove = oldData?.filter(item => !newSocialData?.some(newItem => newItem === item?.social?.documentId));


        const updateSocialDataPromises = updateSocialData?.map(async (item) => {
            await userService.updateSocialInfo(item?.documentId, { account_url: item.account_url });
        });

        const addSocialDataPromises = socialDataToAdd?.map(async (item) => {
            const data = {
                account_url: item.account_url,
                social_id: item.platform?.documentId,
                user_id: userId
            }
            await userService.addSocialInfo(data);
        });

        const deleteSocialDataPromises = socialDataToRemove?.map(async (item) => {
            await userService.deleteSocialInfo(item?.documentId);
        });

        await Promise.all(updateSocialDataPromises);
        await Promise.all(addSocialDataPromises);
        await Promise.all(deleteSocialDataPromises);

        return {
            success: true,
            message: 'Social info updated successfully'
        };

    },
        {
            onSuccess: () => {
                notifySuccess(intl.formatMessage({ id: 'profile.manage_account.update_info_success' }));
                queryClient.invalidateQueries(['user-profile']);
            },
            onError: (error) => {
                console.error("Error updating project:", error);
                notifyError(intl.formatMessage({ id: 'profile.manage_account.update_info_error' }));
                // throw error;
            }
        }
    )
}

export const useUpdateUserBanner = () => {
    const intl = useIntl();

    return useMutation(async ({ userId, bannerId }) => {
        const userDetails = await userService.updateUserBanner(userId, bannerId);
        return userDetails;
    },
        {
            onSuccess: (userDetails) => {
                return userDetails;
            },
            onError: (error) => {
                console.error("Error updating project:", error);
                throw error;
            }
        }
    )
}

export const useUpdateUserAvatar = () => {

    return useMutation(async ({ userId, avatarId }) => {
        const userDetails = await userService.updateUserAvatar(userId, avatarId);

        return userDetails;
    },
        {
            onSuccess: (userDetails) => {
                return userDetails;
            },
            onError: (error) => {
                console.error("Error updating avatar:", error);
                throw error;
            }
        });
}

export const useUpdateUserInfoBasic = () => {

    return useMutation(async ({ userId, dataSubmit }) => {
        const userDetails = await userService.updateUserInfo(userId, dataSubmit);
        return userDetails;
    },
        {
            onSuccess: (userDetails) => {
                return userDetails;
            },
            onError: (error) => {
                console.error("Error updating user info:", error);
                // throw error;
            }
        }
    )
}
