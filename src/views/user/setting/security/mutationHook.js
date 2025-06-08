import userService from "@/services/api/userService";
import { notifyError, notifySuccess } from "@/utils/Utils";
import { useIntl } from "react-intl";
import { useMutation } from "react-query";

export const useUpdateUserSecurity = () => {

    const intl = useIntl();
    return useMutation(async ({ userId, username, email, password, currentPassword }) => {
        const userDetails = await userService.updateUserSecurity(userId, username, email, password, currentPassword);
        return userDetails;
    },
        {
            onSuccess: (userDetails) => {
                // notifySuccess(intl.formatMessage({ id: "profile.manage_account.update_info_success" }));
                return userDetails;
            },
            onError: (error) => {
                console.error("Error updating user security :", error);
                notifyError(error?.response?.data?.errors?.[0] || error?.response?.data?.message);
                // throw error;
            }
        }
    )
}

