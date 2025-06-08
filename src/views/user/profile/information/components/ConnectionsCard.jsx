import React, { useState } from 'react';
import { Card, Avatar, Button, Tag, Modal, Tooltip } from 'antd';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { handleNavigateToDetailProfile } from '@/views/user/social/shared/actions/actionStore';
import { useUserData } from '@/utils/hooks/useAuth';
import { useFriend } from '@/views/user/components/hook';
import { handleNavigateToChat } from '@/views/user/stores/actions/friendActions';
import { useCreateConversation } from '@/views/user/stores/actions/friendHook';
import { BtnRequestFriend } from '@/components/button/ui/BtnRequestFriend';
import { ImProfile } from 'react-icons/im';
import { BsChat } from 'react-icons/bs';

const ConnectionsCard = ({ allFriends, statusFriend }) => {
    const navigate = useNavigate();
    const { userData } = useUserData();

    const { mutateAsync: createConversationAsync, isLoading: isLoadingCreateConversation } = useCreateConversation();
    // const { status: friendsStatus, data: friends } = useFriend(userData?.username);

    const [chatLoading, setChatLoading] = useState(false);
    const [chatLoadingId, setChatLoadingId] = useState(null);

    console.log('allFriends', allFriends)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleCancel = () => setIsModalVisible(false);
    const showModal = () => setIsModalVisible(true);

    const handleChatWithFriend = (friend) => {
        setChatLoadingId(friend?.documentId);
        handleNavigateToChat({
            friend,
            userData,
            navigate,
            createConversationAsync,
            setLoading: (isLoading) => {
                setChatLoading(isLoading);
                if (!isLoading) setChatLoadingId(null);
            }
        });
    };

    const FriendCard = ({ item }) => {
        const [localStatus, setLocalStatus] = useState('unfriend');

        return (
            <Card
                className="friend-card w-full"
                cover={
                    <div className="h-32 overflow-hidden">
                        <img
                            alt="cover"
                            src={`${item?.friend?.banner?.file_path}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                }
            >
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <Avatar
                            size={64}
                            src={`${item?.friend?.avatar?.file_path}`}
                            className=" border-4 border-white"
                        />
                        <div className=' items-center gap-2'>
                            <h3 className="text-lg font-semibold">
                                {item?.friend?.fullname}
                            </h3>
                            <p className="text-sm text_secondary">
                                @{item?.friend?.username}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {localStatus === 'unfriend' && (
                            <Button
                                type="primary"
                                className="flex-1 btn_custom_accept"
                                loading={chatLoading && chatLoadingId === item?.friend?.documentId}
                                onClick={() => handleChatWithFriend(item?.friend)}
                            >
                                <FormattedMessage id="social.friend.chat_now" />
                            </Button>
                        )}
                        <BtnRequestFriend
                            friend={item?.friend}
                            status={localStatus}
                            setStatusRequestSend={setLocalStatus}
                        />
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <>
            <Card className="connections-card" loading={statusFriend === 'loading'}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title uppercase mb-0">
                        <FormattedMessage id="profile.connections" defaultMessage="Connections" />
                    </h2>
                    <Tag className="tag-purple tag-purple-hover px-3 py-1 text-sm font-medium cursor-pointer" onClick={showModal}>
                        <FormattedMessage id="profile.view_all" defaultMessage="View all connections" />
                    </Tag>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {allFriends?.length > 0 && allFriends?.slice(0, 8)?.map((friend, index) => (
                        <div key={index} className="connection-item flex items-center justify-between ">
                            <Avatar src={friend?.friend?.avatar?.file_path} size={40} />
                            <div className="connection-info">
                                <div className="text_first text-base font-medium">{friend?.friend?.fullname}</div>
                                <div className="text_secondary">@{friend?.friend?.username}</div>
                            </div>
                            <div className="connection-action flex gap-2">
                                <Tooltip title={<FormattedMessage id="profile.view_profile" defaultMessage="View profile" />}>
                                    <Button
                                        type="dashed"
                                        className="tag-info tag-info-hover"
                                        onClick={() => handleNavigateToDetailProfile({ username: friend?.friend?.username, navigate })}
                                        icon={<ImProfile className='text-base' />}
                                    />
                                </Tooltip>
                                <Tooltip title={<FormattedMessage id="social.friend.chat_now" defaultMessage="Chat now" />}>
                                    <div className="btn_custom_accept rounded-md">
                                        <Button
                                            type="text"
                                            className="text_first"
                                            icon={<BsChat />}
                                            onClick={() => handleChatWithFriend(friend?.friend)}
                                            loading={chatLoading && chatLoadingId === friend?.friend?.documentId}
                                        />
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <Modal
                title={
                    <span className="font-semibold text_first">
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
                        {statusFriend === 'loading' ? (
                            <Card loading={true} />
                        ) : (
                            allFriends?.length > 0 && allFriends?.filter(item => item?.friend?.documentId !== userData?.documentId)?.map((item) => (
                                <FriendCard key={item?.friend?.documentId} item={item} />
                            ))
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ConnectionsCard; 