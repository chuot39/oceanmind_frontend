import React, { useState } from 'react';
import { Card, Avatar, Button, Modal } from 'antd';
import { BsArrowRight } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { handleNavigateToDetail } from '../../shared/actions/actionStore';
import { useNavigate } from 'react-router-dom';
import { SiPrivateinternetaccess } from 'react-icons/si';
import { GlobalOutlined } from '@ant-design/icons';

const numberGroupShow = 4;

const SuggestGroupCard = ({ skin, status, suggestGroups, userData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);
    const navigate = useNavigate();

    // console.log('suggestGroups: ', suggestGroups);
    const GroupItem = ({ item }) => (
        <div className={`flex items-center justify-between p-2 ${skin === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'} rounded-lg`}>
            <div className="flex items-center gap-3">
                <Avatar
                    size={40}
                    src={`${item?.coverImage?.file_path}`}
                    className="flex-shrink-0"
                />
                <div className="flex flex-col">
                    <span className="font-medium text_first">
                        {item?.name}
                    </span>
                    <span className="text-xs text_secondary">
                        {item?.memberCount || 0} <FormattedMessage id="social.group.members" />
                    </span>
                </div>
            </div>
            <Button
                type="primary"
                size="small"
                className="btn_custom_accept"
                // onClick={() => handleNoticeAction({ message: 'request to join: ', action: item?.group_id?.name, skin: skin })}
                onClick={() => handleNavigateToDetail({ object: { ...item }, type: 'group', navigate })}

            >
                <FormattedMessage id="social.group.join" />
            </Button>
        </div>
    );

    const GroupCard = ({ item }) => {
        return (
            <Card className={`group_card w-full rounded-2xl overflow-hidden ${skin === 'dark' ? 'bg-[#283046] border-gray-700' : 'bg-white'}`}>
                <div className="relative">
                    <div className="h-24 bg-blue-100 rounded-t-2xl overflow-hidden">
                        <img
                            alt="cover"
                            src={item?.coverImage?.file_path}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Profile Section */}
                    <div className="p-4">
                        <div className="text-center">
                            <p className="text-lg font-semibold text_first">
                                <span className="mr-2">{item?.name}</span>
                                <span className="text-sm inline-block">
                                    {item?.isPublic ? <GlobalOutlined className="text-lg text-green-500" /> : <SiPrivateinternetaccess className="text-lg text-red-500" />}
                                </span>
                            </p>
                            <p className="text-sm text_secondary mb-4">
                                {item?.description}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-between items-center mb-4 px-8">
                            <div className="text-center">
                                <div className="font-semibold text_first">
                                    {item?.postCount || 0}
                                </div>
                                <div className="text-sm text_secondary">
                                    <FormattedMessage id="social.post.posts" />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text_first">
                                    {item?.memberCount || 0}
                                </div>
                                <div className="text-sm text_secondary">
                                    <FormattedMessage id="social.group.members" />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text_first">
                                    {item?.pendingRequestCount || 0}
                                </div>
                                <div className="text-sm text_secondary">
                                    <FormattedMessage id="social.group.requests" />
                                </div>
                            </div>
                        </div>


                        {/* Join Button */}
                        <Button
                            type="primary"
                            className="w-full btn_custom_accept h-10 rounded-lg"
                            onClick={() => handleNavigateToDetail({ object: { ...item }, type: 'group', navigate })}

                        >
                            <FormattedMessage id="social.group.access" />
                        </Button>
                    </div>
                </div>
            </Card>
        );
    };


    return (
        <>
            <Card
                title={<span className="text_first font-semibold ">
                    <FormattedMessage id="social.group.suggested_groups" />
                </span>}
                className="border-none"
                loading={status === 'loading'}
            >
                <div className="space-y-3">
                    {suggestGroups?.data?.slice(0, numberGroupShow)?.map((item) => (
                        <GroupItem key={item?.documentId} item={item} />
                    ))}

                    {suggestGroups?.data?.length > numberGroupShow && (
                        <div className="pt-0 text-center">
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
                        <FormattedMessage id="social.group.suggested_groups" />
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
                        {suggestGroups?.data?.map((item) => (
                            <GroupCard key={item?.documentId} item={item} />
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SuggestGroupCard; 