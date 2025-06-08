import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Avatar, Input, Divider, Image, Button, message, Tooltip, Spin } from 'antd';
import { BsFillSendFill, BsReply } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { getRelativeTime } from '../../../../../utils';
import TextArea from 'antd/es/input/TextArea';
import { useAddComment } from '../actions/mutationHooks';
import { useQueryClient } from 'react-query';

/**
 * Component CommentsModal dùng chung cho cả discus và group
 */
const CommentsModal = ({ post, visible, userData, skin, intl, onClose, onCommentAdded, replyingTo, setReplyingTo, group = null }) => {

    const { mutate: addComment, isLoading: submitting } = useAddComment({ type: 'group' });

    const [commentText, setCommentText] = useState('');
    const commentInputRef = useRef(null);
    const commentsContainerRef = useRef(null);

    // Sắp xếp comments từ mới nhất đến cũ nhất và phân loại cha-con
    const organizedComments = useMemo(() => {
        if (!post?.comments) return [];

        // Lọc ra các comment cha (không có parent_id)
        const parentComments = post?.comments.filter(comment => !comment?.parent?.documentId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Tạo map các comment con theo parent_id
        const childCommentsMap = {};
        post.comments
            .filter(comment => comment.parent?.documentId)
            .forEach(comment => {
                const parentId = comment.parent?.documentId;
                if (!childCommentsMap[parentId]) {
                    childCommentsMap[parentId] = [];
                }
                childCommentsMap[parentId].push(comment);
            });

        // Sắp xếp các comment con theo thời gian
        Object.keys(childCommentsMap).forEach(parentId => {
            childCommentsMap[parentId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });

        return { parentComments, childCommentsMap };
    }, [post?.comments]);


    // Handle replying to a comment
    const handleReplyToComment = (comment) => {
        setReplyingTo && setReplyingTo(comment);
        if (commentInputRef.current) {
            commentInputRef.current.focus();
        }
    };

    // Handle key press in comment input CTRL + ENTER
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    // Handle adding a comment
    const handleAddComment = async () => {
        if (!commentText.trim() || submitting) return;

        try {

            const commentData = {
                postId: post?.documentId,
                userId: userData?.documentId,
                content: commentText,
                parentCommentId: replyingTo?.documentId || null,
                groupId: group?.documentId || null
            };

            addComment(commentData, {
                onSuccess: (result) => {
                    setCommentText('');
                    setReplyingTo && setReplyingTo(null);

                    // Create a new comment object
                    const newComment = {
                        ...result.data,
                        documentId: result.data.documentId,
                        user: {
                            documentId: userData?.documentId,
                            fullname: userData?.fullname || 'Unknown User',
                            username: userData?.username || '',
                            avatar: userData?.avatar || null
                        },
                        parent: replyingTo?.documentId ? { documentId: replyingTo.documentId } : null,
                        createdAt: new Date().toISOString()
                    };

                    // Create a new post object with the new comment
                    const updatedPostWithNewComment = {
                        ...post,
                        comments: post.comments ? [newComment, ...post.comments] : [newComment],
                        postComments: {
                            data: post.comments ? [newComment, ...post.comments] : [newComment]
                        }
                    };

                    // Update the selected post for the modal
                    if (onCommentAdded) {
                        onCommentAdded(updatedPostWithNewComment);
                    }
                },
                onError: (error) => {
                    console.error('Error adding comment:', error);
                }
            });
        } catch (error) {
            console.error('Error in comment submission:', error);
        }
    };

    // Đặt vị trí scroll ở trên cùng khi mới mở modal
    useEffect(() => {
        if (visible && commentsContainerRef.current) {
            commentsContainerRef.current.scrollTop = 0;
        }
    }, [visible]);

    // Focus on comment input when replying to a comment
    useEffect(() => {
        if (replyingTo && commentInputRef.current) {
            commentInputRef.current.focus();
        }
    }, [replyingTo]);

    // Set initial reply if provided
    useEffect(() => {
        if (replyingTo && visible) {
            handleReplyToComment(replyingTo);
        }
    }, [replyingTo, visible]);



    return (
        <Modal
            open={visible}
            onCancel={() => {
                onClose();
                setReplyingTo && setReplyingTo(null);
                setCommentText('');
            }}
            footer={null}
            width={1000}
            className="comments_modal"
            centered
        >
            <div className="flex flex-row h-full">

                <div className="w-[70%] pe-4 h-full">
                    <div className="flex items-start gap-3 mb-2">
                        <Avatar
                            src={post?.author?.avatar?.file_path || post?.author?.avatar?.file_path}
                            size={40}
                            className="rounded-full"
                        />
                        <div>
                            <h5 className="text-base font-medium">{post?.author?.fullname || post?.author?.fullname}</h5>
                            <p className="text-sm text-primary">{getRelativeTime(post?.createdAt)}</p>
                        </div>
                    </div>
                    <Divider className='mb-2 mt-0' />
                    <div className="col-span-12 md:col-span-7 lg:col-span-8 overflow-y-auto h-[90%] details_modal_post_image">
                        <Image.PreviewGroup>

                            <div className="text-base mb-2 text-justify text_secondary">
                                {post?.content}
                            </div>

                            <Divider className="mb-2" />

                            <div className={`grid gap-2 overflow-y-auto ${post?.media?.length === 1 ? 'grid-cols-1' :
                                post?.media?.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
                                }`}>
                                {post?.media?.map((media, index) => (
                                    <Image
                                        key={index}
                                        src={media?.file_path}
                                        alt={`post-${index}`}
                                        className="w-full object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        </Image.PreviewGroup>
                    </div>
                </div>

                {/* Right side - Comments (Full width if no images) */}
                <div className="w-[30%] h-full">


                    {/* Comments Section */}
                    <div
                        ref={commentsContainerRef}
                        className="space-y-4 h-[82%] mt-[18%] overflow-y-auto details_modal_comments pb-8"
                    >
                        {organizedComments.parentComments?.length > 0 ? (
                            organizedComments.parentComments.map((parentComment) => (
                                <div key={parentComment?.documentId} className="mb-4">
                                    {/* Parent comment */}
                                    <div className="flex gap-3">
                                        <Avatar
                                            src={parentComment?.user?.avatar?.file_path}
                                            size={35}
                                            className="rounded-full"
                                        />
                                        <div className="flex-1 w-4/5">
                                            <h6 className="font-medium">{parentComment?.user?.fullname}</h6>
                                            <p className="text-sm text_secondary pe-6">
                                                {parentComment?.content}
                                            </p>
                                            <div className="flex gap-4 mt-1 text-sm">
                                                <button
                                                    className="flex items-center gap-1 text_action"
                                                    onClick={() => handleReplyToComment(parentComment)}
                                                >
                                                    <BsReply />
                                                    <FormattedMessage id="social.post.reply" />
                                                </button>
                                                <span className="text_act">
                                                    {getRelativeTime(parentComment?.createdAt)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Child comments (replies) */}
                                    {organizedComments.childCommentsMap[parentComment.documentId]?.length > 0 && (
                                        <div className="mt-3 space-y-3 pl-10 border-l-2 border-gray-200 dark:border-gray-700">
                                            {organizedComments.childCommentsMap[parentComment.documentId].map(childComment => (
                                                <div key={childComment.documentId} className="flex gap-2">
                                                    <Avatar
                                                        src={childComment.user?.avatar?.file_path}
                                                        size={30}
                                                        className="rounded-full"
                                                    />
                                                    <div className="flex-1 w-4/5">
                                                        <h6 className="font-medium text-sm">{childComment.user?.fullname}</h6>
                                                        <p className="text-sm text-justify text_secondary pe-6">
                                                            {childComment.content}
                                                        </p>
                                                        <div className="flex gap-4 mt-1 text-xs">
                                                            {/* <button
                                                                className={`flex items-center gap-1 ${skin === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}
                                                                onClick={() => handleReplyToComment(parentComment)}
                                                            >
                                                                <BsReply />
                                                                <FormattedMessage id="social.post.reply" />
                                                            </button> */}
                                                            <span className={`${skin === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {getRelativeTime(childComment?.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-4 text_secondary">
                                <FormattedMessage id="social.post.no_comments" />
                            </div>
                        )}
                    </div>

                    {/* Comment Input */}
                    <div className="mt-4 sticky bottom-2 mb-3 bg-inherit">
                        <Divider className="mb-2" />

                        {/* Replying to indicator */}
                        {replyingTo && (
                            <div className="mb-2 flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                <div className="flex items-center gap-2">
                                    <BsReply className="text-blue-500 text-xl" />
                                    <span className="text-sm">
                                        <FormattedMessage id="social.post.replying_to" /> <b>{replyingTo.user?.fullname}</b>
                                    </span>
                                </div>
                                <span
                                    onClick={() => setReplyingTo && setReplyingTo(null)}
                                    className="text_action cursor-pointer pe-1"
                                >
                                    ✕
                                </span>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <Avatar
                                src={userData?.avatar?.file_path}
                                size={35}
                                className="rounded-full"
                            />
                            <div className="flex-1 relative">
                                <TextArea
                                    ref={commentInputRef}
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    autoSize={{ minRows: 2, maxRows: 6 }}
                                    placeholder={
                                        replyingTo
                                            ? intl.formatMessage({ id: 'social.post.write_reply' })
                                            : intl.formatMessage({ id: 'social.post.write_something' })
                                    }
                                    className="details_modal_comment_input pr-8 text-justify"
                                />
                                <Tooltip title="Ctrl + Enter">
                                    <Button
                                        type="text"
                                        onClick={handleAddComment}
                                        className="absolute right-2 bottom-2 px-0 py-1"
                                        disabled={!commentText.trim()}>
                                        {submitting ? <Spin /> : <BsFillSendFill className="text-lg !text-blue-500" />}
                                    </Button>
                                </Tooltip>
                            </div>
                            {/* 
                            <div className="relative flex-1">
                                <TextArea
                                    autoSize={{ minRows: 2, maxRows: 6 }}
                                    placeholder={intl.formatMessage({ id: 'social.post.write_something' })}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="details_modal_comment_input pr-10"
                                />
                                <button
                                    className="absolute right-3 bottom-3 text-blue-400 hover:text-blue-600"
                                    aria-label="Send comment"
                                    onClick={handleSendComment}
                                >
                                    {createCommentMutation.isLoading ? <Spin /> : <BsFillSendFill className="text-lg" />}
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CommentsModal; 