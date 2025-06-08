import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Avatar, Tag, Input, Button, List, Divider, Image, Drawer, message, Tooltip } from 'antd';
import { BsBookmark, BsShare, BsLink, BsPencil, BsTrash } from 'react-icons/bs';
import { formatDate } from '../../../../../utils/format/datetime';
import useSkin from '../../../../../utils/hooks/useSkin';
import { getTagColor } from '../../../../../utils/format/formartText';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUserData } from '../../../../../utils/hooks/useAuth';
import DocumentForm from './DocumentForm';
import BtnTrashSquare from '@/components/button/action/BtnTrashSquare';
import BtnEdit from '@/components/button/action/BtnEdit';
import ModalConfirm from '@/views/user/components/ModalConfirm';
import { useDeleteDocument } from '../mutationHooks';
import SharePostPopover from '@/views/user/social/discus/components/SharePostPopover';
import BookMark from '@/components/button/action/BookMark';
import { useCheckDocumentMarked, useMarkDocument, useMarkPost } from '@/views/user/social/shared/actions/mutationHooks';

const { TabPane } = Tabs;
const { TextArea } = Input;

const DocumentDetailModal = ({ visible, document, onClose, refetchDocuments }) => {
    const intl = useIntl();
    const { language } = useSkin();
    const { userData } = useUserData();
    const [editDrawerVisible, setEditDrawerVisible] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const isAuthor = userData?.username === document?.creator?.username;

    const { mutateAsync: deleteDocumentAsync, isLoading: deleteDocumentLoading } = useDeleteDocument();
    const { mutateAsync: markDocumentAsync, isLoading: markDocumentLoading } = useMarkDocument();
    const { mutateAsync: checkDocumentMarkedAsync, isLoading: checkDocumentMarkedLoading } = useCheckDocumentMarked();


    // Kiểm tra trạng thái bookmark
    useEffect(() => {
        if (visible && document) {
            checkDocumentMarkedAsync({ documentId: document?.documentId, userId: userData?.documentId }, {
                onSuccess: (result) => {
                    console.log('result', result)
                    setIsBookmarked(result?.data?.marked);
                },
                onError: (error) => {
                    console.error("Error checking document marked:", error);
                }
            });
        }
    }, [document, visible]);

    const handleEdit = () => {
        setEditDrawerVisible(true);
    };

    const handleDelete = () => {
        return ModalConfirm({
            typeModal: 'delete_document',
            loading: deleteDocumentLoading,
            handleResolve: async () => {
                await deleteDocumentAsync({ documentId: document?.documentId },
                    {
                        onSuccess: () => {
                            onClose();
                            refetchDocuments();
                        },
                        onError: (error) => {
                            console.error("Error deleting document:", error);
                        }
                    }
                );
            },
            intl: intl
        });
    };

    const handleBookmark = () => {
        // Ngăn xử lý nhiều lần
        if (isProcessing || markDocumentLoading) return;

        setIsProcessing(true);

        // Cập nhật UI trước để phản hồi người dùng ngay lập tức
        setIsBookmarked(prev => !prev);

        markDocumentAsync({ documentShareId: document?.documentId }, {
            onSuccess: (result) => {
                // Cập nhật trạng thái bookmark theo kết quả từ API
                setIsBookmarked(result.isBookmarked);
                refetchDocuments();
                setIsProcessing(false);
            },
            onError: (error) => {
                // Khôi phục trạng thái bookmark khi có lỗi
                setIsBookmarked(prev => !prev);
                console.error("Error marking document:", error);
                setIsProcessing(false);
            }
        });
    }

    if (!document) return null;

    return (
        <>
            <Modal
                title={document.title}
                open={visible}
                onCancel={onClose}
                width={800}
                footer={null}
                className="document-detail-modal"
            >

                <>
                    <div className="document-info mb-6">
                        <div className="flex items-start gap-4 mb-4">
                            <img
                                src={document?.thumbnailImage?.file_path}
                                alt={document?.title}
                                className="w-48 h-48 object-fill rounded-lg"
                                preview={false}
                            />
                            <div className="flex-1">
                                <div className="flex flex-wrap gap-2 mb-3 ">
                                    {document?.tags?.map((tag, index) => (
                                        <Tag key={index} className={`${getTagColor(tag?.name_en)}`}>
                                            {language === 'vi' ? tag?.name_vi : tag?.name_en}
                                        </Tag>
                                    ))}
                                </div>
                                <h2 className="text_first text-xl font-bold mb-2">{document?.title}</h2>
                                <p className="text_secondary mb-4">{document?.description}</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar src={document?.creator?.avatar?.file_path} />
                                        <span className="text_secondary">by {document?.creator?.fullname}</span>
                                    </div>
                                    <span className="text-gray-500">{formatDate(document?.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end items-center gap-2">
                            <Button className="btn_custom_accept" icon={<BsLink />} onClick={() => window.open(document?.link_document, '_blank')}>
                                <FormattedMessage id="learning.document.access_link" />
                            </Button>

                            <Tooltip title={intl.formatMessage({ id: 'learning.document.share' })}>
                                <SharePostPopover
                                    type="document"
                                    objShare={document}
                                    intl={intl}
                                    titleId="learning.document.share_document"
                                    titleDefault="Share Document"
                                    defaultTitle={document?.title || "Check out this document"}
                                >
                                    <Button className="btn_custom_accept" icon={<BsShare />}></Button>
                                </SharePostPopover>
                            </Tooltip>

                            <Tooltip title={intl.formatMessage({ id: 'common.bookmark' })}>
                                <Button onClick={handleBookmark} className="btn_custom_accept" icon={<BookMark checked={isBookmarked} />}></Button>
                            </Tooltip>

                            {isAuthor && (
                                <div className='flex items-center gap-2'>

                                    <div className='cursor-pointer' onClick={handleEdit}>
                                        <BtnEdit className='!w-10 !h-10' />
                                    </div>
                                    <div className='cursor-pointer' onClick={handleDelete}>
                                        <BtnTrashSquare className='!w-10 !h-10' />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Divider />

                    <div className="document-content mb-6">
                        <h3 className="text-lg text_first font-semibold mb-3"><FormattedMessage id="learning.document.content" /></h3>
                        <div className='text_secondary'>{document?.content}</div>
                    </div>
                </>


            </Modal>

            {/* Edit Document Form */}
            <DocumentForm
                visible={editDrawerVisible}
                onClose={() => setEditDrawerVisible(false)}
                loading={false} // Set to true when submitting to API
                initialValues={document}
                onCloseDetailModel={onClose}
                refetchDocuments={refetchDocuments}

            />
        </>
    );
};

export default DocumentDetailModal; 