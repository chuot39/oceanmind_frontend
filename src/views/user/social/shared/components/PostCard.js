import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Image, Divider, message, Tag } from 'antd';
import { AiOutlineComment } from 'react-icons/ai';
import { FormattedMessage, useIntl } from 'react-intl';
import { getRelativeTime } from '../../../../../utils';
import { FaHeart } from 'react-icons/fa';
import { GlobalOutlined } from '@ant-design/icons';
import { SiPrivateinternetaccess } from 'react-icons/si';
import { useCreatePost, useToggleLikePost, useUpdatePost } from '../actions/mutationHooks';
import { formatDistanceToNow } from 'date-fns';
import PostActions from '../../discus/components/PostActions';
import { enUS, vi } from 'date-fns/locale';
import LikePost from '@/components/button/action/LikePost';
import SharePostPopover from '../../discus/components/SharePostPopover';
import useSkin from '@/utils/hooks/useSkin';
import { useUserData } from '@/utils/hooks/useAuth';
import CommentsModal from './CommentsModal';
import PostFormModal from './PostFormModal';
import { handleNavigateToDetailProfile } from '../actions/actionStore';
import { useNavigate } from 'react-router';
import '@/core/scss/styles/components/ui/postCard.scss';

const PostCard = ({ post, group, onNavigateToDetail, onShowCreateModal, type = 'discus' }) => {

    const intl = useIntl();
    const { skin, language } = useSkin();
    const { userData } = useUserData();
    const navigate = useNavigate();

    // Mutations
    const toggleLikeMutation = useToggleLikePost();
    const createPostMutation = useCreatePost();
    const updatePostMutation = useUpdatePost();

    const [isLiked, setIsLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Show edit post modal
    const [postFormType, setPostFormType] = useState('create'); // 'create' or 'edit'
    const [postToEdit, setPostToEdit] = useState(null);
    const [showPostFormModal, setShowPostFormModal] = useState(false);

    const handleEditPost = (post) => {
        setPostFormType('edit');
        setPostToEdit(post);
        setShowPostFormModal(true);
    };


    useEffect(() => {

        // Check if postLikes exists and has data
        if (post?.likes && Array.isArray(post?.likes)) {
            // Try both possible structures for likes
            const isLikedByUser = post?.likes?.some(like => {

                // Check for different possible structures
                const likeUserId = like?.user_id
                return likeUserId === userData?.documentId;
            });

            setIsLiked(isLikedByUser);
            setLikeCount(post?.likes?.length);
        } else {
            setIsLiked(false);
            setLikeCount(0);
        }
    }, [post, userData]);

    // Add a check if post is valid
    if (!post || !post.documentId) {
        console.error('Invalid post data:', post);
        return null;
    }

    const handleLikePost = async (post) => {
        try {
            setIsLoading(true);

            // Store current state before API call
            const wasLiked = isLiked;

            // Optimistically update UI for better user experience
            setIsLiked(!wasLiked);
            setLikeCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1);

            // Call API with current like state
            const result = await toggleLikeMutation.mutateAsync({
                post,
                userData,
                isCurrentlyLiked: wasLiked // Pass current state to avoid extra GET request
            });


            // If API result is different from our optimistic update, correct the UI
            if (result.isLiked !== !wasLiked) {
                setIsLiked(result.isLiked);
                setLikeCount(prev => {
                    // Calculate the correct count based on the difference between
                    // what we expected and what the server returned
                    if (wasLiked && result.isLiked) {
                        // We thought we unliked, but server says still liked
                        return prev + 1;
                    } else if (!wasLiked && !result.isLiked) {
                        // We thought we liked, but server says still unliked
                        return Math.max(0, prev - 1);
                    }
                    return prev;
                });
            }

        } catch (error) {
            console.error('Error toggling like:', error);

            // Revert optimistic update on error
            setIsLiked(isLiked);
            setLikeCount(prev => isLiked ? prev + 1 : Math.max(0, prev - 1));

            message.error(intl.formatMessage({
                id: 'social.post.like_error',
                defaultMessage: 'Failed to process like action'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleShowComments = (post, parentComment = null) => {
        setSelectedPost(post);
        // setReplyToCommentId(parentComment);
        setReplyingTo(parentComment);
        setShowComments(true);
    };

    const handleCloseComments = () => {
        setSelectedPost(null);
        // setReplyToCommentId(null);
        setReplyingTo(null);
        setShowComments(false);
    };

    const handleCommentAdded = (updatedPost) => {
        setSelectedPost(updatedPost);
    };

    // Handle navigate to group detail
    const handleNavigateToDetail = () => {
        if (onNavigateToDetail && group) {
            onNavigateToDetail(group);
        }
    };

    // Close post form modal
    const handleClosePostFormModal = () => {
        setShowPostFormModal(false);
    };

    // Handle post submission (create or edit)
    const handlePostSubmit = async (formData) => {
        try {
            setIsSubmitting(true);
            const postData = {
                ...formData,
                group_id: group?.documentId
            };
            if (postFormType === 'create') {
                await createPostMutation.mutateAsync(postData);
            } else {
                await updatePostMutation.mutateAsync(postData);
            }
            handleClosePostFormModal();
        } catch (error) {
            console.error(`Error ${postFormType === 'create' ? 'creating' : 'updating'} post:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };
    // If there's no post, show a create post button
    if (!post) {
        return (
            <Card className="mb-4 card_post">
                <div className="flex flex-col items-center justify-center py-6">
                    <h5 className="text-lg font-medium mb-4">
                        {intl.formatMessage({ id: type === 'group' ? 'social.group.no_posts' : 'social.post.no_posts' })}
                    </h5>
                    <Button
                        type="primary"
                        onClick={() => onShowCreateModal && onShowCreateModal()}
                    >
                        {intl.formatMessage({ id: 'social.post.create_post' })}
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        // <Card className={`mb-4 ${type === 'group' ? 'card_group_post' : 'card_discus_post'}`}>
        <>

            <Card className="card_group_post mb-4">

                {/* Post Header */}
                <div className="post-header border-b pb-3 mb-3">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            {type === 'group' && group ? (
                                <div className='relative'>

                                    <Avatar
                                        src={group?.coverImage?.file_path}
                                        size={55}
                                        className="rounded-lg cursor-pointer"
                                        onClick={handleNavigateToDetail}
                                    />
                                    <Avatar
                                        src={post?.author?.avatar?.file_path || post?.author?.avatar?.file_path}
                                        size={30}
                                        className="rounded-full absolute -bottom-1 -right-1 cursor-pointer"
                                        onClick={() => handleNavigateToDetailProfile({ username: post?.author?.username, navigate })}
                                    />
                                </div>
                            ) : (
                                <Avatar
                                    src={post?.author?.avatar?.file_path || post?.author?.avatar?.file_path}
                                    size={40}
                                    className="rounded-full cursor-pointer"
                                    onClick={() => handleNavigateToDetailProfile({ username: post?.author?.username, navigate })}

                                />
                            )}
                            <div className="flex flex-col flex-1 ms-1">
                                {type === 'group' && group ? (
                                    <h5
                                        className="text-base font-medium hover:underline cursor-pointer"
                                        onClick={handleNavigateToDetail}
                                    >
                                        {group?.name}
                                    </h5>
                                ) : (
                                    <h5 className="text-base font-medium hover:underline cursor-pointer"
                                        onClick={() => handleNavigateToDetailProfile({ username: post?.author?.username, navigate })}
                                    >
                                        {post?.author?.fullname || post?.author?.fullname}
                                    </h5>
                                )}

                                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                                    {type === 'group' && (
                                        <span className="hover:underline cursor-pointer"
                                            onClick={() => handleNavigateToDetailProfile({ username: post?.author?.username, navigate })}
                                        >
                                            {post?.author?.fullname || post?.author?.fullname}
                                        </span>

                                    )}
                                    {type === 'group' && <span>•</span>}
                                    <span>
                                        {post?.createdAt ?
                                            formatDistanceToNow(new Date(post?.createdAt), {
                                                addSuffix: true,
                                                locale: language === 'vi' ? vi : enUS
                                            }) :
                                            intl.formatMessage({ id: 'social.post.just_now', defaultMessage: 'Just now' })
                                        }
                                    </span>
                                    <span className="mx-1">•</span>
                                    {(type === 'group' ? group?.isPublic : post?.isPublic) === true ? (
                                        <>
                                            <GlobalOutlined className="text-xs" />                                     </>
                                    ) : (
                                        <>
                                            <SiPrivateinternetaccess className="text-xs" />
                                        </>
                                    )}
                                </div>
                            </div>
                            {/* More Options Button */}
                            <PostActions
                                post={post}
                                intl={intl}
                                userData={userData}
                                onEditPost={handleEditPost}
                                group={group}
                            />
                        </div>
                    </div>
                </div>

                {/* Post Content */}
                <div className="text_secondary whitespace-pre-wrap" >
                    {post?.content && post?.content}
                    <br />
                    <br />
                    <div className="flex gap-1 flex-wrap">
                        {post?.tags?.map((tag) => (
                            <Tag className="tag-primary" key={tag?.documentId}>
                                {language === 'vi' ? tag?.name_vi : tag?.name_en}
                            </Tag>
                        ))}
                    </div>
                </div>


                {/* postMedias */}
                {post?.media?.length > 0 && (

                    <Image.PreviewGroup>
                        <br />
                        <div
                            className={`grid gap-2 list_image_post ${post?.media?.length <= 2 ? "grid-cols-2"
                                : post?.media?.length === 5 ? "grid-cols-3" : "grid-cols-3"}`}
                        >

                            {post?.media?.map((media, index) => {

                                if (index >= 6) {
                                    return (
                                        <Image
                                            key={index}
                                            src={media?.file_path}
                                            alt={`post-${index}`}
                                            className="hidden"
                                        />
                                    );
                                }
                                const isLastVisible = index === 5 && post?.media?.length > 6;
                                return (
                                    <div key={index} className="relative">
                                        <Image
                                            // src={media?.file_path.startsWith('http') ? media?.file_path : `${import.meta.env.VITE_STRAPI_URL}${media?.file_path}`}
                                            src={media?.file_path}
                                            alt={`post-${index}`}
                                            className={`w-full cursor-pointer  
                                            ${post?.media?.length === 1 ? "h-[400px]" : post?.media?.length === 2 ? "!max-h-[400px]" : "!max-h-[350px]"} object-cover rounded-lg
                                            ${index === 5 ? "opacity-50 relative z-10 " : ""} 
                                             `}
                                        />

                                        {isLastVisible && (
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                                <span className="text-white text-2xl font-bold z-20">
                                                    +{post?.media?.length - 6}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Image.PreviewGroup>

                )}

                {/* Post Stats */}
                <div className="flex items-center justify-between py-2 border-b post_stats">
                    <div className="flex items-center gap-1">
                        <FaHeart className="text-red-500" />
                        <span className="text-sm">
                            {likeCount || 0}{" "}
                            <FormattedMessage id="social.post.likes" />
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm ">
                            {post?.comments?.length || 0}{" "}
                            <FormattedMessage id="social.post.comments" />
                        </span>
                        <span className="text-sm ">
                            {post?.shares?.length || 0}{" "}
                            <FormattedMessage id="social.post.shares" />
                        </span>
                    </div>
                </div>


                {/* Post Actions */}
                <div className="flex justify-between items-center post_actions">
                    <Button
                        type="text"
                        className="flex-1 flex items-center justify-center gap-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleLikePost(post)}
                        disabled={isLoading}
                        icon={<LikePost checked={isLiked} onChange={() => { }} />}
                    >
                        <FormattedMessage id="social.post.like" />
                    </Button>

                    <Button
                        type="text"
                        className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        icon={<AiOutlineComment className="text-lg" />}
                        onClick={() => {
                            handleShowComments(post);
                            setReplyingTo(null);
                        }}
                    >
                        <FormattedMessage id="social.post.comment" />
                    </Button>

                    <SharePostPopover type='group-post' objShare={post} intl={intl} skin={skin} />
                </div>
                <Divider className="mt-0" />

                {/* postComments */}
                {
                    post?.comments?.length > 0 && (
                        <div className="space-y-4">
                            {/* Filter and display parent comments first (where parent_id is null) */}
                            {post?.comments
                                ?.filter(comment => comment?.parent_id === null)
                                ?.slice(0, 2)
                                ?.map((parentComment) => (
                                    <div key={parentComment?.documentId}>
                                        {/* Parent comment */}
                                        <div className="flex gap-3">
                                            <Avatar
                                                src={parentComment?.user?.avatar?.file_path}
                                                size={32}
                                                className="rounded-full"
                                            />
                                            <div className="flex-1">
                                                <h6 className="font-medium">{parentComment?.user?.fullname}</h6>
                                                <p className="whitespace-pre-wrap text_secondary">
                                                    {parentComment?.content}
                                                </p>
                                                <div className="flex gap-4 mt-1 text-sm">
                                                    <button
                                                        onClick={() => {
                                                            handleShowComments(post, parentComment);
                                                        }}
                                                    >
                                                        <span className="text_action">
                                                            <FormattedMessage id="social.post.reply" />
                                                        </span>
                                                    </button>
                                                    <span
                                                        className={`${skin === "dark" ? "text-gray-400" : "text-gray-500"
                                                            }`}
                                                    >
                                                        {getRelativeTime(parentComment?.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Child comments (replies) */}
                                        <div className="ml-10 mt-2 space-y-3">
                                            {post?.comments
                                                ?.filter(childComment => childComment?.parent?.documentId === parentComment?.documentId)
                                                ?.slice(0, 1)
                                                ?.map((childComment) => (
                                                    <div key={childComment?.documentId} className="flex gap-3">
                                                        <Avatar
                                                            src={childComment?.user?.avatar?.file_path}
                                                            size={24}
                                                            className="rounded-full"
                                                        />
                                                        <div className="flex-1">
                                                            <div className=" p-2 pb-0 rounded-lg">
                                                                <h6 className="font-medium text-sm">{childComment?.user?.fullname}</h6>
                                                                <p className="whitespace-pre-wrap text_secondary text-sm">
                                                                    {childComment?.content}
                                                                </p>
                                                                <span className="text_third italic" >
                                                                    {getRelativeTime(childComment?.createdAt)}
                                                                </span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                ))}

                                            {/* Show "View more replies" if there are more than 2 child comments */}
                                            {post?.comments?.filter(childComment =>
                                                childComment?.parent?.documentId === parentComment?.documentId
                                            )?.length > 1 && (
                                                    <button
                                                        className={`text-sm ${skin === "dark" ? "text-blue-400" : "text-blue-600"} hover:underline ml-2`}
                                                        onClick={() => {
                                                            handleShowComments(post);
                                                            setReplyingTo(null);
                                                        }}
                                                    >
                                                        <FormattedMessage
                                                            id="social.post.view_more_replies"
                                                            defaultMessage="View more replies"
                                                        />
                                                        ({post?.comments?.filter(childComment =>
                                                            childComment?.parent?.documentId === parentComment?.documentId
                                                        )?.length - 1})
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                ))}

                            {/* Show "View more comments" button if there are more than 2 parent comments */}
                            {post?.comments?.length > 2 && (
                                <button
                                    className={`text-sm ${skin === "dark" ? "text-blue-400" : "text-blue-600"} hover:underline`}
                                    onClick={() => {
                                        handleShowComments(post);
                                        setReplyingTo(null);
                                    }}
                                >
                                    <FormattedMessage
                                        id="social.post.view_more_comments"
                                        defaultMessage="View more comments"
                                    />
                                    {/* ({post?.comments?.filter(comment => comment?.parent_id === null)?.length - 2}) */}
                                </button>
                            )}
                        </div>
                    )
                }
            </Card>

            {showComments && selectedPost && (
                <CommentsModal
                    post={selectedPost}
                    visible={showComments}
                    userData={userData}
                    skin={skin}
                    intl={intl}
                    onClose={handleCloseComments}
                    onCommentAdded={handleCommentAdded}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    group={group}
                />
            )}
            {/* Post Form Modal (for both create and edit) */}
            <PostFormModal
                visible={showPostFormModal}
                onClose={handleClosePostFormModal}
                onSubmit={handlePostSubmit}
                userData={userData}
                intl={intl}
                language={language}
                // friends={friends}
                isSubmitting={isSubmitting}
                isEditing={postFormType === 'edit'}
                postData={postToEdit}
            />
        </>

    );
};

export default PostCard; 