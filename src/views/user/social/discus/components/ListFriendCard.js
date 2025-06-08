import React, { useState, useRef, useEffect } from 'react';
import { Card, Avatar, Button, Modal, Spin } from 'antd';
import { BsArrowRight } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { handleNoticeAction } from '@/utils/Utils';
import { getConversation } from '@/helpers/userHelper';
import { useNavigate } from 'react-router-dom';
import { useCreateConversation } from '@/views/user/stores/actions/friendHook';
const ListFriendCard = ({ skin, friends, userData, status, fetchNextPage, hasNextPage, isFetchingNextPage }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modalContentRef = useRef(null);
    const navigate = useNavigate();
    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);
    const [loading, setLoading] = useState(false);
    const { mutateAsync: createConversationAsync } = useCreateConversation();

    const handleNavigateToChat = async ({ friend, userData }) => {
        setLoading(true);
        const conversation = await getConversation({ friend, userData });
        if (conversation?.data?.exists === true) {
            navigate(`/social/chat/${conversation?.data?.conversation?.documentId}`);
        } else {
            const conversation = await createConversationAsync({
                userId: userData?.documentId,
                friendId: friend?.documentId,
            });
            if (conversation?.data?.documentId) {
                navigate(`/social/chat/${conversation?.data?.documentId}`);
            } else {
                notifyWarning('No conversation found');
            }
        }
        setLoading(false);
    };

    // Handle infinite scroll in modal
    useEffect(() => {
        const modalContent = modalContentRef.current;
        if (!modalContent) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = modalContent;
            // If scrolled to bottom and there's a next page, fetch it
            if (scrollHeight - scrollTop <= clientHeight + 100 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        };

        modalContent.addEventListener('scroll', handleScroll);
        return () => modalContent.removeEventListener('scroll', handleScroll);
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const FriendItem = ({ item }) => (
        <div className={`flex items-center justify-between p-2 rounded-lg`}>
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
            <Button
                type="primary"
                size="small"
                className="btn_custom_accept"
                onClick={() => handleNavigateToChat({ friend: item, userData })}
                loading={loading}
            >
                <FormattedMessage id="social.friend.chat_now" />
            </Button>
        </div>
    );

    const FriendCard = ({ item }) => {
        return (
            <Card
                className="friend-card w-full"
                cover={
                    <div className="h-32 overflow-hidden">
                        <img
                            alt="cover"
                            src={`${item?.banner?.file_path}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                }
            >
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <Avatar
                            size={64}
                            src={`${item?.avatar?.file_path}`}
                            className=" border-4"
                        />
                        <div className=' items-center gap-2'>
                            <h3 className="text-lg font-semibold text_first">
                                {item?.fullname}
                            </h3>
                            <p className="text-sm text_secondary">
                                @{item?.username}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="primary"
                            className="flex-1 btn_custom_accept"
                            onClick={() => handleNavigateToChat({ friend: item, userData })}
                            loading={loading}
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

    // Flatten all pages of friends data
    const allFriends = friends?.pages?.flatMap(page => page.data) || [];


    console.log('allFriends', allFriends);
    return (
        <>
            <Card
                title={<span className={`font-semibold text_first`}>
                    <FormattedMessage id="social.friend.friend_list" />
                </span>}
                className="border-none"
                loading={status === 'loading'}

            >
                <div className="space-y-3">
                    {allFriends?.slice(0, 5)?.map((item) => (
                        <FriendItem key={item?.friendship?.documentId} item={item.friend} />
                    ))}

                    {allFriends?.length > 5 && (
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
                    <span className={`font-semibold text_first`}>
                        <FormattedMessage id="social.friend.friend_list" />
                    </span>
                }
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
                className="friend_list_modal"
            >
                <div
                    ref={modalContentRef}
                    className="friend-list max-h-[70vh] overflow-y-auto px-2"
                >
                    <div className="grid grid-cols-2 gap-4">
                        {allFriends?.map((item) => (
                            <FriendCard key={item?.friendship?.documentId} item={item.friend} />
                        ))}
                    </div>
                    {isFetchingNextPage && (
                        <div className="flex justify-center my-4">
                            <Spin />
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default ListFriendCard; 