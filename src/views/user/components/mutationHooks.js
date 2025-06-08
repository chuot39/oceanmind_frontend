import { notifyError, notifySuccess } from "@/utils/Utils";
import { useMutation } from "react-query";
import systemService from "@/services/api/systemService";

export const useCreateNotification = () => {
    return useMutation(
        async ({ title, content, link, is_global = false, notice_type_label, notification_created_by }) => {
            const dataSubmit = {
                title,
                content,
                link,
                is_global,
                notice_type_label,
                notification_created_by
            }
            try {
                const response = await systemService.createNotification(dataSubmit);
                console.log('Raw API Response:', response);

                // Return the response data directly
                if (response?.data) {
                    return response.data;
                }
                return response;
            } catch (error) {
                console.error('API Error:', error);
                throw error;
            }
        }
    );
};

export const useCreateUserNotification = () => {
    return useMutation(
        async ({ user_id, notification_id }) => {
            try {
                const response = await systemService.createUserNotification(user_id, notification_id);
                console.log('Raw User Notification Response:', response);

                // Return the response data directly
                if (response?.data) {
                    return response.data;
                }
                return response;
            } catch (error) {
                console.error('User Notification API Error:', error);
                throw error;
            }
        }
    );
};
