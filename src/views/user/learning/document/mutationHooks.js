import studyService from "@/services/api/studyService";
import imageService from "@/services/media/imageService";
import { useUserData } from "@/utils/hooks/useAuth";

import { notifyError, notifySuccess } from "@/utils/Utils";
import { useIntl } from "react-intl";
import { useMutation, useQueryClient } from "react-query";
import { useGetMediaDocumentPublic } from "./hook";


export const useResolveDocument = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const { userData } = useUserData();
    const { mutateAsync: getMediaDocumentPublicAsync } = useGetMediaDocumentPublic();

    return useMutation(async ({ data, oldDocument }) => {
        // Chuẩn bị dữ liệu cơ bản
        const dataSubmit = {
            title: data?.title || '',
            description: data?.description || '',
            content: data?.content || '',
            is_global: data?.is_global || false,
            author: userData?.documentId || null,
            link_document: data?.link_document || null,
        };

        const submitTags = data?.tags
        const oldTags = oldDocument?.tags;

        const newTags = submitTags?.filter(tag => !oldTags?.some(t => t?.documentId === tag?.documentId));
        const removedTags = oldTags?.filter(tag => !submitTags?.some(t => t?.documentId === tag?.documentId));

        // Xử lý thumbnail
        try {
            if (data?.file) {
                // Trường hợp có file mới được upload
                const responseThumbnail = await imageService.uploadToCloudinary(data.file, 'document');
                if (responseThumbnail) {
                    const fileData = {
                        file_path: responseThumbnail?.url,
                        file_type: responseThumbnail?.mime,
                        file_size: responseThumbnail?.size,
                    };
                    const responseMediaFile = await imageService.createMediaFileRecord(fileData);
                    dataSubmit.thumbnail = responseMediaFile?.data?.documentId;
                }
            }
            // Nếu không có thumbnail (mới hoặc cũ), sử dụng mặc định
            else if (!oldDocument || data?.oldFile?.length === 0) {
                const defaultMedia = await getMediaDocumentPublicAsync();
                dataSubmit.thumbnail = defaultMedia?.data[0]?.documentId;
            }
        } catch (error) {
            console.error('Error handling thumbnail:', error);
            const defaultMedia = await getMediaDocumentPublicAsync();
            dataSubmit.thumbnail = defaultMedia?.data[0]?.documentId;
        }

        let responseDocumentShare;

        if (oldDocument) {
            // Trường hợp cập nhật document
            responseDocumentShare = await studyService.updateDocument({ documentId: oldDocument?.documentId, data: dataSubmit });

            // Xóa và tạo lại các tags
            await Promise.all(removedTags?.map(tag =>
                studyService.getDocumentTag({
                    documentShareId: oldDocument?.documentId,
                    tagId: tag?.documentId
                }).then(response => {
                    if (response?.data?.length > 0) {
                        studyService.deleteDocumentTag({
                            documentId: response?.data[0]?.documentId
                        })
                    }
                })
            ));

            if (newTags.length > 0) {
                const dataSubmit = {
                    "sourceId": responseDocumentShare?.data?.documentId,
                    "tagIds": newTags?.map(tag => tag?.documentId),
                    "isPost": false
                }
                await studyService.createDocumentTag(dataSubmit);
            }

        } else {
            // Trường hợp tạo mới document
            responseDocumentShare = await studyService.createDocument(dataSubmit);
            if (newTags.length > 0) {
                const dataSubmit = {
                    "sourceId": responseDocumentShare?.data?.documentId,
                    "tagIds": newTags?.map(tag => tag?.documentId),
                    "isPost": false
                }
                await studyService.createDocumentTag(dataSubmit);
            }

        }

        return responseDocumentShare;
    }, {
        onSuccess: (_, variables) => {
            notifySuccess(
                intl.formatMessage({
                    id: variables.oldDocument
                        ? 'learning.document.document_updated_success'
                        : 'learning.document.document_created_success'
                })
            );
            queryClient.invalidateQueries(['query-document', userData?.documentId]);
            queryClient.invalidateQueries(['query-mark-document', userData?.username]);
        },
        onError: (error) => {
            console.error("Error handling document:", error);
            notifyError(
                intl.formatMessage({
                    id: 'learning.document.document_created_failed'
                })
            );
            // throw error;
        }
    });
}

export const useDeleteDocument = () => {
    const intl = useIntl();
    const queryClient = useQueryClient();
    const { userData } = useUserData();

    return useMutation(async ({ documentId }) => {
        await studyService.deleteDocument({ documentId });
    }, {
        onSuccess: () => {
            notifySuccess(
                intl.formatMessage({
                    id: 'learning.document.document_deleted_success'
                })
            );
            queryClient.invalidateQueries(['query-document', userData?.documentId]);
            queryClient.invalidateQueries(['query-mark-document', userData?.username]);
        },
        onError: (error) => {
            console.error("Error handling document:", error);
            notifyError(
                intl.formatMessage({
                    id: 'learning.document.document_deleted_failed'
                })
            );
        }
    });
}
