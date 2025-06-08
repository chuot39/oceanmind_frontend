import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, DatePicker, Select, Button, Space, Upload, Switch } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import SubjectSelect from '@/components/elements/SubjectSelect';
import dayjs from 'dayjs'; // Import dayjs for date handling
import MemberMultipleSelect from '@/components/elements/MemberMultipleSelect';
import { useCreateProject, useUpdateProject } from '../mutationHooks';
import { useUserData } from '@/utils/hooks/useAuth';

const { TextArea } = Input;
const { Option } = Select;

const ProjectDrawer = ({ visible, onClose, project, mode = 'add', onCloseDetailDrawer, refetchProjectUser }) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const { userData } = useUserData();

    const [isMarkIsCompleted, setIsMarkIsCompleted] = useState(false);
    const [listLeaderSelect, setListLeaderSelect] = useState([]);

    const { mutate: updateProject, status: statusUpdateProject } = useUpdateProject();
    const { mutate: createProject, status: statusCreateProject } = useCreateProject();

    const handleSubmit = (values) => {

        const data = {
            ...values,
            leader_project_id: values?.leader_project_id,
            project_members: values?.project_members,
            due_date: values?.due_date ? dayjs(values?.due_date).format('YYYY-MM-DD') : undefined,
            project_completed_on: isMarkIsCompleted && values?.project_completed_on
                ? dayjs(values?.project_completed_on).format('YYYY-MM-DD')
                : isMarkIsCompleted ? dayjs().format('YYYY-MM-DD') : null,
        }

        if (project) {
            updateProject({ documentId: project?.documentId, newData: data, oldData: project },
                {
                    onSuccess: () => {
                        refetchProjectUser()
                        handleClose()
                    },
                    onError: (error) => {
                        console.error('Error updating project:', error);
                    }
                }
            );
        } else {
            createProject(data,
                {
                    onSuccess: () => {
                        refetchProjectUser()
                        handleClose()
                    },
                    onError: (error) => {
                        console.error('Error creating project:', error);
                    }
                }
            );
        }
    };

    const handleClose = () => {
        form.resetFields();
        onClose();
        onCloseDetailDrawer();
    };

    // Hàm vô hiệu hóa ngày trong DatePicker cho project_completed_on
    const disableCompletionDates = (current) => {
        // Trả về true nếu ngày bị disable
        if (!current) return false;

        // Vô hiệu hóa các ngày trước ngày hiện tại (luôn cho phép chọn từ hôm nay trở đi)
        return current.isBefore(dayjs().startOf('day'));
    };

    // Hàm vô hiệu hóa ngày trong DatePicker cho due_date
    const disableDueDates = (current) => {
        // Trả về true nếu ngày bị disable
        if (!current) return false;

        // Vô hiệu hóa các ngày trước ngày hiện tại
        return current.isBefore(dayjs().startOf('day'));
    };

    const handleMarkIsCompleted = (checked) => {
        setIsMarkIsCompleted(checked);
    }


    // Cập nhật form khi project thay đổi và drawer hiển thị
    useEffect(() => {

        if (project) {
            setListLeaderSelect(project?.project_member?.map(member => {
                return {
                    label: member?.user?.fullname,
                    value: member?.user?.documentId
                }
            }));
        }

        if (visible) {
            if (project) {
                // Convert dates using dayjs for antd DatePicker
                const formValues = {
                    ...project?.project,
                    subject_id: project?.project?.subject,
                    due_date: project?.project?.due_date ? dayjs(project?.project?.due_date) : undefined,
                    project_completed_on: project?.project?.project_completed_on ? dayjs(project?.project?.project_completed_on) : undefined,
                    leader_project_id: {
                        value: project?.project?.leader?.documentId,
                        label: project?.project?.leader?.fullname
                    },
                    project_members: project?.project_member?.map(member => member?.user)
                };

                form.setFieldsValue(formValues);

                // Set completed state if project has completion date
                setIsMarkIsCompleted(project?.project?.project_completed_on !== null);
            } else {
                // Khi tạo mới, đặt giá trị mặc định cho leader_project_id và project_members
                form.setFieldsValue({
                    leader_project_id: userData,
                    project_members: [userData]
                });
            }
        }

    }, [project, form, visible, userData]);

    // Chỉ render form khi drawer hiển thị
    if (!visible) {
        return null;
    }

    return (
        <Drawer
            title={
                project
                    ? <FormattedMessage id="learning.learn_exercise.edit_project" />
                    : <FormattedMessage id="learning.learn_exercise.add_project" />
            }
            width={600}
            open={visible}
            onClose={handleClose}
            destroyOnClose={true}
            extra={
                <div style={{ textAlign: 'right' }}>
                    <Space>
                        <Button onClick={handleClose}>
                            <FormattedMessage id="common.cancel" />
                        </Button>
                        <Button
                            loading={statusUpdateProject === 'loading' || statusCreateProject === 'loading'}
                            type="primary"
                            onClick={() => form.submit()}>
                            {project
                                ? <FormattedMessage id="common.update" />
                                : <FormattedMessage id="common.create" />
                            }
                        </Button>
                    </Space>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                preserve={false}
            >

                {/* name */}
                <Form.Item
                    name="name"
                    label={<FormattedMessage id="learning.learn_exercise.project_name" />}
                    rules={[{ required: true, message: intl.formatMessage({ id: 'learning.learn_exercise.name_required' }) }]}
                >
                    <Input />
                </Form.Item>

                <div className="flex gap-4">

                    {/* subject */}
                    <Form.Item
                        className='flex-1 mb-4'
                        name="subject_id"
                        label={<FormattedMessage id="learning.learn_exercise.subject" />}
                        rules={[{ required: true, message: intl.formatMessage({ id: 'learning.learn_exercise.subject_required' }) }]}
                    >
                        <SubjectSelect
                            value={form.getFieldValue('subject_id') || project?.project?.subject}
                            onChange={(value) => form.setFieldsValue({ subject: value })}
                            placeholder={intl.formatMessage({ id: 'learning.learn_exercise.subject_placeholder' })}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    {/* due_date */}
                    <Form.Item
                        className='flex-1 mb-4'
                        name="due_date"
                        label={<FormattedMessage id="learning.learn_exercise.due_date" />}
                        rules={[{ required: true, message: 'Please select due date!' }]}
                    >
                        <DatePicker
                            className="w-full"
                            format='DD/MM/YYYY'
                            disabledDate={disableDueDates}
                        />
                    </Form.Item>
                </div>


                <div className="flex gap-4">

                    {/* leader_project_id */}
                    <Form.Item
                        name="leader_project_id"
                        label={<FormattedMessage id="learning.learn_exercise.leader_project" />}
                        className="w-1/3"
                        rules={[{ required: true, message: intl.formatMessage({ id: 'learning.learn_exercise.leader_project_required' }) }]}
                    >
                        {project ?

                            <Select
                                // showSearch
                                loading={listLeaderSelect?.length === 0}
                                placeholder={intl.formatMessage({ id: 'learning.task.select_assignee' })}
                                options={listLeaderSelect}
                            />
                            :
                            <MemberMultipleSelect
                                value={form.getFieldValue('leader_project_id') || userData}
                                onChange={(value) => form.setFieldsValue({ leader_project_id: value })}
                                placeholder={intl.formatMessage({ id: 'learning.learn_exercise.members_placeholder_leader' })}
                                style={{ width: '100%' }}
                                mode="single"
                            />
                        }
                    </Form.Item>

                    {/* project_members */}
                    <Form.Item
                        name="project_members"
                        label={<FormattedMessage id="learning.learn_exercise.members" />}
                        className="w-2/3"
                        rules={[{ required: true, message: intl.formatMessage({ id: 'learning.learn_exercise.members_required' }) }]}
                    >
                        <MemberMultipleSelect
                            value={form.getFieldValue('project_members') || [userData]}
                            onChange={(value) => form.setFieldsValue({ project_members: value })}
                            placeholder={intl.formatMessage({ id: 'learning.learn_exercise.members_placeholder' })}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                </div>

                {/* document_url */}
                <Form.Item
                    name="document_url"
                    label={<FormattedMessage id="learning.learn_exercise.document_url" />}
                >
                    <Input />
                </Form.Item>

                {/* project_url */}
                <Form.Item
                    name="project_url"
                    label={<FormattedMessage id="learning.learn_exercise.project_url" />}
                >
                    <Input />
                </Form.Item>


                {/* description */}
                <Form.Item
                    name="description"
                    label={<FormattedMessage id="learning.learn_exercise.description" />}
                    rules={[{ required: true, message: intl.formatMessage({ id: 'learning.learn_exercise.description_required' }) }]}
                >
                    <TextArea rows={4} />
                </Form.Item>


                {/* mark_is_completed */}
                <Form.Item
                    className="flex-1 mb-4"
                    label={<FormattedMessage id="learning.task.mark_is_completed" defaultMessage="Mark as completed" />}
                >
                    <Switch
                        disabled={project === null}
                        checkedChildren={<FormattedMessage id="learning.task.completed" defaultMessage="Completed" />}
                        unCheckedChildren={<FormattedMessage id="learning.task.not_completed" defaultMessage="Not completed" />}
                        onChange={handleMarkIsCompleted}
                        checked={isMarkIsCompleted}
                    />
                </Form.Item>
                {isMarkIsCompleted && (
                    <Form.Item
                        name="project_completed_on"
                        className="mb-4 w-1/2"
                        label={<FormattedMessage id="learning.task.project_completed_on" defaultMessage="Project Completed On" />}
                        rules={[{ required: isMarkIsCompleted, message: 'Please select completion date!' }]}
                    >
                        <DatePicker
                            className="w-full"
                            format="DD/MM/YYYY"
                            disabledDate={disableCompletionDates}
                            placeholder="Select completion date"
                        />
                    </Form.Item>
                )}
            </Form>
        </Drawer>
    );
};

export default ProjectDrawer; 