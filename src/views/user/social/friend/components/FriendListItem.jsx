import React, { useEffect, useState } from 'react';
import { Avatar, Button, Modal } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import useSkin from '../../../../../utils/hooks/useSkin';
import { useNavigate } from 'react-router-dom';
import { handleSendFriendRequest } from '@/views/user/stores/actions/friendActions';
import { useChangeFriendStatus } from '@/views/user/stores/actions/friendHook';
import { getConversation } from '@/helpers/userHelper';
import { notifyWarning } from '@/utils/Utils';

const BtnChatFriend = ({ handleNavigateToChat, loading, showModal }) => {
    return (
        <>
            <Button
                type="primary"
                className="flex-1"
                onClick={handleNavigateToChat}
                loading={loading}
            >
                <FormattedMessage id="social.friend.chat_now" />
            </Button>
            <Button
                type="default"
                className="flex-1 btn_custom_reject"
                onClick={showModal}
            >
                <FormattedMessage id="social.friend.unfriend" />
            </Button>
        </>
    );
};

const BtnRequestFriend = ({ handleChangeFriendStatus, loading, showModal }) => {
    return (
        <>
            <Button
                type="primary"
                className="flex-1 btn_custom_accept"
                onClick={() => handleChangeFriendStatus({ status: 'accepted' })}
                loading={loading}
            >
                <FormattedMessage id="social.friend.accept" />
            </Button>
            <Button
                type="default"
                className="flex-1 btn_custom_reject"
                onClick={showModal}
            >
                <FormattedMessage id="social.friend.decline" />
            </Button>
        </>
    );
};

const BtnSuggestFriend = ({ handleChangeFriendStatus, loading, showModal, requestSent }) => {
    return (
        <>
            {requestSent ? (
                <div className="flex gap-2">
                    <Button
                        type="primary"
                        className="flex-1"
                        disabled
                    >
                        <FormattedMessage id="social.friend.request_sent" defaultMessage="Request Sent" />
                    </Button>
                    <Button
                        type="primary"
                        danger
                        className="flex-1"
                        onClick={showModal}
                        loading={loading}
                    >
                        <FormattedMessage id="social.friend.cancel" defaultMessage="Cancel" />
                    </Button>
                </div>
            ) : (
                <Button
                    type="primary"
                    className="btn_custom_accept w-full"
                    onClick={() => { handleChangeFriendStatus({ status: 'pending' }); }}
                    loading={loading}
                >
                    <FormattedMessage id="social.friend.add_friend" />
                </Button>
            )}
        </>
    );
};

const FriendListItem = ({ friend, type, userData }) => {
    const { skin } = useSkin();
    const navigate = useNavigate();
    const intl = useIntl();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(null);
    const [requestAction, setRequestAction] = useState(null);

    // Mutation hooks
    const { mutate: sendFriendRequest } = useChangeFriendStatus();

    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    const handleChangeFriendStatus = ({ status }) => {
        setCurrentStatus(status);
        handleSendFriendRequest({
            userId: userData?.documentId,
            friendId: friend?.documentId,
            status: status,
            setLoading,
            setRequestSent,
            sendFriendRequestMutation: sendFriendRequest
        });
    };

    const handleNavigateToChat = async () => {
        setLoading(true);
        const conversation = await getConversation({ friend, userData });
        if (conversation?.data?.length === 1) {
            navigate(`/social/chat/${conversation?.data[0]?.documentId}`);
        } else {

            notifyWarning('No conversation found');
        }
        setLoading(false);
    };

    const renderActions = () => {
        switch (type) {
            case 'all':
                return (
                    <BtnSuggestFriend handleChangeFriendStatus={handleChangeFriendStatus} loading={loading} showModal={showModal} requestSent={requestSent} />
                );

            case 'friends':
                return (
                    requestAction === 'denied' ? (
                        <BtnSuggestFriend handleChangeFriendStatus={handleChangeFriendStatus} loading={loading} showModal={showModal} requestSent={requestSent} />
                    ) : (
                        <div className="flex gap-2">
                            <BtnChatFriend handleNavigateToChat={handleNavigateToChat} loading={loading} showModal={showModal} />
                        </div>
                    )
                );

            case 'received':
                return (
                    <div className="flex gap-2">
                        {
                            requestAction === 'accepted' ? (
                                <BtnChatFriend handleNavigateToChat={handleNavigateToChat} loading={loading} showModal={showModal} />
                            ) : requestAction === 'denied' ? (
                                <BtnSuggestFriend handleChangeFriendStatus={handleChangeFriendStatus} loading={loading} showModal={showModal} requestSent={requestSent} />
                            ) : (
                                <BtnRequestFriend handleChangeFriendStatus={handleChangeFriendStatus} loading={loading} showModal={showModal} />
                            )
                        }

                    </div>
                );

            case 'requests':
                return (
                    requestAction === 'denied' ? (
                        <BtnSuggestFriend handleChangeFriendStatus={handleChangeFriendStatus} loading={loading} showModal={showModal} requestSent={requestSent} />
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                type="primary"
                                className="flex-1 btn_custom_accept"
                                onClick={showModal}
                                loading={loading}
                            >
                                <FormattedMessage id="social.friend.cancel" />
                            </Button>
                        </div>
                    )
                );
            default:
                return null;
        }
    };


    useEffect(() => {
        if (!loading && (currentStatus === 'denied' || currentStatus === 'unfriend') && isModalVisible) {
            setIsModalVisible(false);
            setCurrentStatus(null);
            setRequestAction('denied');

        }
        if (!loading && (currentStatus === 'accepted')) {
            setRequestAction('accepted');
        }
        if (!loading && (currentStatus === 'denied')) {
            setRequestAction('denied');
            setRequestSent(false);
        }
    }, [loading, currentStatus, isModalVisible]);

    const renderModal = () => {
        let title, content, okText;

        switch (type) {
            case 'all':
                title = intl.formatMessage({ id: 'social.friend.cancel_request_title', defaultMessage: 'Cancel Friend Request' });
                content = intl.formatMessage(
                    { id: 'social.friend.cancel_request_content', defaultMessage: 'Are you sure you want to cancel your friend request to {name}?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_cancel', defaultMessage: 'Yes, Cancel' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus({ status: 'denied' }) };

            case 'friends':
                title = intl.formatMessage({ id: 'social.friend.unfriend_title', defaultMessage: 'Remove Friend' });
                content = intl.formatMessage(
                    { id: 'social.friend.unfriend_content', defaultMessage: 'Are you sure you want to remove {name} from your friends?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_remove', defaultMessage: 'Yes, Remove' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus({ status: 'unfriend' }) };

            case 'received':
                title = intl.formatMessage({ id: 'social.friend.decline_request_title', defaultMessage: 'Decline Friend Request' });
                content = intl.formatMessage(
                    { id: 'social.friend.decline_request_content', defaultMessage: 'Are you sure you want to decline the friend request from {name}?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_decline', defaultMessage: 'Yes, Decline' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus({ status: 'denied' }) };

            case 'requests':
                title = intl.formatMessage({ id: 'social.friend.cancel_request_title', defaultMessage: 'Cancel Friend Request' });
                content = intl.formatMessage(
                    { id: 'social.friend.cancel_request_content', defaultMessage: 'Are you sure you want to cancel your friend request to {name}?' },
                    { name: friend?.fullname }
                );
                okText = intl.formatMessage({ id: 'social.friend.yes_cancel', defaultMessage: 'Yes, Cancel' });
                return { title, content, okText, onOk: () => handleChangeFriendStatus({ status: 'denied' }) };

            default:
                return { title: '', content: '', okText: '', onOk: () => { } };
        }
    };

    const { title, content, okText, onOk } = renderModal();

    return (
        <>
            <div className={`flex items-center justify-between p-4 rounded-lg ${skin === 'dark' ? 'bg-[#283046]' : 'bg-white'} shadow`}>
                <div className="flex items-center gap-4">
                    <Avatar
                        src={friend?.avatar?.file_path}
                        size={48}
                    />
                    <div>
                        <h4 className={`font-medium ${skin === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            {friend?.fullname}
                        </h4>
                        <p className="text-sm text-gray-500">@{friend?.username}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    {renderActions()}
                </div>
            </div>

            <Modal
                title={title}
                open={isModalVisible}
                onOk={onOk}
                onCancel={handleCancel}
                okText={okText}
                cancelText={intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
                okButtonProps={{ danger: true }}
                confirmLoading={loading}
            >
                <p>{content}</p>
            </Modal>
        </>
    );
};

export default FriendListItem;
