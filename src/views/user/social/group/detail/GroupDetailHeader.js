import { Avatar, Button, Card, Divider, Dropdown, Image, Tabs, Tooltip, Modal, Spin } from "antd"
import { FormattedMessage, useIntl } from "react-intl";
import { useGroupMember, useGroupMemberRequest, useNotificationGroup } from "../hook";
import { GlobalOutlined, UserOutlined, ShareAltOutlined, UserAddOutlined } from '@ant-design/icons';
import { SiPrivateinternetaccess } from 'react-icons/si';
import { GrGroup } from "react-icons/gr";
import { FaCaretDown } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import About from "./About";
import Discussion from "./Discussion";
import Media from "./Media";
import Members from "./Members";
import InviteModal from "../components/InviteModal";
import { GoReport } from "react-icons/go";
import { MdLogout } from "react-icons/md";
import ReportModal from "@/views/user/components/ReportModal";
import { useJoinGroup, useLeaveGroup, useRequestJoinGroup, useUpdateNotification } from "../../shared/actions/mutationHooks";
import { useNavigate } from "react-router";
import Hamster from "@/components/loader/Hamster/Hamster";
import { useQueryClient } from "react-query";
import Toggle from "@/components/button/Toggle";
import SwitchTheme from "@/components/button/SwitchTheme";
import SwitchCheck from "@/components/button/Switch/SwitchCheck";
import Loading from "@/components/loader/Loading";

const GroupDetailHeader = ({ group, userData }) => {
    const intl = useIntl();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { status: userRequestStatus, data: userRequest } = useGroupMemberRequest(group?.documentId, userData?.username);
    // const { status: detailMembersStatus, data: detailMember, refetch: refetchMembers } = useGroupMember(group?.documentId);
    const { status: notificationStatus, data: notificationGroup } = useNotificationGroup(group?.documentId, userData?.documentId);

    const { status: updateNotificationStatus, mutate: updateNotificationAsync } = useUpdateNotification();
    const { status: requestJoinGroupStatus, mutate: requestJoinGroupAsync } = useRequestJoinGroup();
    const { status: joinGroupStatus, mutate: joinGroupAsync } = useJoinGroup();
    const leaveGroupMutation = useLeaveGroup();

    const detailMember = useMemo(() => group?.group_members, [group]);

    console.log('detailMember', detailMember);
    // Xác định isMember dựa trên dữ liệu detailMember
    const [isMember, setIsMember] = useState(false);

    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [leaveModalVisible, setLeaveModalVisible] = useState(false);
    const [leaveLoading, setLeaveLoading] = useState(false);
    const [isRequestedJoin, setIsRequestedJoin] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Mặc định activeTab dựa vào isMember
    const [activeTab, setActiveTab] = useState('about');

    // Kiểm tra xem đã tải xong dữ liệu thành viên chưa
    const isLoadingMemberData = userRequestStatus === 'loading';

    // Chỉ cập nhật activeTab một lần sau khi dữ liệu đã được tải
    useEffect(() => {
        if (userRequestStatus === 'success') {
            setActiveTab(isMember ? 'discussion' : 'about');
        }
    }, [userRequestStatus, isMember]);

    useEffect(() => {
        if (userRequestStatus === 'success') {
            setIsRequestedJoin(userRequest?.data?.length > 0);
        }
    }, [userRequestStatus]);

    useEffect(() => {
        if (notificationStatus === 'success') {
            setNotificationsEnabled(notificationGroup?.data?.length > 0);
        }

    }, [notificationStatus, notificationGroup]);

    useEffect(() => {
        if (userRequestStatus === 'success') {
            setIsMember(detailMember?.some(member => member?.user?.username === userData?.username));
        }
    }, [userRequestStatus, detailMember, userData]);

    const handleOpenLeaveModal = () => {
        setLeaveModalVisible(true);
        setDropdownOpen(false);
    };

    const handleCloseLeaveModal = () => {
        setLeaveModalVisible(false);
    };

    const handleLeaveGroup = async () => {
        try {
            setLeaveLoading(true);
            await leaveGroupMutation.mutateAsync({ groupId: group?.documentId, userId: userData?.documentId });

            navigate('/social/group')

            setLeaveLoading(false);
            setLeaveModalVisible(false);
        } catch (error) {
            console.error('Error leaving group:', error);
            setLeaveLoading(false);
        }
    };

    // Xử lý chuyển đổi thông báo mà không đóng dropdown
    const handleNotificationToggle = (e) => {
        e.stopPropagation();
        updateNotificationAsync({ documentId: notificationGroup?.data[0]?.documentId, groupId: group?.documentId, userId: userData?.documentId, isEnabled: !notificationsEnabled },
            {
                onSuccess: () => {
                    setNotificationsEnabled(!notificationsEnabled);
                    console.log("Notifications toggled:", !notificationsEnabled);
                },
                onError: (error) => {
                    console.error("Error updating notification:", error);
                }
            }
        );
        // TODO: Gọi API để cập nhật trạng thái thông báo
        console.log("Notifications toggled:", !notificationsEnabled);
    };

    const dropdownItems = [
        {
            key: 'notifications',
            label: (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {notificationStatus === 'loading' ? <Loading /> :
                        <SwitchCheck
                            value={notificationsEnabled}
                            onChange={handleNotificationToggle}
                        />
                    }
                    <FormattedMessage id="social.group.turn_on_notifications" />
                </div>
            )
        },
        // {
        //     key: 'unfollow',
        //     label: <FormattedMessage id="social.group.unfollow" />
        // },
        {
            type: 'divider',
            label: <div>  <Divider /> </div>
        },
        {
            key: 'leave',
            label:
                <div className='flex items-center gap-2 text_danger' onClick={handleOpenLeaveModal}>
                    <MdLogout className='text-red-500 text-lg' />
                    {intl.formatMessage({ id: 'social.group.leave', defaultMessage: 'Leave group' })}
                </div>
        },
        {
            type: 'divider'
        },
        {
            key: 'report',
            label:
                <div className='flex items-center gap-2 text_warning' onClick={() => handleOpenReportModal()}>
                    <GoReport className='text-orange-500 text-lg' />
                    {intl.formatMessage({ id: 'social.post.report', defaultMessage: 'Report post' })}
                </div>
        }
    ];

    const items = [
        {
            label: <FormattedMessage id="social.group.tabs.about" />,
            key: 'about',
        },
        {
            label: <FormattedMessage id="social.group.tabs.discussion" />,
            key: 'discussion',
            disabled: !isMember
        },
        {
            label: <FormattedMessage id="social.group.tabs.members" />,
            key: 'members',
            disabled: !isMember
        },
        {
            label: <FormattedMessage id="social.group.tabs.media" />,
            key: 'media',
            disabled: !isMember
        }
    ];

    // Handle opening the invite modal
    const handleOpenInviteModal = () => {
        setInviteModalVisible(true);
    };

    // Handle closing the invite modal
    const handleCloseInviteModal = () => {
        setInviteModalVisible(false);
    };

    const handleOpenReportModal = () => {
        setReportModalVisible(true);
        setDropdownOpen(false);
    };

    const handleCloseReportModal = () => {
        setReportModalVisible(false);
    };

    const handleJoinGroup = () => {
        try {
            if (group?.isPublic === true) {
                joinGroupAsync({ groupId: group.documentId, userId: userData.documentId }, {
                    onSuccess: () => {
                        // Cập nhật state cục bộ ngay lập tức
                        setIsMember(true);
                        setActiveTab('discussion');

                        // Làm mới tất cả các truy vấn liên quan
                        queryClient.invalidateQueries(['query-group-by-id', group.documentId]);
                        queryClient.invalidateQueries(['query-group-member', group.documentId]);
                        queryClient.invalidateQueries(['query-joined-group']);
                        queryClient.invalidateQueries(['post-group', group.documentId]);

                        // Gọi refetch để cập nhật dữ liệu thành viên
                        refetchMembers();

                        // Thêm thành viên mới vào danh sách thành viên cục bộ
                        if (detailMember) {
                            const newMember = {
                                documentId: Date.now().toString(), // Tạm thời dùng timestamp làm ID
                                user: {
                                    username: userData.username,
                                    documentId: userData.documentId
                                },
                                detailUser: userData,
                                isAdmin: false
                            };

                            // Cập nhật cache của react-query
                            queryClient.setQueryData(['query-group-member', group.documentId], old => {
                                if (!old) return { data: [newMember] };
                                return {
                                    ...old,
                                    data: [...old.data, newMember]
                                };
                            });
                        }
                    },
                    onError: (error) => {
                        console.error('Error joining group:', error);
                    }
                });
            } else {
                requestJoinGroupAsync({ groupId: group.documentId, userId: userData.documentId }, {
                    onSuccess: () => {
                        setIsRequestedJoin(true);
                        // Làm mới truy vấn yêu cầu tham gia
                        queryClient.invalidateQueries(['query-group-member-request', group.documentId, userData.username]);
                    },
                    onError: (error) => {
                        setIsRequestedJoin(false);
                        console.error('Error requesting to join group:', error);
                    }
                });
            }
        } catch (error) {
            console.error('Error joining group:', error);
        }
    }

    // Hiển thị loading khi đang tải dữ liệu thành viên
    if (isLoadingMemberData) {
        return (
            <div className="flex justify-center items-center h-[75vh]">
                <Hamster size="large" tip="Đang tải thông tin nhóm..." />
            </div>
        );
    }

    return (
        <>
            <Card className="group-detail-header">
                {/* Cover Image */}
                <div className=" h-[250px] overflow-hidden">
                    <Image
                        src={group?.coverImage?.file_path}
                        alt={group?.name}
                        className="object-fill"
                        preview={false}
                    />
                </div>

                {/* Group Info Section */}
                <div className="px-8 pb-4 pt-3 flex flex-col gap-4">
                    {/* Group Details */}
                    <div className="flex-1  z-10">
                        <h1 className="text-3xl font-bold mb-2">
                            {group?.name}
                        </h1>
                        <div className="flex items-center gap-4  text-sm">
                            <span className="flex items-center gap-1">
                                {group?.isPublic ? (
                                    <>
                                        <GlobalOutlined /> <FormattedMessage id="social.group.public" />
                                    </>
                                ) : (
                                    <>
                                        <SiPrivateinternetaccess /> <FormattedMessage id="social.group.private" />
                                    </>
                                )}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <UserOutlined /> {detailMember?.length || 0} <FormattedMessage id="social.group.members" />
                            </span>
                        </div>
                    </div>

                    <div className="">
                        <Avatar.Group
                            size="large"
                            max={{
                                count: 40,
                            }}>
                            {detailMember?.map((member) => (
                                <Tooltip key={member?.user?.documentId} title={member?.user?.fullname}>
                                    <Avatar
                                        src={member?.user?.avatar?.file_path}
                                    />
                                </Tooltip>
                            ))}
                        </Avatar.Group>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 justify-end">
                        {isMember && (
                            <>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<UserAddOutlined />}
                                    className="flex items-center invite-btn btn_custom_accept"
                                    onClick={handleOpenInviteModal}
                                >
                                    <FormattedMessage id="social.group.invite" />
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ShareAltOutlined />}
                                    className="flex items-center share-btn"
                                >
                                    <FormattedMessage id="social.group.share" />
                                </Button>
                                <Dropdown
                                    menu={{ items: dropdownItems }}
                                    trigger={['click']}
                                    placement="bottomRight"
                                    open={dropdownOpen}
                                    onOpenChange={setDropdownOpen}
                                >
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<GrGroup />}
                                        className="flex items-center share-btn"
                                    >
                                        <FormattedMessage id="social.group.joined" />
                                        <FaCaretDown />
                                    </Button>
                                </Dropdown>
                            </>
                        )}

                        {!isMember && (
                            <Button
                                type="primary"
                                size="large"
                                className="flex items-center btn_custom_accept"
                                onClick={handleJoinGroup}
                                disabled={isRequestedJoin}
                                loading={requestJoinGroupStatus === 'pending' || joinGroupStatus === 'pending'}
                            >
                                {isRequestedJoin ? <FormattedMessage id="social.group.requested" defaultMessage="Requested" /> : <FormattedMessage id="social.group.join" defaultMessage="Join Group" />}

                            </Button>
                        )}
                    </div>

                    <Divider className="m-0" />

                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={items}
                    />
                </div>

            </Card>

            {activeTab === 'about' && <About group={group} userData={userData} detailMember={detailMember} />}
            {activeTab === 'discussion' && <Discussion group={group} userData={userData} />}
            {activeTab === 'members' && <Members group={group} userData={userData} detailMember={detailMember} />}
            {activeTab === 'media' && <Media group={group} />}

            {/* Invite Modal */}
            <InviteModal
                visible={inviteModalVisible}
                onClose={handleCloseInviteModal}
                group={group}
                userData={userData}
                detailMember={detailMember}
            />

            <ReportModal
                visible={reportModalVisible}
                onClose={handleCloseReportModal}
                objReport={group}
                userData={userData}
                intl={intl}
                reportType='group'
                title={intl.formatMessage({ id: 'support.report.group', defaultMessage: 'Report group' })}
            />

            {/* Leave Group Modal */}
            <Modal
                title={
                    <div className='flex items-center gap-2' onClick={handleOpenLeaveModal}>
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
                        loading={leaveLoading}
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

export default GroupDetailHeader;
