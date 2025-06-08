import React from 'react';
import { Card, Avatar, Button, Dropdown, Image, Divider } from 'antd';
import { BsThreeDots } from 'react-icons/bs';
import { AiOutlineComment, AiOutlineShareAlt } from 'react-icons/ai';
import { FormattedMessage } from 'react-intl';
import { getRelativeTime } from '../../../../../utils';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const PostCard = ({ post, skin, intl, onShowComments, userData }) => {

    const postActions = [
        {
            key: 'mark',
            label: intl.formatMessage({ id: 'social.post.mark_post' })
        },
        {
            key: 'report',
            label: intl.formatMessage({ id: 'social.post.report' })
        },
        {
            key: 'delete',
            label: intl.formatMessage({ id: 'social.post.delete' })
        },
        {
            key: 'edit',
            label: intl.formatMessage({ id: 'social.post.edit' })
        }
    ];

    const reactionEmojis = [
        { key: 'like', emoji: '👍', label: intl.formatMessage({ id: 'social.post.like' }) },
        { key: 'love', emoji: '❤️', label: intl.formatMessage({ id: 'social.post.love' }) },
        { key: 'haha', emoji: '😄', label: intl.formatMessage({ id: 'social.post.haha' }) },
        { key: 'wow', emoji: '😮', label: intl.formatMessage({ id: 'social.post.wow' }) },
        { key: 'sad', emoji: '😢', label: intl.formatMessage({ id: 'social.post.sad' }) },
        { key: 'angry', emoji: '😠', label: intl.formatMessage({ id: 'social.post.angry' }) }
    ];

    return (
        <Card className="mb-4 card_discus_post">
            {/* Post Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <Avatar
                        src={post?.userDetail?.avatar_url_id?.file_path}
                        size={40}
                        className="rounded-full"
                    />
                    <div>
                        <h5 className="text-base font-medium">
                            {post?.userDetail?.fullname}
                        </h5>
                        <p className="text-sm text-primary">
                            {getRelativeTime(post?.createdAt)}
                        </p>
                    </div>
                </div>
                <Dropdown
                    menu={{ items: postActions }}
                    placement="bottomRight"
                    trigger={["click"]}
                >
                    <Button type="text" icon={<BsThreeDots />} />
                </Dropdown>
            </div>

            {/* Post Content */}
            <div
                className={`text-base mb-4 ${skin === "dark" ? "text-gray-200" : "text-gray-600"
                    }`}
            >
                {post?.content}
            </div>

            {/* Post Images */}
            {post?.postMedias?.data?.length > 0 && (
                <Image.PreviewGroup
                    preview={{
                        items: post?.postMedias?.data?.map(media => ({
                            src: media?.media_id?.file_path.startsWith('http')
                                ? media?.media_id?.file_path
                                : `${import.meta.env.VITE_STRAPI_URL}${media?.media_id?.file_path}`
                        }))
                    }}
                >
                    <div
                        className={`grid gap-2 ${post?.postMedias?.data?.length === 1
                            ? "grid-cols-1"
                            : post?.postMedias?.data?.length === 2
                                ? "grid-cols-2"
                                : post?.postMedias?.data?.length === 3
                                    ? "grid-cols-2"
                                    : "grid-cols-2"
                            }`}
                    >
                        {post?.postMedias?.data?.slice(0, 4).map((media, index) => {
                            if (post?.postMedias?.data?.length === 3 && index === 0) {
                                return (
                                    <div key={index} className="col-span-2">
                                        <Image
                                            src={media?.media_id?.file_path.startsWith('http')
                                                ? media?.media_id?.file_path
                                                : `${import.meta.env.VITE_STRAPI_URL}${media?.media_id?.file_path}`}
                                            alt={`post-${index}`}
                                            className="w-full h-[300px] object-cover rounded-lg cursor-pointer"
                                        />
                                    </div>
                                );
                            }

                            const isLastVisible = index === 3 && post?.postMedias?.data?.length > 4;
                            return (
                                <div key={index} className="relative">
                                    <Image
                                        src={media?.media_id?.file_path.startsWith('http')
                                            ? media?.media_id?.file_path
                                            : `${import.meta.env.VITE_STRAPI_URL}${media?.media_id?.file_path}`}
                                        alt={`post-${index}`}
                                        className={`w-full cursor-pointer  
                                        ${post?.postMedias?.data?.length === 1 ? "h-[400px]" : post?.postMedias?.data?.length === 2 ? "h-[300px]" : "h-[200px]"} object-cover rounded-lg
                                        ${index === 3 ? "opacity-50 relative z-10 " : ""} 
                                         `}
                                    />

                                    {isLastVisible && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                                            <span className="text-white text-2xl font-bold z-20">
                                                +{post?.postMedias?.data?.length - 4}
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
                        {post?.postLikes?.data?.length || 0}{" "}
                        <FormattedMessage id="social.post.likes" />
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm ">
                        {post?.postComments?.length || 0}{" "}
                        <FormattedMessage id="social.post.comments" />
                    </span>
                    <span className="text-sm ">
                        {post?.postShares?.data?.length || 0}{" "}
                        <FormattedMessage id="social.post.shares" />
                    </span>
                </div>
            </div>

            {/* Post Actions */}
            <div className="flex justify-between items-center post_actions">
                <Button
                    type="text"
                    className="flex-1 flex items-center justify-center gap-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    icon={<FaRegHeart className="text-lg " />}
                >
                    <FormattedMessage id="social.post.like" />
                </Button>

                <Button
                    type="text"
                    className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    icon={<AiOutlineComment className="text-lg" />}
                    onClick={() => onShowComments(post)}
                >
                    <FormattedMessage id="social.post.comment" />
                </Button>

                <Button
                    type="text"
                    className="flex-1 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    icon={<AiOutlineShareAlt className="text-lg" />}
                >
                    <FormattedMessage id="social.post.share" />
                </Button>
            </div>
            <Divider
                className={`${skin === "dark" ? "border-gray-300" : "border-gray-600"
                    } mt-0`}
            />

            {/* Preview Comments */}
            {post?.postComments?.length > 0 && (
                <div className="space-y-4">
                    {post?.postComments?.slice(0, 2).map((comment) => (
                        <div key={comment?.comment?.documentId} className="flex gap-3">
                            <Avatar
                                src={comment?.user?.avatar_url_id?.file_path}
                                size={32}
                                className="rounded-full"
                            />
                            <div>
                                <h6 className="font-medium">{comment?.comment?.user_id?.fullname}</h6>
                                <p
                                    className={`${skin === "dark" ? "text-gray-300" : "text-gray-500"
                                        }`}
                                >
                                    {comment?.comment?.content}
                                </p>
                                <div className="flex gap-4 mt-1 text-sm">
                                    <button
                                        className={`${skin === "dark"
                                            ? "text-gray-400 hover:text-gray-300"
                                            : "text-gray-500 hover:text-gray-600"
                                            }`}
                                    >
                                        <FormattedMessage id="social.post.like" />
                                    </button>
                                    <button
                                        className={`${skin === "dark"
                                            ? "text-gray-400 hover:text-gray-300"
                                            : "text-gray-500 hover:text-gray-600"
                                            }`}
                                    >
                                        <FormattedMessage id="social.post.reply" />
                                    </button>
                                    <span
                                        className={`${skin === "dark" ? "text-gray-400" : "text-gray-500"
                                            }`}
                                    >
                                        {getRelativeTime(comment?.comment?.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default PostCard; 