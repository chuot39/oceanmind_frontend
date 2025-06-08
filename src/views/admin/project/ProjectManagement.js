import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Modal, Form, Select, DatePicker, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Mock Data
const MOCK_PROJECTS = [
    {
        id: 1,
        name: 'E-learning Platform',
        description: 'Developing a comprehensive e-learning platform with video courses, quizzes, and progress tracking',
        status: 'in_progress',
        start_date: '2024-01-01',
        end_date: '2024-06-30',
        team_members: [
            { id: 1, fullname: 'John Doe' },
            { id: 2, fullname: 'Jane Smith' },
            { id: 3, fullname: 'Bob Wilson' },
            { id: 4, fullname: 'Alice Brown' }
        ]
    },
    {
        id: 2,
        name: 'Mobile App Development',
        description: 'Creating a mobile application for both iOS and Android platforms',
        status: 'completed',
        start_date: '2023-07-01',
        end_date: '2023-12-31',
        team_members: [
            { id: 2, fullname: 'Jane Smith' },
            { id: 5, fullname: 'Mike Johnson' }
        ]
    },
    {
        id: 3,
        name: 'Website Redesign',
        description: 'Redesigning the company website with modern UI/UX principles',
        status: 'on_hold',
        start_date: '2024-02-01',
        end_date: '2024-04-30',
        team_members: [
            { id: 1, fullname: 'John Doe' },
            { id: 3, fullname: 'Bob Wilson' }
        ]
    }
];

const MOCK_USERS = [
    { id: 1, fullname: 'John Doe' },
    { id: 2, fullname: 'Jane Smith' },
    { id: 3, fullname: 'Bob Wilson' },
    { id: 4, fullname: 'Alice Brown' },
    { id: 5, fullname: 'Mike Johnson' }
];

const ProjectManagement = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projects, setProjects] = useState(MOCK_PROJECTS);
    const [users] = useState(MOCK_USERS);

    const columns = [
        {
            title: 'Project Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    'in_progress': 'blue',
                    'completed': 'green',
                    'on_hold': 'orange',
                    'cancelled': 'red',
                };
                return <Tag color={colors[status]}>{status.replace('_', ' ').toUpperCase()}</Tag>;
            },
            filters: [
                { text: 'In Progress', value: 'in_progress' },
                { text: 'Completed', value: 'completed' },
                { text: 'On Hold', value: 'on_hold' },
                { text: 'Cancelled', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Team Members',
            dataIndex: 'team_members',
            key: 'team_members',
            render: (members) => (
                <Space>
                    {members?.slice(0, 3).map(member => (
                        <Tag key={member.id}>{member.fullname}</Tag>
                    ))}
                    {members?.length > 3 && <Tag>+{members.length - 3} more</Tag>}
                </Space>
            ),
        },
        {
            title: 'Timeline',
            key: 'timeline',
            render: (_, record) => (
                <span>
                    {moment(record.start_date).format('MMM D')} - {moment(record.end_date).format('MMM D, YYYY')}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => handleView(record)}>
                        View
                    </Button>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const handleView = (project) => {
        // Implement project details view
        console.log('View project:', project);
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        form.setFieldsValue({
            ...project,
            project_period: [moment(project.start_date), moment(project.end_date)],
            team_members: project.team_members?.map(member => member.id),
        });
        setIsModalVisible(true);
    };

    const handleDelete = (projectId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this project?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                const updatedProjects = projects.filter(project => project.id !== projectId);
                setProjects(updatedProjects);
                message.success('Project deleted successfully');
            },
        });
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setEditingProject(null);
        form.resetFields();
    };

    const handleSubmit = (values) => {
        const projectData = {
            ...values,
            start_date: values.project_period[0].format('YYYY-MM-DD'),
            end_date: values.project_period[1].format('YYYY-MM-DD'),
            team_members: values.team_members.map(id =>
                users.find(user => user.id === id)
            ),
        };
        delete projectData.project_period;

        if (editingProject) {
            // Update existing project
            const updatedProjects = projects.map(project =>
                project.id === editingProject.id ? { ...project, ...projectData } : project
            );
            setProjects(updatedProjects);
            message.success('Project updated successfully');
        } else {
            // Create new project
            const newProject = {
                id: projects.length + 1,
                ...projectData
            };
            setProjects([...projects, newProject]);
            message.success('Project created successfully');
        }
        handleModalClose();
    };

    return (
        <div className="p-6">
            <Card
                title="Project Management"
                extra={
                    <Space>
                        <Search
                            placeholder="Search projects"
                            style={{ width: 200 }}
                            allowClear
                        />
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsModalVisible(true)}
                        >
                            Add Project
                        </Button>
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={projects}
                    rowKey="id"
                />
            </Card>

            <Modal
                title={editingProject ? 'Edit Project' : 'Add New Project'}
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Project Name"
                        rules={[{ required: true, message: 'Please input project name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please input description!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="project_period"
                        label="Project Timeline"
                        rules={[{ required: true, message: 'Please select project timeline!' }]}
                    >
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select status!' }]}
                    >
                        <Select>
                            <Option value="in_progress">In Progress</Option>
                            <Option value="completed">Completed</Option>
                            <Option value="on_hold">On Hold</Option>
                            <Option value="cancelled">Cancelled</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="team_members"
                        label="Team Members"
                        rules={[{ required: true, message: 'Please select team members!' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select team members"
                            style={{ width: '100%' }}
                        >
                            {users?.map(user => (
                                <Option key={user.id} value={user.id}>
                                    {user.fullname}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingProject ? 'Update' : 'Create'}
                            </Button>
                            <Button onClick={handleModalClose}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProjectManagement; 