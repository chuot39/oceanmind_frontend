import React, { useMemo, useState, useEffect } from 'react';
import { Card, Avatar, Button, Tag, Modal, Divider } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { handleNavigateToDetail } from '@/views/user/social/shared/actions/actionStore';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import { useLeaveGroup } from '@/views/user/social/shared/actions/mutationHooks';
import { BtnRequestGroup } from '@/components/button/ui';


const GroupsCard = ({ groupList, statusGroupUser, userData, setLocalGroups }) => {
    const navigate = useNavigate();
    const intl = useIntl();

    const { status: leaveGroupStatus, mutate: leaveGroupMutation } = useLeaveGroup();

    console.log('groupList', groupList)

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [leaveModalVisible, setLeaveModalVisible] = useState(false);
    const [groupStatuses, setGroupStatuses] = useState({});

    const showModal = () => setIsModalVisible(true);
    const handleCancel = () => setIsModalVisible(false);
    const handleCloseLeaveModal = () => setLeaveModalVisible(false);

    // Handle status update from child component
    const handleStatusChange = (groupId, newStatus) => {
        setGroupStatuses(prev => ({
            ...prev,
            [groupId]: newStatus
        }));
    };

    const getRoleTagClass = (role) => {
        switch (role.toLowerCase()) {
            case 'leader':
                return 'primary';
            case 'member':
                return 'warning';
            default:
                return 'default';
        }
    };


    const GroupCard = ({ item }) => {
        const isAdmin = item?.group?.creator?.username === userData?.username;
        return (
            <Card className="group_card w-full rounded-2xl overflow-hidden">
                <div className="relative">
                    <div className="h-24 rounded-t-2xl overflow-hidden">
                        <img
                            alt="cover"
                            src={item?.avatar}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Profile Section */}
                    <div className="p-4">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text_first">
                                {item?.name}
                            </h3>
                            <p className="text-sm text_secondary mb-4">
                                {item?.group?.description}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-between items-center mb-4 px-8">
                            <div className="text-center">
                                <div className="font-semibold text_first">
                                    {item?.posts?.length || 0}
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
                            {/* <div className="text-center">
                                <div className="font-semibold text_first">
                                    {item?.joinRequests?.length || 0}
                                </div>
                                <div className="text-sm text_secondary">
                                    <FormattedMessage id="social.group.requests" />
                                </div>
                            </div> */}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="primary"
                                className="flex-1 btn_custom_accept"
                                onClick={() => handleNavigateToDetail({ object: { ...item?.group }, type: 'group', navigate })}
                            >
                                <FormattedMessage id="social.group.access" />
                            </Button>
                            {!isAdmin && (
                                <BtnRequestGroup
                                    group={{
                                        documentId: item?.group?.documentId,
                                        name: item?.group?.name
                                    }}
                                    status="leave_group"
                                    setStatusRequestSend={(newStatus) => handleStatusChange(item?.group?.documentId, newStatus)}
                                    onSuccessLeave={setLocalGroups}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <>
            <Card className="groups-card" loading={statusGroupUser === 'loading'}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="card-title uppercase mb-0">
                        <FormattedMessage id="profile.groups" defaultMessage="GROUP" />
                    </h2>
                    <Tag className="tag-purple tag-purple-hover px-3 py-1 text-sm font-medium cursor-pointer" onClick={showModal}>
                        <FormattedMessage id="profile.view_all_groups" defaultMessage="View all groups" />
                    </Tag>
                </div>
                {groupList && groupList?.length > 0 && groupList?.slice(0, 6)?.map((group, index) => (
                    <div key={index} className="group-item flex items-center justify-between">
                        <div className="flex items-center w-3/5">
                            <Avatar src={group?.avatar} size={40} />
                            <div className="group-info">
                                <div className="text_first text-base font-medium mb-1">{group?.name}</div>
                                <div className="text_secondary">{group?.members} <FormattedMessage id="profile.members" defaultMessage="Members" /></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 w-2/5">
                            <Tag className={`tag-${getRoleTagClass(group?.role)}`}>
                                {group?.role}
                            </Tag>
                            <div className="flex gap-2 items-center">
                                <Button
                                    type="primary"
                                    size="small"
                                    className="btn_custom_accept"
                                    onClick={() => handleNavigateToDetail({ object: { ...group?.groupDetail }, type: 'group', navigate })}
                                >
                                    <FormattedMessage id="social.group.visit" />
                                </Button>
                                {/* {group?.role !== 'Leader' && (
                                    <BtnRequestGroup
                                        group={{
                                            documentId: group?.groupDetail?.documentId,
                                            name: group?.name
                                        }}
                                        status="leave_group"
                                        setStatusRequestSend={(newStatus) => handleStatusChange(group?.groupDetail?.documentId, newStatus)}
                                        onSuccessLeave={setLocalGroups}
                                    />
                                )} */}
                            </div>
                        </div>
                    </div>
                ))}
            </Card>


            <Modal
                title={
                    <>
                        <span className="font-semibold text_first">
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
                        {groupList?.map((item) => (
                            <GroupCard key={item?.groupDetail?.documentId} item={item} />
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
                        onClick={() => {
                            // Implement the logic to leave the group
                        }}
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

export default GroupsCard; 