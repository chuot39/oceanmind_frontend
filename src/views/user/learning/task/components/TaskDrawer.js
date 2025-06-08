import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, DatePicker, Select, Button, Switch, Alert } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import dayjs from 'dayjs'; // Import dayjs for date handling
import { useMemberOfProject, useTaskCategory } from '../hook';
import ProjectSelect from '@/components/elements/ProjectSelect';
import { useUserData } from '@/utils/hooks/useAuth';
import { useCreateTask, useUpdateTask } from '../mutationHooks';
import useSkin from '@/utils/hooks/useSkin';
import { Controller, useForm } from 'react-hook-form';
const { TextArea } = Input;

const TaskDrawer = ({ visible, onClose, task, mode = 'add', onTaskUpdated = () => { }, defaultProject = null, refetchUserTask }) => {
    const intl = useIntl();
    const { userData } = useUserData();
    const { language } = useSkin();
    const [form] = Form.useForm();
    const { control, watch, formState: { errors }, setValue } = useForm({})

    const [selectedProject, setSelectedProject] = useState(null);
    const [isMarkIsCompleted, setIsMarkIsCompleted] = useState(false);

    const updateTaskAsync = useUpdateTask();
    const createTaskAsync = useCreateTask();

    const { status: memberOfProjectStatus, data: memberOfProjects } = useMemberOfProject(selectedProject?.documentId);
    const { status: taskCategoryStatus, data: taskCategories } = useTaskCategory();

    const isTaskCreator = task?.taskAssignedBy?.username === userData?.username;
    const isTaskAssignee = task?.taskAssignedTo?.username === userData?.username;

    const handleMarkIsCompleted = (checked) => {
        setIsMarkIsCompleted(checked);
    }

    useEffect(() => {
        switch (mode) {
            case 'edit':
                if (task) {
                    setSelectedProject(task?.project);

                    const isCompleted = task?.task_completed_on !== null && task?.task_completed_on !== undefined;
                    setIsMarkIsCompleted(isCompleted);

                    const formattedTask = {
                        name: task?.name,
                        description: task?.description,
                        due_date: task?.due_date ? dayjs(task.due_date) : null,
                        task_category_id: task?.taskCategory?.documentId,
                        project_id: task?.project,
                        task_assigned_to: task?.taskAssignedTo?.documentId,
                        task_assigned_by: task?.taskAssignedBy?.documentId,
                        is_important: task?.is_important,
                        task_completed_on: task?.task_completed_on ? dayjs(task.task_completed_on) : null
                    };

                    // Set form values
                    form.setFieldsValue(formattedTask);
                } else {
                    // Reset form khi thêm mới
                    form.resetFields();
                    setSelectedProject(null);
                    setIsMarkIsCompleted(false);
                }
                break;

            case 'add':
                if (defaultProject) {
                    const formattedTask = {
                        name: '',
                        description: '',
                        due_date: null,
                        task_category_id: null,
                        project_id: defaultProject,
                        task_assigned_to: userData?.documentId,
                        task_assigned_by: userData?.documentId,
                        is_important: false,
                        task_completed_on: null
                    };
                    setSelectedProject(defaultProject);
                    form.setFieldsValue(formattedTask);
                } else {
                    const formattedTask = {
                        name: '',
                        description: '',
                        due_date: null,
                        task_category_id: null,
                        project_id: null,
                        task_assigned_to: userData?.documentId,
                        task_assigned_by: userData?.documentId,
                        is_important: false,
                        task_completed_on: null
                    };
                    form.setFieldsValue(formattedTask);
                    setSelectedProject(null);
                    setIsMarkIsCompleted(false);
                }
                break;
            default:
                form.resetFields();
                setSelectedProject(null);
                setIsMarkIsCompleted(false);
                break;
        }
    }, [task, mode, form, visible, defaultProject, userData]);

    const handleSubmit = async (values) => {
        // Handle form submission
        const formattedValues = {
            ...values,
            due_date: values.due_date?.format('YYYY-MM-DD'), // Format date to string
            project_id: selectedProject?.documentId || null, // Sử dụng selectedProject thay vì values.project, có thể null
            task_completed_on: isMarkIsCompleted ? values.task_completed_on?.format('YYYY-MM-DD') : null,
            // Nếu không chọn project, sử dụng user hiện tại cho cả assign_by và assign_to
            task_assigned_by: values.task_assigned_by || userData?.documentId,
            task_assigned_to: values.task_assigned_to || userData?.documentId,
        };


        try {
            let response = null;
            if (task?.documentId) {
                response = await updateTaskAsync.mutateAsync({
                    data: formattedValues,
                    taskId: task?.documentId,
                });
            } else {
                response = await createTaskAsync.mutateAsync({
                    data: formattedValues,
                });
            }
            onTaskUpdated();
            onClose();
            refetchUserTask();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    // Tạo options cho priority từ task categories với documentId làm value
    const priorityOptions = taskCategories?.data?.map(category => ({
        value: category?.documentId,
        label: language === 'en' ? category?.name_en : category?.name_vi
    }));

    const disableCompletionDates = (current) => {
        if (task?.createdAt) {
            const taskCreatedDate = dayjs(task.createdAt).startOf('day');
            return current.isBefore(taskCreatedDate);
        }
        return current.isBefore(dayjs().startOf('day'));
    };

    // Hàm vô hiệu hóa ngày trong DatePicker cho due_date
    const disableDueDates = (current) => {
        // Vô hiệu hóa các ngày trước ngày hiện tại
        return current.isBefore(dayjs().startOf('day'));
    };

    return (
        <Drawer
            title={
                mode === 'add' ? (
                    <FormattedMessage id="learning.task.add_task" defaultMessage="Add Task" />
                ) : (
                    <FormattedMessage id="learning.task.edit_task" defaultMessage="Edit Task" />
                )
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={700}
            className='task_drawer'
            extra={
                <div className="flex gap-2">
                    {mode === 'edit' && (
                        <Button danger onClick={onClose}>
                            <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
                        </Button>
                    )}
                    <Button
                        disabled={!isTaskAssignee && !isTaskCreator && mode === 'edit'}
                        loading={updateTaskAsync.isLoading || createTaskAsync.isLoading}
                        type="primary"
                        onClick={() => form.submit()}
                    >
                        {mode === 'add' ? (
                            <FormattedMessage id="learning.task.add" defaultMessage="Add" />
                        ) : (
                            <FormattedMessage id="learning.task.update" defaultMessage="Update" />
                        )}
                    </Button>
                </div>
            }
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit} >
                {mode === 'edit' && !isTaskAssignee && !isTaskCreator && (
                    <Alert
                        message={intl.formatMessage({ id: 'learning.task.role_update', defaultMessage: 'You do not have permission to update this task' })}
                        type="warning"
                        showIcon
                        className='mb-4'
                    />
                )}
                {/* Title */}
                <Form.Item
                    name="name"
                    label={<FormattedMessage id="learning.task.title" defaultMessage="Title" />}
                    rules={[{ required: true, message: 'Please input task title!' }]}
                >
                    <Input />
                </Form.Item>

                <div className="flex gap-4">
                    {/* Project - không bắt buộc */}
                    <Form.Item
                        className="flex-1 mb-4"
                        name="project_id"
                        label={<FormattedMessage id="learning.task.project" defaultMessage="Project" />}
                    >
                        <Controller
                            name='project_id'
                            rules={{ required: true }}
                            control={control}
                            render={({ field }) => <ProjectSelect
                                // disabled={mode === 'edit'}
                                value={selectedProject}
                                onChange={(value) => {
                                    setSelectedProject(value);
                                    form.setFieldsValue({ project_id: value?.documentId });
                                }}
                            />}
                        />
                    </Form.Item>

                    {/* Due date */}
                    <Form.Item
                        name="due_date"
                        label={<FormattedMessage id="learning.task.due_date" defaultMessage="Due Date" />}
                        className="flex-1 mb-4"
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
                    {/* Assign by */}
                    <Form.Item
                        name="task_assigned_by"
                        label={<FormattedMessage id="learning.task.assign_by" defaultMessage="Assign by" />}
                        className="flex-1 mb-4"
                        rules={[{ required: true, message: 'Please select assign by!' }]}
                    >
                        <Select
                            // showSearch
                            placeholder={intl.formatMessage({ id: 'learning.task.select_assignee' })}
                            disabled={(!selectedProject && mode === 'add')}
                            options={selectedProject ?
                                (memberOfProjects?.data?.map(member => ({
                                    label: member?.user?.fullname,
                                    value: member?.user?.documentId,
                                })) || []) :
                                [{
                                    label: userData?.fullname,
                                    value: userData?.documentId
                                }]
                            }
                        />
                    </Form.Item>

                    {/* Assignee */}
                    <Form.Item
                        name="task_assigned_to"
                        label={<FormattedMessage id="learning.task.assignee" defaultMessage="Assignee" />}
                        className="flex-1 mb-4"
                        rules={[{ required: true, message: 'Please select assignee!' }]}
                    >
                        <Select
                            // showSearch
                            loading={selectedProject && memberOfProjectStatus === 'loading'}
                            placeholder={intl.formatMessage({ id: 'learning.task.select_assignee' })}
                            disabled={!selectedProject && mode === 'add'}
                            options={selectedProject ?
                                (memberOfProjects?.data?.map(member => ({
                                    label: member?.user?.fullname,
                                    value: member?.user?.documentId,
                                })) || []) :
                                [{
                                    label: userData?.fullname,
                                    value: userData?.documentId
                                }]
                            }
                        />
                    </Form.Item>
                </div>


                <div className="flex gap-4">

                    {/* Important */}
                    <Form.Item
                        name="is_important"
                        label={<FormattedMessage id="learning.task.important_flag" defaultMessage="Important" />}
                        className="flex-1 mb-4"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={<FormattedMessage id="learning.task.important" defaultMessage="Important" />}
                            unCheckedChildren={<FormattedMessage id="learning.task.not_important" defaultMessage="Not Important" />}
                        />
                    </Form.Item>

                    <Form.Item
                        className="flex-1 mb-4"
                        label={<FormattedMessage id="learning.task.mark_is_completed" defaultMessage="Mark as completed" />}
                    >
                        <Switch
                            disabled={mode === 'add'}
                            checkedChildren={<FormattedMessage id="learning.task.completed" defaultMessage="Completed" />}
                            unCheckedChildren={<FormattedMessage id="learning.task.not_completed" defaultMessage="Not completed" />}
                            onChange={handleMarkIsCompleted}
                            checked={isMarkIsCompleted}
                        />
                    </Form.Item>

                </div>


                <div className="flex gap-4">

                    {/* Priority */}
                    <Form.Item
                        name="task_category_id"
                        className="mb-4 w-1/2"
                        label={<FormattedMessage id="learning.task.priority" defaultMessage="Priority" />}
                        rules={[{ required: true, message: 'Please select priority!' }]}
                    >
                        <Select
                            loading={taskCategoryStatus === 'loading'}
                            placeholder={intl.formatMessage({ id: 'learning.task.select_priority' })}
                            options={priorityOptions}
                        />
                    </Form.Item>

                    {isMarkIsCompleted && (
                        <Form.Item
                            name="task_completed_on"
                            className="mb-4 w-1/2"
                            label={<FormattedMessage id="learning.task.task_completed_on" defaultMessage="Task Completed On" />}
                            rules={[{ required: isMarkIsCompleted, message: 'Please select completion date!' }]}
                        >
                            <DatePicker
                                className="w-full"
                                format='DD/MM/YYYY'
                                disabledDate={disableCompletionDates}
                            />

                        </Form.Item>
                    )}


                </div>

                {/* Description */}
                <Form.Item
                    name="description"
                    label={<FormattedMessage id="learning.task.description" defaultMessage="Description" />}
                >
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default TaskDrawer; 