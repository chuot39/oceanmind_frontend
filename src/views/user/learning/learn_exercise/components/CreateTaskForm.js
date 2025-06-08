import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Select, Card } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import ProjectSelect from '@/components/elements/ProjectSelect';
import { useUserData } from '@/utils/hooks/useAuth';
import { useCreateTask } from '../mutationHooks';

const { TextArea } = Input;

const CreateTaskForm = ({ onSuccess }) => {
    const intl = useIntl();
    const { userData } = useUserData();
    const [form] = Form.useForm();
    const [selectedProject, setSelectedProject] = useState(null);

    const { mutate: createTask, isLoading } = useCreateTask();

    const handleProjectChange = (project) => {
        setSelectedProject(project);
        // Reset assignee field when project changes
        form.setFieldsValue({ assignee: undefined });
    };

    const handleSubmit = (values) => {
        const taskData = {
            name: values.name,
            description: values.description,
            due_date: values.due_date.toISOString(),
            project_id: values.project.documentId,
            task_assigned_to: values.assignee,
            task_assigned_by: userData.documentId,
            is_important: values.is_important || false
        };

        createTask(taskData, {
            onSuccess: () => {
                form.resetFields();
                if (onSuccess) onSuccess();
            }
        });
    };

    return (
        <Card title={<FormattedMessage id="learning.task.create_new" />} className="custom_card">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label={<FormattedMessage id="learning.task.name" />}
                    rules={[{ required: true, message: intl.formatMessage({ id: 'validation.required' }) }]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'learning.task.name_placeholder' })} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={<FormattedMessage id="learning.task.description" />}
                    rules={[{ required: true, message: intl.formatMessage({ id: 'validation.required' }) }]}
                >
                    <TextArea
                        rows={4}
                        placeholder={intl.formatMessage({ id: 'learning.task.description_placeholder' })}
                    />
                </Form.Item>

                <Form.Item
                    name="project"
                    label={<FormattedMessage id="learning.task.project" />}
                    rules={[{ required: true, message: intl.formatMessage({ id: 'validation.required' }) }]}
                >
                    <ProjectSelect
                        onChange={handleProjectChange}
                        placeholder={intl.formatMessage({ id: 'learning.task.select_project' })}
                    />
                </Form.Item>

                <Form.Item
                    name="assignee"
                    label={<FormattedMessage id="learning.task.assignee" />}
                    rules={[{ required: true, message: intl.formatMessage({ id: 'validation.required' }) }]}
                >
                    <Select
                        placeholder={intl.formatMessage({ id: 'learning.task.select_assignee' })}
                        disabled={!selectedProject}
                    >
                        {selectedProject?.project_members?.map(member => (
                            <Select.Option
                                key={member.detail_member_project.documentId}
                                value={member.detail_member_project.documentId}
                            >
                                {member.detail_member_project.fullname}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="due_date"
                    label={<FormattedMessage id="learning.task.due_date" />}
                    rules={[{ required: true, message: intl.formatMessage({ id: 'validation.required' }) }]}
                >
                    <DatePicker
                        className="w-full"
                        placeholder={intl.formatMessage({ id: 'learning.task.select_date' })}
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        block
                    >
                        <FormattedMessage id="common.create" />
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CreateTaskForm; 