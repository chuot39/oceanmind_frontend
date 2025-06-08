import React, { useEffect, useState } from 'react';
import { Card, Avatar, Button, Modal, Divider } from 'antd';
import { BsArrowRight } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { handleNavigateToDetail } from '../../shared/actions/actionStore';
import { MdLogout } from 'react-icons/md';
import { useLeaveGroup } from '../../shared/actions/mutationHooks';

const numberGroupShow = 4;

const ListGroupCard = ({ skin, status, groups, userData, refetch }) => {
    const intl = useIntl();
    const navigate = useNavigate();

    const { status: leaveGroupStatus, mutate: leaveGroupMutation } = useLeaveGroup();


    const [isModalVisible, setIsModalVisible] = useState(false);
    const [leaveModalVisible, setLeaveModalVisible] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [localGroups, setLocalGroups] = useState(groups?.data || []);

    console.log('list groups', groups);

    // Update localGroups when groups prop changes
    useEffect(() => {
        if (groups?.data) {
            setLocalGroups(groups.data);
        }
    }, [groups]);

    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);

    const handleOpenLeaveModal = (group) => {
        setSelectedGroup(group);
        setLeaveModalVisible(true);
    };
    const handleCloseLeaveModal = () => setLeaveModalVisible(false);

    const handleLeaveGroup = async () => {
        if (!selectedGroup) return;

        try {
            leaveGroupMutation({
                groupId: selectedGroup?.documentId,
                userId: userData?.documentId
            }, {
                onSuccess: () => {
                    // Cập nhật danh sách nhóm cục bộ bằng cách loại bỏ nhóm vừa rời
                    const updatedGroups = localGroups.filter(
                        (group) => group?.group_id?.documentId !== selectedGroup?.documentId
                    );

                    // Cập nhật state
                    setLocalGroups(updatedGroups);

                    // Đóng modal
                    handleCloseLeaveModal();
                    setSelectedGroup(null);

                    // Nếu có hàm refetch, gọi để cập nhật dữ liệu từ server
                    if (typeof refetch === 'function') {
                        refetch();
                    }
                },
                onError: (error) => {
                    console.error('Error leaving group:', error);
                }
            });
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    const GroupItem = ({ item }) => (
        <div className={`flex items-center justify-between p-2 ${skin === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700'} rounded-lg`}>
            <div className="flex items-center gap-3">
                <Avatar
                    size={40}
                    src={item?.coverImage?.file_path}
                    className="flex-shrink-0 rounded-lg"
                />
                <div className="flex flex-col">
                    <span className="text_first font-medium ">
                        {item?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                        {item?.memberCount || 0} <FormattedMessage id="social.group.members" />
                    </span>
                </div>
            </div>

            <Button
                type="primary"
                size="small"
                className="btn_custom_accept"
                onClick={() => handleNavigateToDetail({ object: { ...item }, type: 'group', navigate })}
            >
                <FormattedMessage id="social.group.visit" />
            </Button>
        </div>
    );

    const GroupCard = ({ item }) => {
        const isAdmin = item?.user_id?.username === userData?.username && item?.isAdmin === true;
        return (
            <Card className={`group_card w-full rounded-2xl overflow-hidden ${skin === 'dark' ? 'bg-[#1a233b] border-gray-700' : 'bg-white'}`}>
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
                            <h3 className="text-lg font-semibold text_first">
                                {item?.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {item?.description}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-between items-center mb-4 px-8">
                            <div className="text-center">
                                <div className="font-semibold text_first">
                                    {item?.postCount || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    <FormattedMessage id="social.post.posts" />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text_first">
                                    {item?.memberCount || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    <FormattedMessage id="social.group.members" />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text_first">
                                    {item?.pendingRequestCount || 0}
                                </div>
                                <div className="text-sm text-gray-500">
                                    <FormattedMessage id="social.group.requests" />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="primary"
                                className="flex-1 btn_custom_accept"
                                onClick={() => handleNavigateToDetail({ object: { ...item }, type: 'group', navigate })}
                            >
                                <FormattedMessage id="social.group.access" />
                            </Button>
                            {!isAdmin && (
                                <Button
                                    type="default"
                                    className="flex-1 btn_custom_reject"
                                    onClick={() => handleOpenLeaveModal(item)}
                                >
                                    <FormattedMessage id="social.group.leave" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <>
            <Card
                title={<span className="text_first font-semibold ">
                    <FormattedMessage id="social.group.joined_groups" />
                </span>}
                className="border-none"
                loading={status === 'loading'}
            >
                <div className="space-y-3">
                    {localGroups?.slice(0, numberGroupShow)?.map((item) => (
                        <GroupItem key={item?.documentId} item={item} />
                    ))}

                    {localGroups?.length > numberGroupShow && (
                        <div className="pt-0 text-center">
                            <Button
                                type="link"
                                onClick={showModal}
                                className="flex items-center gap-2 mx-auto text-blue-500 hover:text-blue-600"
                            >
                                <FormattedMessage id="social.group.view_more" /> <BsArrowRight className="text-lg" />
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            <Modal
                title={
                    <>
                        <span className={`font-semibold ${skin === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            <FormattedMessage id="social.group.joined_groups" />
                        </span>
                        <Divider className='my-1' />
                    </>
                }
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
                className="group_list_modal"
            >
                <div className="group-list max-h-[70vh] overflow-y-auto px-2">
                    <div className="grid grid-cols-2 gap-4">
                        {localGroups?.map((item) => (
                            <GroupCard key={item?.documentId} item={item} />
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Leave Group Modal */}
            <Modal
                title={
                    <div className='flex items-center gap-2'>
                        <MdLogout className='text-red-500 text-lg' />
                        {intl.formatMessage({ id: 'social.group.leave', defaultMessage: 'Leave group' })}
                    </div>
                }
                open={leaveModalVisible}
                onCancel={handleCloseLeaveModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseLeaveModal}>
                        {intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' })}
                    </Button>,
                    <Button
                        key="leave"
                        type="primary"
                        danger
                        loading={leaveGroupStatus === 'loading'}
                        onClick={handleLeaveGroup}
                    >
                        {intl.formatMessage({ id: 'social.group.leave', defaultMessage: 'Leave' })}
                    </Button>
                ]}
            >
                <p>{intl.formatMessage({ id: 'social.group.leave_confirm_message', defaultMessage: 'Are you sure you want to leave this group?' })}</p>
            </Modal>
        </>
    );
};

export default ListGroupCard; 