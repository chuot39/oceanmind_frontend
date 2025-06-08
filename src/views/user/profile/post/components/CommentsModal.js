import React from 'react';
import { Modal, Avatar, Input, Divider, Image } from 'antd';
import { BsFillSendFill } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { getRelativeTime } from '../../../../../utils';
import TextArea from 'antd/es/input/TextArea';

const CommentsModal = ({
    visible,
    onClose,
    post,
    skin,
    intl,
    userData
}) => {
    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1000}
            className="comments_modal"
            centered
        >
            <div className={`grid grid-cols-12 gap-4 ${!post?.postMedias?.data?.length ? 'md:grid-cols-1' : ''}`}>
                {/* Left side - Post Content (Only show if has images) */}
                {post?.postMedias?.data?.length > 0 && (
                    <div className="col-span-12 md:col-span-7 lg:col-span-8 overflow-y-auto details_modal_post_image">
                        <Image.PreviewGroup>
                            <div className={`grid gap-2 overflow-y-auto ${post?.postMedias?.data?.length === 1 ? 'grid-cols-1' :
                                post?.postMedias?.data?.length === 2 ? 'grid-cols-2' :
                                    post?.postMedias?.data?.length === 3 ? 'grid-cols-2' :
                                        'grid-cols-2'
                                }`}>
                                {post?.postMedias?.data?.map((media, index) => (
                                    <Image
                                        key={index}
                                        src={media?.media_id?.file_path}
                                        alt={`post-${index}`}
                                        className="w-full object-cover rounded-lg"
                                    />
                                ))}
                            </div>
                        </Image.PreviewGroup>
                    </div>
                )}

                {/* Right side - Comments (Full width if no images) */}
                <div className={`col-span-12 ${post?.postMedias?.data?.length > 0 ? 'md:col-span-5 lg:col-span-4' : ''}`}>
                    {/* Post Info */}
                    <div className="flex items-start gap-3 mb-4">
                        <Avatar
                            src={post?.userDetail?.avatar_url_id?.file_path}
                            size={40}
                            className="rounded-full"
                        />
                        <div>
                            <h5 className="text-base font-medium">{post?.userDetail?.fullname}</h5>
                            <p className="text-sm text-primary">{getRelativeTime(post?.createdAt)}</p>
                        </div>
                    </div>

                    <div className={`text-base mb-2 text-justify ${skin === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                        {post?.content}
                    </div>

                    <Divider className={`mb-2 ${skin === 'dark' ? 'border-gray-300' : 'border-gray-700'}`} />

                    {/* Comments Section */}
                    <div className="space-y-4 max-h-[40vh] overflow-y-auto details_modal_comments pb-8">
                        {post?.postComments?.map((comment) => (
                            <div key={comment?.documentId} className="flex gap-3">
                                <Avatar
                                    src={comment?.user?.avatar_url_id?.file_path}
                                    size={35}
                                    className="rounded-full"
                                />
                                <div>
                                    <h6 className="font-medium">{comment?.user_id?.fullname}</h6>
                                    <p className={`${skin === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        {comment?.comment?.content}
                                    </p>
                                    <div className="flex gap-4 mt-1 text-sm">
                                        <button className={`${skin === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}>
                                            <FormattedMessage id="social.post.like" />
                                        </button>
                                        <button className={`${skin === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}>
                                            <FormattedMessage id="social.post.reply" />
                                        </button>
                                        <span className={`${skin === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {getRelativeTime(comment?.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Comment Input */}
                    <div className="mt-4 sticky bottom-2 mb-3 bg-inherit">
                        <Divider className={`mb-2 ${skin === 'dark' ? 'border-gray-300' : 'border-gray-700'}`} />
                        <div className="flex items-center gap-3">
                            <Avatar
                                src={userData?.avatar_url_id?.file_path}
                                size={35}
                                className="rounded-full"
                            />
                            <TextArea
                                autoSize={{ minRows: 2, maxRows: 6 }}
                                placeholder={intl.formatMessage({ id: 'social.post.write_something' })}
                                className={`details_modal_comment_input ${skin === 'dark' ? 'bg-slate-700 text-gray-300 focus:bg-gray-500 hover:bg-gray-600' : 'text-gray-600'}`}
                                suffix={
                                    <div className="flex gap-2 text-blue-400">
                                        <button className="hover:text-blue-600">
                                            <BsFillSendFill className='text-lg' />
                                        </button>
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CommentsModal; 