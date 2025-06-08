import { useMutation, useQueryClient } from 'react-query';
import systemService from '@/services/api/systemService';
import { notifyError, notifySuccess } from '@/utils/Utils';
import { useIntl } from 'react-intl';
import { useUserData } from '@/utils/hooks/useAuth';
import { uploadImage } from '@/helpers/imgHelper';

// Mock function to create an event
const createEventApi = async (data) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // In a real API, this would send data to the server
    console.log('Creating event:', data);

    // Return a mock response
    return {
        success: true,
        data: {
            documentId: Math.random().toString(36).substring(2, 15),
            ...data,
            banner_url: data.banner_id ? `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}` : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    };
};

// Mock function to update an event
const updateEventApi = async ({ id, data }) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 600));

    // In a real API, this would send data to the server
    console.log('Updating event:', id, data);

    // Return a mock response
    return {
        success: true,
        data: {
            documentId: id,
            ...data,
            banner_url: data.banner_id ? `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}` : null,
            updatedAt: new Date().toISOString()
        }
    };
};

// Mock function to delete an event
const deleteEventApi = async (id) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real API, this would send a delete request to the server
    console.log('Deleting event:', id);

    // Return a mock response
    return {
        success: true
    };
};

// Mock function to upload a banner image
const uploadBannerApi = async (file) => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real API, this would upload the file to the server
    console.log('Uploading banner:', file);

    // Return a mock response with a random ID and URL
    const fileId = Math.random().toString(36).substring(2, 15);

    return {
        success: true,
        data: {
            documentId: fileId,
            url: `https://picsum.photos/800/400?random=${Math.floor(Math.random() * 100)}`,
            filename: file.name,
            mime_type: file.type,
            size: file.size
        }
    };
};

// Hook to create a new event
export const useCreateEvent = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const { userData } = useUserData();

    return useMutation(async (data) => {
        console.log('data event:', data);
        try {
            const dataSubmit = {
                name: data?.name || '',
                description: data?.description || '',
                location: data?.location || '',
                start_date: data.date[0].format('YYYY-MM-DD'),
                due_date: data.date[1].format('YYYY-MM-DD'),
                status: data?.status || 'upcoming',
                event_created_by: userData?.documentId || ''
            };

            if (data?.banner?.originFileObj)
                try {
                    const bannerFile = await uploadImage(data?.banner?.originFileObj);
                    if (bannerFile && bannerFile?.data?.documentId) {
                        dataSubmit.banner_id = bannerFile.data.documentId;
                    }
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    notifyError('Không thể tải lên ảnh bìa. Vui lòng thử lại.');
                    setUploading(false);
                    return;
                }

            const eventResponse = await systemService.createEvent(dataSubmit);
            return eventResponse.data;
        } catch (error) {
            console.error("Error in event creation process:", error);
            throw error;
        }
    }, {
        onSuccess: async () => {
            notifySuccess(intl.formatMessage({ id: 'admin.dashboard.event.create_success' }));
            // Invalidate and refetch immediately
            await queryClient.invalidateQueries(['admin-query-events']);
            await queryClient.invalidateQueries(['admin-query-eventStats']);
        },
        onError: (error) => {
            console.error("Error creating event:", error);
            notifyError(intl.formatMessage({ id: 'admin.dashboard.event.create_failed' }));
        }
    });
};

// Hook to update an existing event
export const useUpdateEvent = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();

    return useMutation(async ({ documentId, data }) => {
        try {
            const dataSubmit = {
                documentId,
                ...data
            };

            if (data?.banner?.originFileObj)
                try {
                    const bannerFile = await uploadImage(data?.banner?.originFileObj);
                    if (bannerFile && bannerFile?.data?.documentId) {
                        dataSubmit.banner_id = bannerFile.data.documentId;
                    }
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    notifyError('Không thể tải lên ảnh bìa. Vui lòng thử lại.');
                    setUploading(false);
                    return;
                }

            const response = await systemService.updateEvent({ documentId, data: dataSubmit });
            return response.data;
        } catch (error) {
            console.error("Error updating event:", error);
            throw error;
        }
    }, {
        onSuccess: async () => {
            notifySuccess(intl.formatMessage({ id: 'admin.dashboard.event.update_success' }));
            await queryClient.invalidateQueries(['admin-query-events']);
        },
        onError: (error) => {
            console.error("Error updating event:", error);
            notifyError(intl.formatMessage({ id: 'admin.dashboard.event.update_failed' }));
        }
    });
};

// Hook to delete an event
export const useDeleteEvent = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();

    return useMutation(async ({ documentId }) => {
        await systemService.deleteEvent({ documentId });
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.dashboard.event.delete_success' }));
            queryClient.invalidateQueries(['admin-query-events']);
        },
        onError: (error) => {
            console.error("Error deleting event:", error);
            notifyError(intl.formatMessage({ id: 'admin.dashboard.event.delete_failed' }));
        }
    });
};

// Hook to restore a deleted event
export const useRestoreEvent = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();

    return useMutation(async ({ documentId }) => {
        await systemService.restoreEvent({ documentId });
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.dashboard.event.restore_success' }));
            queryClient.invalidateQueries(['admin-query-events']);
        },
        onError: (error) => {
            console.error("Error restoring event:", error);
            notifyError(intl.formatMessage({ id: 'admin.dashboard.event.restore_failed' }));
        }
    });
};

// Hook to permanently delete an event
export const usePermanentDeleteEvent = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();

    return useMutation(async ({ documentId }) => {
        await systemService.permanentDeleteEvent({ documentId });
    }, {
        onSuccess: () => {
            notifySuccess(intl.formatMessage({ id: 'admin.dashboard.event.permanent_delete_success' }));
            queryClient.invalidateQueries(['admin-query-events']);
        },
        onError: (error) => {
            console.error("Error permanently deleting event:", error);
            notifyError(intl.formatMessage({ id: 'admin.dashboard.event.permanent_delete_failed' }));
        }
    });
};

// Hook to upload a banner image
export const useUploadBanner = () => {
    const intl = useIntl();

    return useMutation(async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await systemService.uploadFile(formData);
            return response.data;
        } catch (error) {
            console.error("Error uploading banner:", error);
            throw error;
        }
    }, {
        onError: (error) => {
            console.error("Error uploading banner:", error);
            notifyError(intl.formatMessage({ id: 'admin.dashboard.event.upload_failed' }));
        }
    });
};
