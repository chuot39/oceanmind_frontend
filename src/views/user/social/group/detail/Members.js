import React, { useEffect, useMemo, useState } from 'react';
import { Card, Avatar, List, Button, Input, Switch, Divider } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useGroupJoinRequest, useGroupMember } from '../hook';
import { useUserData } from '../../../../../utils/hooks/useAuth';
import { BsGrid3X3Gap, BsList, BsSearch, BsPersonAdd } from 'react-icons/bs';
import { handleNoticeAction } from '../../../../../utils/Utils';
import useSkin from '../../../../../utils/hooks/useSkin';
import { useFriend } from '../../../components/hook';
import { SearchOutlined, CheckOutlined, CloseOutlined, UserOutlined } from '@ant-design/icons';
import { useResolveGroupJoinRequest } from '../../shared/actions/mutationHooks';
import { BtnRequestFriend } from '@/components/button/ui';

const { Search } = Input;

const Members = ({ group, userData, detailMember, status }) => {

    const { skin } = useSkin()
    const { data: friends } = useFriend(userData?.documentId);
    const { data: groupJoinRequests, status: groupJoinRequestStatus } = useGroupJoinRequest(group?.documentId);

    const { status: statusRequest, mutate: resolveGroupJoinRequest } = useResolveGroupJoinRequest();

    const adminMembers = detailMember?.filter(member => member?.isAdmin === true);
    const isAdmin = userData?.username === group?.creator?.username;

    const [membersMembers, setMembersMembers] = useState([]);
    // Add state to track friend request statuses
    const [friendStatuses, setFriendStatuses] = useState({});
    const [renderKey, setRenderKey] = useState(0);

    const [viewModeAdmin, setViewModeAdmin] = useState('list'); // 'list' or 'grid'
    const [viewModeMembers, setViewModeMembers] = useState('list'); // 'list' or 'grid'
    const [viewModeRequests, setViewModeRequests] = useState('list'); // 'list' or 'grid'
    const [searchText, setSearchText] = useState('');
    const [memberRequests, setMemberRequests] = useState([]);


    const handleAcceptRequest = (request) => {
        resolveGroupJoinRequest({ requestId: request?.documentId, statusRequest: 'accepted', groupId: group?.documentId, userId: request?.user_request?.documentId }, {
            onSuccess: () => {
                setMemberRequests(prev => prev.filter(req => req.documentId !== request?.documentId));
                setMembersMembers(prev => [...prev, {
                    documentId: request?.user_request?.documentId,
                    isAdmin: false,
                    detailUser: request?.user_request
                }]);
            },
            onError: (error) => {
                console.error("Error accepting request:", error);
                throw error;
            }
        });
    };

    const handleRejectRequest = (requestId) => {
        resolveGroupJoinRequest({ requestId, statusRequest: 'denied' }, {
            onSuccess: () => {
                setMemberRequests(prev => prev.filter(req => req.documentId !== requestId));
            },
            onError: (error) => {
                console.error("Error rejecting request:", error);
                throw error;
            }
        });
    };

    const handleViewProfile = (username) => {
        console.log('View profile:', username);
        // window.location.href = `/profile/${username}`;
    };

    // Handle friend status change
    const handleStatusChange = (memberId, newStatus) => {
        setFriendStatuses(prev => ({
            ...prev,
            [memberId]: newStatus
        }));
        // Force re-render by updating the key
        setRenderKey(prev => prev + 1);
    };

    // Filter and sort members: admins first, then normal members
    const sortedMembers = useMemo(() => {
        if (!detailMember?.data) return [];

        return detailMember.data
            .filter(member =>
                member?.user?.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
                member?.user?.username?.toLowerCase().includes(searchText.toLowerCase())
            )
            .sort((a, b) => {
                if (a.role === 'admin' && b.role !== 'admin') return -1;
                if (a.role !== 'admin' && b.role === 'admin') return 1;
                return 0;
            });
    }, [detailMember?.data, searchText]);

    // Check if a member is a friend
    const isFriend = (memberId) => {
        return friends?.length > 0 && friends?.some(friend => friend?.details?.documentId === memberId);
    };

    const renderRequestListView = () => {
        return (
            <List
                dataSource={memberRequests}
                renderItem={(request) => (
                    <List.Item
                        actions={[
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                loading={statusRequest === 'pending'}
                                className="bg-blue-500"
                                onClick={() => handleAcceptRequest(request)}
                            >
                                <FormattedMessage id="social.group.accept" defaultMessage="Accept" />
                            </Button>,
                            <Button
                                danger
                                loading={statusRequest === 'pending'}
                                icon={<CloseOutlined />}
                                onClick={() => handleRejectRequest(request?.documentId)}
                            >
                                <FormattedMessage id="social.group.reject" defaultMessage="Reject" />
                            </Button>,
                            <Button
                                icon={<UserOutlined />}
                                onClick={() => handleViewProfile(request?.user_request?.username)}
                            >
                                <FormattedMessage id="social.group.view_profile" defaultMessage="View Profile" />
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={request?.user_request?.avatar?.file_path} size={48} />}
                            title={request?.user_request?.fullname}
                            description={`@${request?.user_request?.username}`}
                        />
                    </List.Item>
                )}
            />
        );
    };

    const renderRequestGridView = () => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {memberRequests.map((request) => (
                    <Card key={request?.documentId} className="text-center card_members">
                        <Avatar src={request?.user_request?.avatar?.file_path} size={64} className="mb-2" />
                        <div className="flex flex-col items-center gap-1">
                            <div className="font-medium">{request?.user_request?.fullname}</div>
                            <div className="text-sm text-gray-500">@{request?.user_request?.username}</div>
                            <div className="flex gap-2 mt-3">
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    className="bg-blue-500"
                                    size="small"
                                    onClick={() => handleAcceptRequest(request?.documentId)}
                                >
                                    <FormattedMessage id="social.group.accept" defaultMessage="Accept" />
                                </Button>
                                <Button
                                    danger
                                    icon={<CloseOutlined />}
                                    size="small"
                                    onClick={() => handleRejectRequest(request?.documentId)}
                                >
                                    <FormattedMessage id="social.group.reject" defaultMessage="Reject" />
                                </Button>
                            </div>
                            <Button
                                icon={<UserOutlined />}
                                size="small"
                                className="mt-2"
                                onClick={() => handleViewProfile(request?.user_request?.username)}
                            >
                                <FormattedMessage id="social.group.view_profile" defaultMessage="View Profile" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        );
    };

    useEffect(() => {
        setMembersMembers(detailMember?.filter(member => member?.isAdmin !== true));
    }, [detailMember]);

    const renderListView = (type) => {
        const listMember = type === 'admin' ? adminMembers : membersMembers;
        return (
            <List
                dataSource={listMember}
                renderItem={(member) => (
                    <List.Item
                        actions={[
                            member?.user?.documentId !== userData?.documentId && (
                                isFriend(member?.user?.documentId) ? (
                                    <Button type="primary" size="small" className="bg-blue-500">
                                        <FormattedMessage id="social.friend.chat_now" />
                                    </Button>
                                ) : (
                                    <BtnRequestFriend
                                        key={`${member?.user?.documentId}-${renderKey}-${friendStatuses[member?.user?.documentId] || 'add_friend'}`}
                                        friend={member?.user}
                                        status={friendStatuses[member?.user?.documentId] || 'add_friend'}
                                        setStatusRequestSend={(newStatus) => handleStatusChange(member?.user?.documentId, newStatus)}
                                    />
                                )
                            )
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<Avatar src={member?.user?.avatar?.file_path} size={48} />}
                            title={
                                <div className="flex items-center gap-2">
                                    {member?.user?.fullname}
                                    {member?.role === 'admin' && (
                                        <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                                            <FormattedMessage id="social.group.admin" />
                                        </span>
                                    )}
                                </div>
                            }
                            description={`@${member?.user?.username}`}
                        />
                    </List.Item>
                )}
            />
        );

    };

    const renderGridView = (type) => {
        const listMember = type === 'admin' ? adminMembers : membersMembers;
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listMember.map((member) => (
                    <Card key={member.documentId} className="text-center card_members">
                        <Avatar src={member?.user?.avatar?.file_path} size={64} className="mb-2" />
                        <div className="flex flex-col items-center gap-1">
                            <div className="font-medium flex items-center gap-1">
                                {member?.user?.fullname}
                                {member?.role === 'admin' && (
                                    <span className="text-xs text-blue-500 bg-blue-50 px-1 rounded">
                                        <FormattedMessage id="social.group.admin" />
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-gray-500">@{member?.user?.username}</div>
                            {member?.user?.documentId !== userData?.documentId && (
                                isFriend(member?.user?.documentId) ? (
                                    <Button type="primary" size="small" className="bg-blue-500 mt-2">
                                        <FormattedMessage id="social.friend.chat_now" />
                                    </Button>
                                ) : (
                                    <BtnRequestFriend
                                        key={`${member?.user?.documentId}-${renderKey}-${friendStatuses[member?.user?.documentId] || 'add_friend'}`}
                                        friend={member?.user}
                                        status={friendStatuses[member?.user?.documentId] || 'add_friend'}
                                        setStatusRequestSend={(newStatus) => handleStatusChange(member?.user?.documentId, newStatus)}
                                    />
                                )
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    useEffect(() => {
        setMemberRequests(groupJoinRequests?.data);
    }, [groupJoinRequests]);


    return (
        <>
            {/* Membership Requests Card - Chỉ hiển thị cho admin */}
            {isAdmin && memberRequests && memberRequests?.length > 0 && (
                <Card className="mt-4 mb-4 w-full card_members" loading={groupJoinRequestStatus === 'pending'}>
                    <div className="flex flex-col gap-4">
                        {/* Header with search and view toggle */}
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold m-0">
                                    <FormattedMessage id="social.group.membership_requests" defaultMessage="Membership Requests" /> ({memberRequests?.length})
                                </h2>
                            </div>
                            <div className="flex items-center gap-2 mode_view">
                                <Button
                                    type={viewModeRequests === 'list' ? 'primary' : 'text'}
                                    icon={<BsList />}
                                    onClick={() => setViewModeRequests('list')}
                                />
                                <Button
                                    type={viewModeRequests === 'grid' ? 'primary' : 'text'}
                                    icon={<BsGrid3X3Gap />}
                                    onClick={() => setViewModeRequests('grid')}
                                />
                            </div>
                        </div>

                        {/* Request list/grid */}
                        {viewModeRequests === 'list' ? renderRequestListView() : renderRequestGridView()}
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <Card className=" mt-4 card_members">
                    <div className="flex flex-col gap-4">
                        {/* Header with search and view toggle */}
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold m-0">
                                    <FormattedMessage id="social.group.admin" /> ({adminMembers?.length || 0})
                                </h2>
                            </div>
                            <div className="flex items-center gap-4 w-full justify-between">
                                <Search
                                    placeholder="Search members"
                                    onChange={e => setSearchText(e.target.value)}
                                    className="w-64"
                                />
                                <div className="flex items-center gap-2 mode_view">
                                    <Button
                                        type={viewModeAdmin === 'list' ? 'primary' : 'text'}
                                        icon={<BsList />}
                                        onClick={() => setViewModeAdmin('list')}
                                    />
                                    <Button
                                        type={viewModeAdmin === 'grid' ? 'primary' : 'text'}
                                        icon={<BsGrid3X3Gap />}
                                        onClick={() => setViewModeAdmin('grid')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Member list/grid */}
                        {viewModeAdmin === 'list' ? renderListView('admin') : renderGridView('admin')}
                    </div>
                </Card>

                <Card className="mt-4 card_members">
                    <div className="flex flex-col gap-4">
                        {/* Header with search and view toggle */}
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold m-0">
                                    <FormattedMessage id="social.group.members" /> ({membersMembers?.length || 0})
                                </h2>
                            </div>
                            <div className="flex items-center gap-4  w-full justify-between">
                                <Search
                                    placeholder="Search members"
                                    onChange={e => setSearchText(e.target.value)}
                                    className="w-64"
                                />
                                <div className="flex items-center gap-2 mode_view">
                                    <Button
                                        type={viewModeMembers === 'list' ? 'primary' : 'text'}
                                        icon={<BsList />}
                                        onClick={() => setViewModeMembers('list')}
                                    />
                                    <Button
                                        type={viewModeMembers === 'grid' ? 'primary' : 'text'}
                                        icon={<BsGrid3X3Gap />}
                                        onClick={() => setViewModeMembers('grid')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Member list/grid */}
                        {viewModeMembers === 'list' ? renderListView('members') : renderGridView('members')}
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Members; 