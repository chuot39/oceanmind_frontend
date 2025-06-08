import { useUserData } from "@/utils/hooks/useAuth";
import { FormattedMessage, useIntl } from "react-intl";
import { UserAddOutlined } from '@ant-design/icons';
import { useEffect, useState } from "react";
import { Avatar, Badge, Button, Drawer, Form, List, Tag, Tooltip } from "antd";
import { BsPersonFill } from "react-icons/bs";
import { handleNavigateToDetailProfile } from "@/views/user/social/shared/actions/actionStore";
import { useNavigate } from "react-router-dom";
import { BsChatDotsFill, BsDoorOpenFill, BsListTask } from "react-icons/bs";
import { BsCalendar } from "react-icons/bs";
import { formatDate } from "@/utils";
import { useUpdateMembersProject } from "../mutationHooks";
import MemberMultipleSelect from "@/components/elements/MemberMultipleSelect";
import { handleNavigateToChat } from "@/views/user/stores/actions/friendActions";
import { useCreateConversation } from "@/views/user/stores/actions/friendHook";
import ModalConfirm from "@/views/user/components/ModalConfirm";
import studyService from "@/services/api/studyService";
import { notifyError, notifySuccess } from "@/utils/Utils";
import { getRoleTagColor } from "@/helpers/colorHelper";


const ListMemberProject = ({ project, onClose, refetchProjectUser, isLeader }) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { userData } = useUserData();

    const [loading, setLoading] = useState(false);
    const [listMember, setListMember] = useState([]);
    const [showAddMember, setShowAddMember] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const { mutate: createConversationAsync, isLoading: isLoadingCreateConversation } = useCreateConversation();
    const { mutate: updateMembersProject, status: statusUpdateMembersProject } = useUpdateMembersProject();


    const handleViewProfile = (member) => {
        handleNavigateToDetailProfile({ username: member?.username, navigate });
    };

    const handleChat = (member) => {
        handleNavigateToChat({ friend: member, userData, navigate, createConversationAsync, setLoading });
    };

    const handleResolveModal = async ({ objNeedConfirm, type }) => {
        if (type === 'leave_project') {
            setModalLoading(true);
            try {
                // Get the project member record for the current user
                const response = await studyService.getProjectMembers({
                    projectId: project?.documentId,
                    userId: userData?.documentId
                });

                if (response?.data?.length === 1) {
                    // Remove the user from the project
                    await studyService.removeMembersFromProject({
                        documentId: response?.data[0]?.documentId
                    });

                    notifySuccess(intl.formatMessage({
                        id: 'learning.learn_exercise.leave_project_success',
                        defaultMessage: 'You have successfully left the project'
                    }));

                    // Navigate back or refresh the project list
                    // navigate(-1);
                    refetchProjectUser();

                    onClose();
                } else {
                    throw new Error('Member not found in project');
                }
            } catch (error) {
                console.error("Error leaving project:", error);
                notifyError(intl.formatMessage({
                    id: 'learning.learn_exercise.leave_project_failed',
                    defaultMessage: 'Failed to leave the project'
                }));
            } finally {
                setModalLoading(false);
            }
        }
    };

    const handleLeaveProject = (member) => {
        ModalConfirm({
            typeModal: 'leave_project',
            objNeedConfirm: {
                name: project?.name || intl.formatMessage({ id: 'learning.learn_exercise.this_project', defaultMessage: 'this project' })
            },
            handleResolve: handleResolveModal,
            loading: modalLoading
        });
    };

    const handleAddMember = (values) => {
        updateMembersProject({ documentId: project?.documentId, newData: values, oldData: project },
            {
                onSuccess: () => {
                    setShowAddMember(false);
                    refetchProjectUser();
                    onClose();
                },
                onError: () => {
                    // Close the member drawer on error
                    // Error toast will be shown by the hook's onError callback
                    setShowAddMember(false);
                }
            }
        );
    };

    const isCurrentUser = (member) => {
        return member?.username === userData?.username;
    };


    // Cập nhật listMember khi project thay đổi
    useEffect(() => {
        if (project?.members?.length > 0) {
            const members = project.members
                .filter(member => member?.user)
                .map(member => member.user);
            setListMember(members);

            // Nếu form đang mở, cập nhật giá trị form
            if (showAddMember) {
                form.setFieldsValue({ members: members });
            }
        } else {
            setListMember([]);
        }
    }, [project, form, showAddMember]);

    // Khởi tạo form khi drawer mở
    useEffect(() => {
        if (showAddMember && listMember?.length > 0) {
            form.setFieldsValue({ members: listMember });
        }
    }, [showAddMember, listMember, form]);

    return (
        <div className="members-section">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text_first mb-1">
                        <FormattedMessage id="learning.learn_exercise.team_members" />
                    </h3>
                    <p className="text-sm text_secondary">
                        {project?.members?.length || 0} <FormattedMessage id="learning.learn_exercise.members" />
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={() => setShowAddMember(true)}
                >
                    <FormattedMessage id="learning.learn_exercise.update_member" />
                </Button>
            </div>

            {/* Members List */}
            <List
                dataSource={project?.members || []}
                renderItem={member => (
                    <List.Item
                        className="my-5 custom_list rounded-lg !p-4 hover:shadow-md transition-all"
                        actions={[
                            <Tooltip title={<FormattedMessage id="learning.learn_exercise.view_profile" />}>
                                <Button
                                    type="text"
                                    className='btn_custom_accept'
                                    icon={<BsPersonFill className='text_first' />}
                                    onClick={() => handleViewProfile(member?.user)}
                                />
                            </Tooltip>,
                            <Tooltip title={<FormattedMessage id="learning.learn_exercise.chat_now" />}>
                                <Button
                                    type="text"
                                    className='btn_custom_accept'
                                    icon={<BsChatDotsFill className='text_first' />}
                                    onClick={() => handleChat(member?.user)}
                                    loading={loading || isLoadingCreateConversation}
                                />
                            </Tooltip>,
                            isCurrentUser(member?.user) && (
                                <Tooltip title={isLeader ? <FormattedMessage id="learning.learn_exercise.you_are_leader" /> : <FormattedMessage id="learning.learn_exercise.leave_project" />}>
                                    <Button
                                        type="text"
                                        danger
                                        className='tag-error'
                                        icon={<BsDoorOpenFill className='tag-error' />}
                                        onClick={() => handleLeaveProject(member?.user)}
                                        loading={modalLoading}
                                        disabled={isLeader}
                                    />
                                </Tooltip>
                            )
                        ]}
                    >
                        <List.Item.Meta
                            avatar={
                                <Badge
                                    dot
                                    status={member?.isOnline ? 'success' : 'red'}
                                    offset={[-6, 28]}
                                >
                                    <Avatar
                                        src={member?.user?.avatar?.file_path}
                                        size={45}
                                        className="border-2 border-white shadow-sm"
                                    />
                                </Badge>
                            }
                            title={
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text_first">{member?.user?.fullname}</span>
                                    {/* {member?.detail_member_project?.role && ( */}
                                    <Tag
                                        className={`${getRoleTagColor(project?.project?.leader?.documentId === member?.user?.documentId ? 'leader' : 'member')} m-0`}
                                    >
                                        {project?.project?.leader?.documentId === member?.user?.documentId ? 'Leader' : 'Member'}
                                    </Tag>
                                    {/* )} */}
                                </div>
                            }
                            description={
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="flex items-center gap-2 text_secondary">
                                        <BsCalendar className="text-red-400" />
                                        <span> <FormattedMessage id="learning.learn_exercise.joinedAt" />: {formatDate(member?.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text_secondary">
                                        <BsListTask className="text-gray-400" />
                                        <span>{project?.project_tasks?.filter(item => item?.taskAssignedTo?.documentId === member?.user?.documentId)?.length || 0} <FormattedMessage id="learning.learn_exercise.tasks_assigned" /></span>
                                    </div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />

            {/* Add Member Drawer */}
            <Drawer
                title={<FormattedMessage id="learning.learn_exercise.update_member" />}
                open={showAddMember}
                onClose={() => {
                    setShowAddMember(false);
                    form.resetFields();
                }}
                width={400}
                className="member_drawer"
            >
                <Form
                    onFinish={handleAddMember}
                    layout="vertical"
                    className="px-2"
                    form={form}
                    initialValues={{ members: listMember }}
                >
                    <Form.Item
                        name="members"
                        label={<FormattedMessage id="learning.learn_exercise.select_member" />}
                        rules={[{ required: true }]}
                    >
                        <MemberMultipleSelect
                            value={form.getFieldValue('members') || []}
                            onChange={(selectedMembers) => {
                                form.setFieldsValue({ members: selectedMembers });
                            }}
                            placeholder={intl.formatMessage({ id: 'learning.learn_exercise.select_member_placeholder' })}
                            mode="multiple"
                        />
                    </Form.Item>

                    <Button loading={statusUpdateMembersProject === 'loading'} type="primary" htmlType="submit" block className="btn_custom_accept">
                        <FormattedMessage id="common.update" />
                    </Button>
                </Form>
            </Drawer>
        </div>
    );
}

export default ListMemberProject;
