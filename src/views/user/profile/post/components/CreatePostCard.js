import React, { useState } from 'react';
import { Card, Avatar, Button, Dropdown, Modal } from 'antd';
import { BsPeople, BsFileEarmarkText } from 'react-icons/bs';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import avatar_university from '../../../../../assets/images/logo/avatar_university.png';

const CreatePostCard = ({ userData, skin, intl, onCreatePost, }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <>
            <Card className="mb-4 card_new_post">
                <div className="flex gap-3">
                    <Avatar
                        src={userData?.avatar_url_id?.file_path}
                        size={40}
                        className="rounded-full"
                    />
                    <div
                        className={`flex-1 px-4 py-2 rounded-full cursor-pointer ${skin === 'dark'
                            ? 'bg-slate-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                        onClick={handleShow}
                    >
                        <FormattedMessage id="social.post.write_something" />
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <Button
                        type="text"
                        icon={<BsPeople className="text-lg" />}
                        className="flex items-center gap-2 discus_btn_action"
                        onClick={onCreatePost}
                    >
                        <FormattedMessage id="social.post.new_group" />
                    </Button>
                    <Button
                        type="text"
                        icon={<BsFileEarmarkText className="text-lg" />}
                        className="flex items-center gap-2 discus_btn_action"
                        onClick={onCreatePost}
                    >
                        <FormattedMessage id="social.post.new_document" />
                    </Button>
                    <Button
                        type="text"
                        icon={<MdOutlineEmojiEmotions className="text-lg" />}
                        className="flex items-center gap-2 discus_btn_action"
                        onClick={onCreatePost}
                    >
                        <FormattedMessage id="social.post.feeling_activity" />
                    </Button>
                </div>
            </Card>


            <Modal
                title="Create Post"
                open={show}
                onCancel={handleClose}
                footer={null}
                width={800}
                className="post_modal"
            >
                <div className="p-4">
                    <div className="flex items-center mb-4">
                        <Avatar
                            src={avatar_university}
                            size={60}
                            className="rounded-full"
                        />
                        <input
                            type="text"
                            className="flex-1 ml-3 px-4 py-2 rounded-lg bg-gray-50 focus:outline-none"
                            placeholder="Write something here..."
                        />
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            'Photo/Video', 'Tag Friend', 'Feeling/Activity',
                            'Check in', 'Live Video', 'Gif',
                            'Watch Party', 'Play with Friends'
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-center p-3 rounded-lg ${skin === 'dark' ? 'bg-gray-600 text-white hover:bg-gray-500' : 'bg-teal-50 hover:bg-teal-100'} cursor-pointer transition-colors`}
                            >
                                <Avatar src={avatar_university} size="small" className="mr-2" />
                                {item}
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Avatar
                                src={avatar_university}
                                size={60}
                                className="rounded-full mr-3"
                            />
                            <h6 className="text-base font-medium">Your Story</h6>
                        </div>
                        <Dropdown
                            overlay={
                                <div className={`${skin === 'dark' ? 'bg-gray-600 text-white' : 'bg-white'} rounded-lg shadow-lg p-2 min-w-[200px]`}>
                                    <div className={`p-2  rounded cursor-pointer ${skin === 'dark' ? 'text-white hover:bg-gray-500' : 'text-gray-600 hover:bg-teal-100'}`}>
                                        <h6 className="font-medium">
                                            <FormattedMessage id="social.post.privacy.public" />
                                        </h6>
                                        <p className={`text-sm ${skin === 'dark' ? 'text-white' : 'text-gray-600'}`}>
                                            <FormattedMessage id="social.post.privacy.public_desc" />
                                        </p>
                                    </div>
                                    <div className={`p-2  rounded cursor-pointer ${skin === 'dark' ? 'text-white hover:bg-gray-500' : 'text-gray-600 hover:bg-teal-100'}`}>
                                        <h6 className="font-medium">
                                            <FormattedMessage id="social.post.privacy.friends" />
                                        </h6>
                                        <p className={`text-sm ${skin === 'dark' ? 'text-white' : 'text-gray-600'}`}>
                                            <FormattedMessage id="social.post.privacy.friends_desc" />
                                        </p>
                                    </div>
                                    <div className={`p-2  rounded cursor-pointer ${skin === 'dark' ? 'text-white hover:bg-gray-500' : 'text-gray-600 hover:bg-teal-100'}`}>
                                        <h6 className="font-medium">
                                            <FormattedMessage id="social.post.privacy.friends_except" />
                                        </h6>
                                        <p className={`text-sm ${skin === 'dark' ? 'text-white' : 'text-gray-600'}`}>
                                            <FormattedMessage id="social.post.privacy.friends_except_desc" />
                                        </p>
                                    </div>
                                    <div className={`p-2  rounded cursor-pointer ${skin === 'dark' ? 'text-white hover:bg-gray-500' : 'text-gray-600 hover:bg-teal-100'}`}>
                                        <h6 className="font-medium">
                                            <FormattedMessage id="social.post.privacy.only_me" />
                                        </h6>
                                        <p className={`text-sm ${skin === 'dark' ? 'text-white' : 'text-gray-600'}`}>
                                            <FormattedMessage id="social.post.privacy.only_me_desc" />
                                        </p>
                                    </div>
                                </div>
                            }
                        >
                            <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                                Friend
                            </button>
                        </Dropdown>
                    </div>

                    <button className="w-full mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">
                        Post
                    </button>
                </div>
            </Modal>
        </>

    );
};

export default CreatePostCard; 