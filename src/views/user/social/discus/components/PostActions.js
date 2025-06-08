import React, { useState, useEffect } from 'react';
import { Alert, Button, Dropdown, message, Modal, Spin } from 'antd';
import { BsThreeDots } from 'react-icons/bs';
import { useMarkPost, useCheckPostMarked } from '../mutationHooks';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useDeletePost } from '../mutationHooks';
import BookMark from '@/components/button/action/BookMark';
import { FaRegEdit } from 'react-icons/fa';
import Delete from '@/components/button/action/Delete';
import { GoReport } from "react-icons/go";
import Loading from '@/components/loader/Loading';
import ReportModal from '@/views/user/components/ReportModal';
import { notifyError, notifySuccess } from '@/utils/Utils';
import { useUserData } from '@/utils/hooks/useAuth';

const PostActions = ({ post, intl, onEditPost, group }) => {

    const { userData } = useUserData();
    const { confirm } = Modal;
    const markPostMutation = useMarkPost();
    const deletePostMutation = useDeletePost();
    const checkPostMarkedMutation = useCheckPostMarked();

    const [isMarked, setIsMarked] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [reportModalVisible, setReportModalVisible] = useState(false);


    // Check if current user is the post creator
    const isPostCreator = post?.author?.documentId === userData?.documentId;

    // Check if the post is already marked when component mounts
    useEffect(() => {
        const checkIfMarked = async () => {
            if (post?.documentId && userData?.documentId) {
                try {
                    const result = await checkPostMarkedMutation.mutateAsync({
                        postId: post.documentId,
                        userId: userData?.documentId
                    });
                    setIsMarked(result?.data?.marked === true);
                } catch (error) {
                    console.error('Error checking if post is marked:', error);
                }
            }
        };

        checkIfMarked();
    }, [post, userData]);

    const handleDropdownVisibleChange = (visible) => {
        setDropdownOpen(visible);
    };

    const handleBookmarkChange = (e) => {
        // Prevent the event from bubbling up and closing the dropdown
        e && e.stopPropagation();
        // Trigger the mark action when the bookmark checkbox is changed
        handlePostAction({ key: 'mark' }, e);
    };

    const postActions = [
        {
            key: 'mark',
            label: (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {markPostMutation.isLoading ? <Loading /> :
                        <BookMark
                            checked={isMarked}
                            onChange={handleBookmarkChange}
                        />}
                    <span className='!cursor-default'>
                        {isMarked
                            ? intl.formatMessage({ id: 'social.post.unmark_post', defaultMessage: 'Unmark post' })
                            : intl.formatMessage({ id: 'social.post.mark_post', defaultMessage: 'Mark post' })
                        }
                    </span>
                </div>
            )
        },
        // Only show edit and delete options if the user is the post creator
        ...(isPostCreator ? [
            {
                key: 'edit',
                label: (
                    <div className='flex items-center gap-2' onClick={() => onEditPost(post)}>
                        <FaRegEdit className='text-blue-300 hover:text-blue-100 text-lg' />
                        {intl.formatMessage({ id: 'social.post.edit', defaultMessage: 'Edit post' })}
                    </div>
                )
            },
            {
                key: 'delete',
                danger: true,
                label: (
                    <div className='flex items-center text-red-300 hover:text-red-100 gap-2' onClick={(e) => showDeleteConfirm(e)}>
                        <Delete />
                        {intl.formatMessage({ id: 'social.post.delete', defaultMessage: 'Delete post' })}
                    </div>
                )
            }
        ] : []),
        {
            key: 'report',
            label: (
                <div className='flex items-center gap-2' onClick={() => handleOpenReportModal()}>
                    <GoReport className='text-orange-300 hover:text-orange-100 text-lg' />
                    {intl.formatMessage({ id: 'social.post.report', defaultMessage: 'Report post' })}
                </div>
            )
        },
    ];

    const showDeleteConfirm = (e) => {
        // Prevent the event from bubbling up and closing the dropdown
        e && e.stopPropagation();

        confirm({
            title: intl.formatMessage({
                id: 'social.post.delete_confirm_title',
                defaultMessage: 'Are you sure you want to delete this post?'
            }),
            icon: <ExclamationCircleOutlined />,
            content: intl.formatMessage({
                id: 'social.post.delete_confirm_content',
                defaultMessage: 'This action cannot be undone.'
            }),
            okText: intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' }),
            okType: 'danger',
            cancelText: intl.formatMessage({ id: 'common.no', defaultMessage: 'No' }),
            onOk: async () => {
                try {
                    await deletePostMutation.mutateAsync({ postId: post.documentId, group: group });
                    notifySuccess(intl.formatMessage({
                        id: 'social.post.delete_success',
                        defaultMessage: 'Post deleted successfully'
                    }));
                    // Close dropdown after successful deletion
                    setDropdownOpen(false);
                } catch (error) {
                    console.error('Error deleting post:', error);
                    notifyError(intl.formatMessage({
                        id: 'social.post.delete_error',
                        defaultMessage: 'Failed to delete post'
                    }));
                }
            }
        });
    };

    const handleOpenReportModal = () => {
        setReportModalVisible(true);
        setDropdownOpen(false);
    };

    const handleCloseReportModal = () => {
        setReportModalVisible(false);
    };

    const handlePostAction = async ({ key }, e) => {
        if (key === 'mark') {
            // Nếu đang xử lý, không cho phép click lại
            if (isProcessing) return;

            try {
                setIsProcessing(true);
                console.log('post', post);
                console.log('userData', userData);

                const result = await markPostMutation.mutateAsync({ postId: post.documentId, userId: userData?.documentId });

                // Update local state after successful mutation
                setIsMarked(result.isBookmarked);

                message.destroy(); // Xóa tất cả thông báo hiện tại

            } catch (error) {
                console.error('Error bookmarking post:', error);
                message.destroy();
                notifyError(intl.formatMessage({
                    id: 'social.post.bookmark_error',
                    defaultMessage: 'Failed to bookmark post'
                }));
            } finally {
                setIsProcessing(false);
            }
        } else if (key === 'edit') {
            if (onEditPost) {
                onEditPost(post);
                setDropdownOpen(false);
            } else {
                message.info(intl.formatMessage({
                    id: 'social.post.edit_info',
                    defaultMessage: 'Edit functionality coming soon'
                }));
            }
        } else if (key === 'delete') {
            showDeleteConfirm(e);
        } else if (key === 'report') {
            // Handle report action
            handleOpenReportModal();
        }
    };

    return (
        <>
            <Dropdown
                menu={{
                    items: postActions,
                    onClick: handlePostAction
                }}
                placement="bottomRight"
                trigger={["click"]}
                open={dropdownOpen}
                onOpenChange={handleDropdownVisibleChange}
                destroyPopupOnHide={false}
            >
                <Button type="text" icon={<BsThreeDots />} />
            </Dropdown>

            {/* Report Modal */}
            <ReportModal
                visible={reportModalVisible}
                onClose={handleCloseReportModal}
                objReport={post}
                userData={userData}
                intl={intl}
                reportType='post'
                title={intl.formatMessage({ id: 'support.report.post', defaultMessage: 'Report post' })}
            />
        </>
    );
};

export default PostActions; 