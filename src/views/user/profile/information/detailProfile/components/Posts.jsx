import React from 'react';
import { Card, Avatar, Space, Button, Divider } from 'antd';
import { FormattedMessage } from 'react-intl';
import {
    FaThumbsUp,
    FaComment,
    FaShare,
    FaCalendarAlt
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const Posts = ({ posts, profile }) => {
    if (!posts || posts?.length === 0 || !profile) return null;

    return (
        <div className="posts-section">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <FormattedMessage id="profile.posts" defaultMessage="Recent Posts" />
            </h2>

            <div className="space-y-4">
                {posts?.map(post => (
                    <Card key={post?.id} className="post-card">
                        {/* Post Header */}
                        <div className="flex items-center mb-3">
                            <Avatar src={profile?.avatar} size={40} />
                            <div className="ml-3">
                                <h4 className="font-medium m-0">{profile?.fullName}</h4>
                                <p className="text-gray-500 text-xs flex items-center gap-1">
                                    <FaCalendarAlt />
                                    {formatDistanceToNow(new Date(post?.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium mb-2">{post?.title}</h3>
                            <p className="text-gray-700">{post?.content}</p>
                        </div>

                        {/* Post Image (if available) */}
                        {post?.image && (
                            <div className="mb-4">
                                <img
                                    src={post?.image}
                                    alt={post?.title}
                                    className="w-full rounded-lg object-cover max-h-80"
                                />
                            </div>
                        )}

                        {/* Post Stats */}
                        <div className="flex text-gray-500 text-sm mb-2">
                            <span className="mr-4">{post?.likes} likes</span>
                            <span>{post?.comments} comments</span>
                        </div>

                        <Divider className="my-2" />

                        {/* Post Actions */}
                        <div className="flex justify-between">
                            <Button type="text" icon={<FaThumbsUp />}>
                                <FormattedMessage id="profile.like" defaultMessage="Like" />
                            </Button>
                            <Button type="text" icon={<FaComment />}>
                                <FormattedMessage id="profile.comment" defaultMessage="Comment" />
                            </Button>
                            <Button type="text" icon={<FaShare />}>
                                <FormattedMessage id="profile.share" defaultMessage="Share" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {posts?.length > 2 && (
                <div className="text-center mt-4">
                    <Button type="primary">
                        <FormattedMessage id="profile.view_more_posts" defaultMessage="View More Posts" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Posts; 