import React, { useState } from 'react';
import { Card, Avatar, Button, Modal } from 'antd';
import { BsArrowRight } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';

const ListFriendCard = ({ skin, friends, userData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    console.log('friends', friends);

    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    const FriendItem = ({ item }) => (
        <div className={`flex items-center justify-between p-2 ${skin === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'} rounded-lg`}>
            <div className="flex items-center gap-3">
                <Avatar
                    size={40}
                    src={`${item?.details?.avatar_url_id?.file_path}`}
                    className="flex-shrink-0"
                />
                <div className="flex flex-col">
                    <span className={`font-medium ${skin === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        {item?.details?.fullname}
                    </span>
                    <span className="text-xs text-gray-500">
                        {item?.details?.username}
                    </span>
                </div>
            </div>
            <Button
                type="primary"
                size="small"
                className="bg-blue-500 hover:bg-blue-600"
            >
                <FormattedMessage id="social.friend.chat_now" />
            </Button>
        </div>
    );

    const FriendCard = ({ item }) => {
        return (
            <Card
                className={`friend-card w-full ${skin === 'dark' ? 'bg-[#283046] border-gray-700' : 'bg-white'}`}
                cover={
                    <div className="h-32 overflow-hidden">
                        <img
                            alt="cover"
                            src={`${item?.details?.banner_url_id?.file_path}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                }
            >
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <Avatar
                            size={64}
                            src={`${item?.details?.avatar_url_id?.file_path}`}
                            className=" border-4 border-white dark:border-[#283046]"
                        />
                        <div className=' items-center gap-2'>
                            <h3 className={`text-lg font-semibold ${skin === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                                {item?.details?.fullname}
                            </h3>
                            <p className="text-sm text-gray-500">
                                @{item?.details?.username}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="primary"
                            className="flex-1 btn_custom_accept"
                        >
                            <FormattedMessage id="social.friend.chat_now" />
                        </Button>
                        <Button
                            type="default"
                            className={`flex-1 btn_custom_reject`}
                        >
                            <FormattedMessage id="social.friend.unfriend" />
                        </Button>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <>
            <Card
                title={<span className={`font-semibold ${skin === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    <FormattedMessage id="social.friend.friend_list" />
                </span>}
                className={`border-none ${skin === 'dark' ? 'bg-[#283046]' : 'bg-white'}`}
            >
                <div className="space-y-3">
                    {friends?.slice(0, 5)?.map((item) => (
                        <FriendItem key={item?.details?.documentId} item={item} />
                    ))}

                    {friends?.length > 5 && (
                        <div className="pt-2 text-center">
                            <Button
                                type="link"
                                onClick={showModal}
                                className="flex items-center gap-2 mx-auto text-blue-500 hover:text-blue-600"
                            >
                                <FormattedMessage id="social.friend.view_more" /> <BsArrowRight className="text-lg" />
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            <Modal
                title={
                    <span className={`font-semibold ${skin === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                        <FormattedMessage id="social.friend.friend_list" />
                    </span>
                }
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
                className="friend_list_modal"
            >
                <div className="friend-list max-h-[70vh] overflow-y-auto px-2">
                    <div className="grid grid-cols-2 gap-4">
                        {friends?.filter(item => item?.details?.documentId !== userData?.documentId)?.map((item) => (
                            <FriendCard key={item?.details?.documentId} item={item} />
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ListFriendCard; 