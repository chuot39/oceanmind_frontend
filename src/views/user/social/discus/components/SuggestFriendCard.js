import React, { useState, useEffect } from 'react';
import { Card, Avatar, Button, Modal, Divider } from 'antd';
import { BsArrowRight } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { handleNoticeAction } from '@/utils/Utils';
import FriendCard from '../../friend/components/FriendCard';
import { BtnRequestFriend } from '@/components/button/ui';

const SuggestFriendCard = ({ skin, status, suggestFriends, userData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [friendStatuses, setFriendStatuses] = useState({});
    const [renderKey, setRenderKey] = useState(0);

    // Deep copy của suggestFriends để đảm bảo không bị mất dữ liệu
    const [localSuggestFriends, setLocalSuggestFriends] = useState([]);

    useEffect(() => {
        if (suggestFriends?.length > 0) {
            setLocalSuggestFriends(JSON.parse(JSON.stringify(suggestFriends)));
        }
    }, [suggestFriends]);

    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    const handleAddFriend = (item) => {
        handleNoticeAction({ message: 'You are already friends with this user', action: item?.details?.fullname, skin })
    }

    // Initialize friend statuses when suggestFriends changes
    useEffect(() => {
        if (suggestFriends?.length > 0) {
            const initialStatuses = {};
            suggestFriends.forEach(friend => {
                initialStatuses[friend.documentId] = 'add_friend';
            });
            setFriendStatuses(initialStatuses);
        }
    }, [suggestFriends]);

    // Handle status change for a specific friend
    const handleStatusChange = (friendId, newStatus) => {

        let validStatus = newStatus;

        // Nếu denied/cancel, đảm bảo trạng thái là add_friend
        if (newStatus === 'denied') {
            validStatus = 'add_friend';
        }

        setFriendStatuses(prev => {
            const updated = {
                ...prev,
                [friendId]: validStatus
            };
            return updated;
        });

        // Force re-render after updating status
        setTimeout(() => {
            setRenderKey(prev => prev + 1);
        }, 50);
    };

    const FriendItem = ({ item }) => {
        const friendStatus = friendStatuses[item?.documentId] || 'add_friend';

        return (
            <div className={`flex items-center justify-between p-2 ${skin === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} rounded-lg`}>
                <div className="flex items-center gap-3">
                    <Avatar
                        size={40}
                        src={`${item?.avatar?.file_path}`}
                        className="flex-shrink-0"
                    />
                    <div className="flex flex-col">
                        <span className="font-medium ">
                            {item?.fullname}
                        </span>
                        <span className="text-xs text_secondary">
                            @{item?.username}
                        </span>
                    </div>
                </div>
                <div className='flex gap-5 '>
                    <BtnRequestFriend
                        key={`${item?.documentId}-${renderKey}-${friendStatus}`}
                        friend={item}
                        status={friendStatus}
                        setStatusRequestSend={(newStatus) => handleStatusChange(item?.documentId, newStatus)}
                    />
                </div>
            </div>
        );
    };

    return (
        <>
            <Card
                title={<span className="font-semibold">
                    <FormattedMessage id="social.friend.suggested_friends" />
                </span>}
                className="border-none"
                loading={status === 'loading'}
            >
                <div className="space-y-3">
                    {localSuggestFriends?.length > 0 && localSuggestFriends?.slice(0, 5)?.map((item) => (
                        <FriendItem key={`${item?.documentId}-${renderKey}`} item={item} />
                    ))}

                    {localSuggestFriends?.length > 5 && (
                        <div className="pt-2 text-center">
                            <Button
                                type="link"
                                onClick={showModal}
                                className="flex items-center gap-2 mx-auto"
                            >
                                <FormattedMessage id="social.friend.view_more" /> <BsArrowRight className="text-lg" />
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            <Modal
                title={
                    <span className="font-semibold">
                        <FormattedMessage id="social.friend.suggested_friends" />
                    </span>
                }
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
                className="friend_list_modal"
                destroyOnClose={false}
            >
                <Divider className='my-0' />
                <div className="friend-list max-h-[70vh] overflow-y-auto px-2">
                    <div className="grid grid-cols-2 gap-4">
                        {localSuggestFriends?.length > 0 && localSuggestFriends?.filter(item => item?.documentId !== userData?.documentId)?.map((item) => {
                            const currentStatus = friendStatuses[item?.documentId] || 'add_friend';
                            return (
                                <FriendCard
                                    key={`${item?.documentId}-${renderKey}-${currentStatus}`}
                                    type="all"
                                    friend={item}
                                    userData={userData}
                                    status={currentStatus}
                                    setStatusRequestSend={(newStatus) => handleStatusChange(item?.documentId, newStatus)}
                                />
                            );
                        })}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SuggestFriendCard; 