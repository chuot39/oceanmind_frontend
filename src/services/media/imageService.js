import apiClient from "../../utils/api";
import { API_BASE_URL } from "../../constants";

// URL cơ sở của Strapi khi chạy local
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

const imageService = {

    uploadToMediaLibrary: async (file) => {
        try {
            const formData = new FormData();
            formData.append('files', file);

            const response = await apiClient.post(`${API_BASE_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            // Strapi returns an array of uploaded files
            return response.data[0];
        } catch (error) {
            console.error("Error uploading file to Media Library:", error);
            throw error;
        }
    },

    uploadToCloudinary: async (file, folder = "default") => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', folder);

        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.secure_url) {
                return {
                    url: data.secure_url,
                    public_id: data.public_id,
                    mime: data.resource_type + "/" + data.format,
                    size: data.bytes
                };
            } else {
                throw new Error(data.error?.message || "Upload failed");
            }
        } catch (error) {
            console.error("Error uploading file to Cloudinary:", error);
        }
    },

    createMediaFileRecord: async (fileData) => {
        try {
            // Ensure file_path is a full URL
            if (fileData.file_path && !fileData.file_path.startsWith('http')) {
                fileData.file_path = `${STRAPI_BASE_URL}${fileData.file_path}`;
            }

            const response = await apiClient.post(`${API_BASE_URL}/media-files`, {
                data: fileData
            });
            return response.data;
        } catch (error) {
            console.error("Error creating media file record:", error);
            throw error;
        }
    },

    createPostMediaRelation: async (postId, mediaFileId) => {
        try {
            const response = await apiClient.post(`${API_BASE_URL}/post-medias/posts/${postId}/bulk`, {
                data: {
                    mediaIds: mediaFileId
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error creating post-media relation:", error);
            throw error;
        }
    }
};

export default imageService;
