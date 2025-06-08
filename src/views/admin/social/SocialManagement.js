import React, { useState } from 'react';
import { Tabs, Card, Table, Button, Space, Input, Modal, Form, Select, Tag, message } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

// Mock Data
const MOCK_POSTS = [
    {
        id: 1,
        content: 'Just completed my first project milestone! 🎉',
        author: { id: 1, fullname: 'John Doe' },
        createdAt: '2024-03-20T10:30:00',
        likes_count: 15,
        comments_count: 5,
        shares_count: 2,
        image: 'https://picsum.photos/400/300'
    },
    {
        id: 2,
        content: 'Great team meeting today. Excited about our new initiatives!',
        author: { id: 2, fullname: 'Jane Smith' },
        createdAt: '2024-03-19T15:45:00',
        likes_count: 10,
        comments_count: 3,
        shares_count: 1
    },
    {
        id: 3,
        content: 'Check out our latest tech stack update',
        author: { id: 3, fullname: 'Bob Wilson' },
        createdAt: '2024-03-18T09:15:00',
        likes_count: 20,
        comments_count: 8,
        shares_count: 5,
        image: 'https://picsum.photos/400/300'
    }
];

const MOCK_GROUPS = [
    {
        id: 1,
        name: 'Frontend Developers',
        description: 'A group for frontend development discussions and knowledge sharing',
        members_count: 150,
        createdAt: '2023-01-15',
        status: 'active'
    },
    {
        id: 2,
        name: 'UI/UX Design Team',
        description: 'Collaboration space for designers',
        members_count: 75,
        createdAt: '2023-02-20',
        status: 'active'
    },
    {
        id: 3,
        name: 'Project Alpha',
        description: 'Private group for Project Alpha team members',
        members_count: 25,
        createdAt: '2023-03-10',
        status: 'inactive'
    }
];

const MOCK_REPORTS = [
    {
        id: 1,
        reporter: { id: 1, fullname: 'John Doe' },
        type: 'post',
        reason: 'Inappropriate content',
        status: 'pending',
        createdAt: '2024-03-20T10:30:00'
    },
    {
        id: 2,
        reporter: { id: 2, fullname: 'Jane Smith' },
        type: 'comment',
        reason: 'Harassment',
        status: 'resolved',
        createdAt: '2024-03-19T15:45:00'
    },
    {
        id: 3,
        reporter: { id: 3, fullname: 'Bob Wilson' },
        type: 'user',
        reason: 'Spam',
        status: 'rejected',
        createdAt: '2024-03-18T09:15:00'
    }
];

const SocialManagement = () => {
    const [form] = Form.useForm();
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [posts, setPosts] = useState(MOCK_POSTS);
    const [groups, setGroups] = useState(MOCK_GROUPS);
    const [reports, setReports] = useState(MOCK_REPORTS);

    const postColumns = [
        {
            title: 'Author',
            dataIndex: ['author', 'fullname'],
            key: 'author',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            ellipsis: true,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('MMM D, YYYY HH:mm'),
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        },
        {
            title: 'Likes',
            dataIndex: 'likes_count',
            key: 'likes',
            sorter: (a, b) => a.likes_count - b.likes_count,
        },
        {
            title: 'Comments',
            dataIndex: 'comments_count',
            key: 'comments',
            sorter: (a, b) => a.comments_count - b.comments_count,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => handleViewPost(record)}>
                        View
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeletePost(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const groupColumns = [
        {
            title: 'Group Name',
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
            title: 'Members',
            dataIndex: 'members_count',
            key: 'members',
            sorter: (a, b) => a.members_count - b.members_count,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('MMM D, YYYY'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />}>View</Button>
                    <Button type="primary">Manage</Button>
                </Space>
            ),
        },
    ];

    const reportColumns = [
        {
            title: 'Reported By',
            dataIndex: ['reporter', 'fullname'],
            key: 'reporter',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: [
                { text: 'Post', value: 'post' },
                { text: 'Comment', value: 'comment' },
                { text: 'User', value: 'user' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            ellipsis: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={
                    status === 'pending' ? 'orange' :
                        status === 'resolved' ? 'green' :
                            status === 'rejected' ? 'red' : 'default'
                }>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Reported At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('MMM D, YYYY HH:mm'),
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => handleViewReport(record)}>
                        View
                    </Button>
                    <Select
                        defaultValue={record.status}
                        style={{ width: 120 }}
                        onChange={(value) => handleUpdateReportStatus(record.id, value)}
                    >
                        <Option value="pending">Pending</Option>
                        <Option value="resolved">Resolved</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>
                </Space>
            ),
        },
    ];

    const handleViewPost = (post) => {
        setSelectedPost(post);
        setIsModalVisible(true);
    };

    const handleDeletePost = (postId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this post?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                const updatedPosts = posts.filter(post => post.id !== postId);
                setPosts(updatedPosts);
                message.success('Post deleted successfully');
            },
        });
    };

    const handleViewReport = (report) => {
        // Implement report details view
        console.log('View report:', report);
    };

    const handleUpdateReportStatus = (reportId, status) => {
        const updatedReports = reports.map(report =>
            report.id === reportId ? { ...report, status } : report
        );
        setReports(updatedReports);
        message.success('Report status updated successfully');
    };

    return (
        <div className="p-6">
            <Card>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Posts" key="1">
                        <div className="mb-4">
                            <Search
                                placeholder="Search posts"
                                style={{ width: 200 }}
                                allowClear
                            />
                        </div>
                        <Table
                            columns={postColumns}
                            dataSource={posts}
                            rowKey="id"
                        />
                    </TabPane>
                    <TabPane tab="Groups" key="2">
                        <div className="mb-4">
                            <Search
                                placeholder="Search groups"
                                style={{ width: 200 }}
                                allowClear
                            />
                        </div>
                        <Table
                            columns={groupColumns}
                            dataSource={groups}
                            rowKey="id"
                        />
                    </TabPane>
                    <TabPane tab="Reports" key="3">
                        <div className="mb-4">
                            <Search
                                placeholder="Search reports"
                                style={{ width: 200 }}
                                allowClear
                            />
                        </div>
                        <Table
                            columns={reportColumns}
                            dataSource={reports}
                            rowKey="id"
                        />
                    </TabPane>
                </Tabs>
            </Card>

            <Modal
                title="Post Details"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={800}
            >
                {selectedPost && (
                    <div>
                        <p className="font-bold">Author: {selectedPost.author?.fullname}</p>
                        <p className="text-gray-500">Posted on: {moment(selectedPost.createdAt).format('MMMM D, YYYY HH:mm')}</p>
                        <div className="my-4">
                            <p>{selectedPost.content}</p>
                        </div>
                        {selectedPost.image && (
                            <div className="my-4">
                                <img src={selectedPost.image} alt="Post content" className="max-w-full" />
                            </div>
                        )}
                        <div className="flex gap-4 text-gray-500">
                            <span>{selectedPost.likes_count} likes</span>
                            <span>{selectedPost.comments_count} comments</span>
                            <span>{selectedPost.shares_count} shares</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SocialManagement; 