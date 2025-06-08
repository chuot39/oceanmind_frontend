import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Input, Button, Avatar, Tooltip, message, Checkbox, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import { SearchOutlined, CloseOutlined, UserAddOutlined } from '@ant-design/icons';
import { notifyError, notifySuccess } from '@/utils/Utils';
import { useInviteMember } from '../../shared/actions/mutationHooks';
import { useFriend } from '@/views/user/components/hook';


const InviteModal = ({ visible, onClose, group, userData, detailMember }) => {


    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);


    const { mutate: inviteMember, isLoading: isLoadingInvite } = useInviteMember();

    // Fetch friends data
    const { data: listFriends, isLoading: isLoadingFriends } = useFriend(userData?.documentId);
    const allFriends = listFriends?.pages?.flatMap(page => page.data) || [];


    // Extract current member usernames for filtering
    const listCurrentMember = useMemo(() => {
        if (!detailMember) return [];
        return detailMember.map(item => item?.user?.username).filter(Boolean);
    }, [detailMember]);

    console.log('listFriends', listFriends);
    console.log('allFriends', allFriends);
    console.log('listCurrentMember', listCurrentMember);
    console.log('detailMember', detailMember);
    console.log('friends', friends);

    // Update friends state when listFriends changes
    useEffect(() => {
        if (allFriends && Array.isArray(allFriends)) {
            const formattedFriends = allFriends?.map(item => ({
                id: item?.friend?.documentId,
                username: item?.friend?.username,
                name: item?.friend?.fullname || item?.friend?.username,
                avatar: item?.friend?.avatar?.file_path
            }));
            setFriends(formattedFriends);
        }
    }, [listFriends]);

    // Filter friends based on search term
    const filteredFriends = useMemo(() => {
        return friends.filter(friend =>
            friend?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [friends, searchTerm]);

    // Get selected friends objects
    const selectedFriendsObjects = useMemo(() => {
        return friends.filter(friend => selectedFriends.includes(friend.id));
    }, [friends, selectedFriends]);

    // Handle friend selection
    const handleFriendSelect = (friendId) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter(id => id !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
    };

    // Handle removing a friend from selection
    const handleRemoveFriend = (friendId) => {
        setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Show confirmation modal
    const showConfirmModal = () => {
        if (selectedFriends.length === 0) {
            message.warning('Vui lòng chọn ít nhất một người bạn để mời');
            return;
        }
        setConfirmModalVisible(true);
    };

    // Send invitations
    const sendInvitations = async () => {
        setIsLoading(true);
        try {
            // Mock API call - replace with actual API call in production

            inviteMember({ groupId: group?.documentId, memberIds: selectedFriends, userId: userData?.documentId },
                {
                    onSuccess: () => {
                        const selectedFriendsNames = friends
                            .filter(friend => selectedFriends.includes(friend.id))
                            .map(friend => friend.name);

                        notifySuccess(`Đã gửi lời mời thành công đến ${selectedFriendsNames.join(', ')}`);
                        setConfirmModalVisible(false);
                        onClose();
                        setIsLoading(false); // Reset loading state on success
                    },
                    onError: (error) => {
                        console.error('Error sending invitations:', error);
                        notifyError(error?.response?.data?.message || 'Không thể gửi lời mời. Vui lòng thử lại sau.');
                        setIsLoading(false); // Reset loading state on error
                        setConfirmModalVisible(false); // Close modal on error
                    }
                }
            );
        } catch (error) {
            console.error('Error sending invitations:', error);
            notifyError(error?.response?.data?.message || 'Không thể gửi lời mời. Vui lòng thử lại sau.');
            setIsLoading(false); // Reset loading state on catch error
            setConfirmModalVisible(false); // Close modal on error
        }
    };

    // Reset state when modal is closed
    useEffect(() => {
        if (!visible) {
            setSearchTerm('');
            setSelectedFriends([]);
        }
    }, [visible]);

    return (
        <>
            {/* Main Invite Modal */}
            <Modal
                title={<FormattedMessage id="social.group.invite_friends" defaultMessage="Invite Friends to Group" />}
                open={visible}
                onCancel={onClose}
                footer={null}
                width={800}
                className="invite-modal"
            >
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">
                        <FormattedMessage id="social.group.invite_to" defaultMessage="Invite to" /> {group?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                        <FormattedMessage id="social.group.invite_description" defaultMessage="Select friends to invite to this group" />
                    </p>
                </div>

                {isLoadingFriends ? (
                    <div className="flex justify-center items-center py-8">
                        <Spin size="large" />
                    </div>
                ) : (
                    <div className="flex gap-4">
                        {/* Left side - Search and All Friends List */}
                        <div className="w-1/2">
                            {/* Search Input */}
                            <div className="mb-4 relative">
                                <Input
                                    placeholder="Tìm bạn bè theo tên"
                                    prefix={<SearchOutlined />}
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full"
                                    allowClear
                                />
                            </div>

                            {/* Selected Count */}
                            {selectedFriends.length > 0 && (
                                <div className="mb-2 text-sm text-primary">
                                    <FormattedMessage
                                        id="social.group.selected_friends"
                                        defaultMessage="Selected {count} friends"
                                        values={{ count: selectedFriends.length }}
                                    />
                                </div>
                            )}

                            {/* Friends List */}
                            <div className="max-h-80 overflow-y-auto mb-4 border rounded-md">
                                {filteredFriends.length > 0 ? (
                                    filteredFriends.map(friend => (
                                        <div
                                            key={friend.id}
                                            className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer border-b last:border-b-0"
                                            onClick={() => handleFriendSelect(friend.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar src={friend.avatar} size="large" />
                                                <span className="font-medium">{friend.name}</span>
                                            </div>
                                            <Checkbox checked={selectedFriends.includes(friend.id)} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        <FormattedMessage id="social.group.no_friends_found" defaultMessage="No friends found" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right side - Selected Friends */}
                        <div className="w-1/2">
                            <div className="mb-4">
                                <h4 className="font-medium mb-2">
                                    <FormattedMessage id="social.group.selected_friends_title" defaultMessage="Selected Friends" />
                                    ({selectedFriends.length})
                                </h4>
                            </div>

                            <div className="max-h-80 overflow-y-auto mb-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                                {selectedFriendsObjects.length > 0 ? (
                                    selectedFriendsObjects.map(friend => (
                                        <div
                                            key={friend.id}
                                            className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md border-b last:border-b-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar src={friend.avatar} size="large" />
                                                <span className="font-medium">{friend.name}</span>
                                            </div>
                                            <Button
                                                type="text"
                                                icon={<CloseOutlined />}
                                                className="text-gray-500 hover:text-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveFriend(friend.id);
                                                }}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        <FormattedMessage id="social.group.no_selected_friends" defaultMessage="No friends selected yet" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={onClose}>
                        <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
                    </Button>
                    <Button
                        type="primary"
                        onClick={showConfirmModal}
                        disabled={selectedFriends.length === 0 || isLoadingFriends}
                        icon={<UserAddOutlined />}
                        className="btn_custom_accept"
                    >
                        <FormattedMessage id="social.group.send_invites" defaultMessage="Send Invites" />
                    </Button>
                </div>
            </Modal>

            {/* Confirmation Modal */}
            <Modal
                title={<FormattedMessage id="social.group.confirm_invite" defaultMessage="Confirm Invitation" />}
                open={confirmModalVisible}
                onCancel={() => setConfirmModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setConfirmModalVisible(false)}>
                        <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={isLoading}
                        onClick={sendInvitations}
                        className="btn_custom_accept"
                    >
                        <FormattedMessage id="social.group.confirm" defaultMessage="Confirm" />
                    </Button>,
                ]}
                width={400}
            >
                <p>
                    <FormattedMessage
                        id="social.group.confirm_invite_message"
                        defaultMessage="Are you sure you want to invite {count} friends to {groupName}?"
                        values={{
                            count: selectedFriends.length,
                            groupName: group?.name
                        }}
                    />
                </p>
                <div className="mt-4 max-h-40 overflow-y-auto">
                    {selectedFriends.length > 0 && (
                        <div className="space-y-2">
                            {friends
                                .filter(friend => selectedFriends.includes(friend.id))
                                .map(friend => (
                                    <div key={friend.id} className="flex items-center gap-2">
                                        <Avatar src={friend.avatar} size="small" />
                                        <span>{friend.name}</span>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default InviteModal; 