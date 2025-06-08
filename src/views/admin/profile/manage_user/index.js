import React, { useState } from 'react';
import {
    Table, Card, Button, Space, Input, Modal, Form, Select,
    message, Tabs, Row, Col, Statistic, Tag, Avatar, Timeline,
    Drawer, List, Progress, Badge, Tooltip
} from 'antd';
import {
    EditOutlined, DeleteOutlined, UserAddOutlined, LockOutlined,
    UnlockOutlined, UserOutlined, TeamOutlined, SettingOutlined,
    HistoryOutlined, SafetyOutlined, BarChartOutlined, FileTextOutlined,
    ManOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiClient from '../../../../utils/api';
import { API_BASE_URL } from '../../../../constants';
import moment from 'moment';
import { Area } from '@ant-design/plots';

const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// Components
import UsersTab from './components/UsersTab';
import RolesTab from './components/RolesTab';
import GenderTab from './components/GenderTab';
import ActivityLogTab from './components/ActivityLogTab';
import UserForm from './components/UserForm';
import UserDetailDrawer from './components/UserDetailDrawer';

// Mock Data
const MOCK_USERS = [
    {
        id: 1,
        username: 'johndoe',
        fullname: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        avatar_url: null,
        last_active: '2024-03-20T10:30:00',
        createdAt: '2023-01-15T08:00:00',
        permissions: ['read', 'write', 'delete'],
        recent_activity: [
            { action: 'Updated profile', timestamp: '2024-03-20T10:30:00' },
            { action: 'Created new project', timestamp: '2024-03-19T15:45:00' },
        ]
    },
    {
        id: 2,
        username: 'janedoe',
        fullname: 'Jane Doe',
        email: 'jane@example.com',
        role: 'moderator',
        status: 'active',
        avatar_url: null,
        last_active: '2024-03-19T16:45:00',
        createdAt: '2023-02-20T09:15:00',
        permissions: ['read', 'write'],
        recent_activity: [
            { action: 'Reviewed content', timestamp: '2024-03-19T16:45:00' },
            { action: 'Added comment', timestamp: '2024-03-19T14:30:00' },
        ]
    },
    {
        id: 3,
        username: 'bobsmith',
        fullname: 'Bob Smith',
        email: 'bob@example.com',
        role: 'user',
        status: 'blocked',
        avatar_url: null,
        last_active: '2024-03-18T11:20:00',
        createdAt: '2023-03-10T14:30:00',
        permissions: ['read'],
        recent_activity: [
            { action: 'Login attempt', timestamp: '2024-03-18T11:20:00' },
        ]
    }
];

const MOCK_ROLES = [
    {
        id: 1,
        name: 'Admin',
        description: 'Quyền truy cập đầy đủ vào hệ thống',
        permissions: ['read', 'write', 'delete', 'manage_users', 'manage_roles']
    },
    {
        id: 2,
        name: 'Moderator',
        description: 'Quyền quản lý nội dung',
        permissions: ['read', 'write', 'manage_content']
    },
    {
        id: 3,
        name: 'User',
        description: 'Quyền truy cập cơ bản',
        permissions: ['read', 'write_own']
    }
];

const MOCK_ACTIVITY = [
    {
        id: 1,
        action: 'Đăng nhập',
        ip_address: '192.168.1.1',
        device: 'Chrome/Windows',
        location: 'Hà Nội, VN',
        timestamp: '2024-03-20T10:30:00',
        type: 'auth'
    },
    {
        id: 2,
        action: 'Cập nhật hồ sơ',
        ip_address: '192.168.1.2',
        device: 'Firefox/MacOS',
        location: 'TP HCM, VN',
        timestamp: '2024-03-19T15:45:00',
        type: 'profile'
    },
    {
        id: 3,
        action: 'Tạo dự án mới',
        ip_address: '192.168.1.3',
        device: 'Safari/iOS',
        location: 'Đà Nẵng, VN',
        timestamp: '2024-03-18T09:15:00',
        type: 'project'
    }
];

const UserManagement = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState(MOCK_USERS);
    const [userActivity] = useState(MOCK_ACTIVITY);
    const [roles, setRoles] = useState(MOCK_ROLES);
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('1');

    // User activity data for charts
    const activityData = userActivity?.map(activity => ({
        date: moment(activity.timestamp).format('YYYY-MM-DD'),
        type: activity.type,
        value: 1,
    })) || [];

    const activityConfig = {
        data: activityData,
        xField: 'date',
        yField: 'value',
        seriesField: 'type',
        smooth: true,
        animation: {
            appear: {
                animation: 'wave-in',
                duration: 1500,
            },
        },
    };

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (_, record) => (
                <Space>
                    <Avatar
                        src={record.avatar_url}
                        icon={<UserOutlined />}
                    />
                    <div>
                        <div>{record.fullname}</div>
                        <div className="text-gray-400 text-sm">{record.username}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'User', value: 'user' },
                { text: 'Moderator', value: 'moderator' },
            ],
            onFilter: (value, record) => record.role === value,
            render: (role) => (
                <Tag color={role === 'admin' ? 'red' : role === 'moderator' ? 'orange' : 'blue'}>
                    {role}
                </Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    active: 'green',
                    inactive: 'orange',
                    blocked: 'red',
                };
                return (
                    <Badge
                        status={status === 'active' ? 'success' : status === 'inactive' ? 'warning' : 'error'}
                        text={status?.toUpperCase()}
                    />
                );
            },
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Inactive', value: 'inactive' },
                { text: 'Blocked', value: 'blocked' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Last Active',
            dataIndex: 'last_active',
            key: 'last_active',
            render: (date) => moment(date).fromNow(),
            sorter: (a, b) => moment(a.last_active).unix() - moment(b.last_active).unix(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        icon={<SettingOutlined />}
                        onClick={() => handleViewDetails(record)}
                    >
                        Details
                    </Button>
                    {record.status === 'active' ? (
                        <Button
                            danger
                            icon={<LockOutlined />}
                            onClick={() => handleUpdateStatus(record.id, 'blocked')}
                        >
                            Block
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            icon={<UnlockOutlined />}
                            onClick={() => handleUpdateStatus(record.id, 'active')}
                        >
                            Activate
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const activityColumns = [
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'IP Address',
            dataIndex: 'ip_address',
            key: 'ip_address',
        },
        {
            title: 'Device',
            dataIndex: 'device',
            key: 'device',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Time',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
        },
    ];

    const handleEdit = (user) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsDrawerVisible(true);
    };

    const handleUpdateStatus = (userId, status) => {
        Modal.confirm({
            title: `Are you sure you want to ${status === 'blocked' ? 'block' : 'activate'} this user?`,
            content: `This will ${status === 'blocked' ? 'prevent' : 'allow'} the user from accessing the system.`,
            okText: 'Yes',
            okType: status === 'blocked' ? 'danger' : 'primary',
            cancelText: 'No',
            onOk: () => {
                const updatedUsers = users.map(user =>
                    user.id === userId ? { ...user, status } : user
                );
                setUsers(updatedUsers);
                message.success('User status updated successfully');
            },
        });
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setEditingUser(null);
        form.resetFields();
    };

    const handleSubmit = (values) => {
        if (editingUser) {
            // Update existing user
            const updatedUsers = users.map(user =>
                user.id === editingUser.id ? { ...user, ...values } : user
            );
            setUsers(updatedUsers);
            message.success('User updated successfully');
        } else {
            // Create new user
            const newUser = {
                id: users.length + 1,
                ...values,
                createdAt: moment().format(),
                last_active: moment().format(),
                avatar_url: null,
                recent_activity: [],
            };
            setUsers([...users, newUser]);
            message.success('User created successfully');
        }
        handleModalClose();
    };

    return (
        <div className="p-6">
            <Card>
                <Tabs
                    defaultActiveKey="1"
                    activeKey={activeTab}
                    onChange={setActiveTab}
                >
                    <TabPane
                        tab={
                            <span>
                                <UserOutlined /> Người dùng
                            </span>
                        }
                        key="1"
                    >
                        <UsersTab
                            users={users}
                            userActivity={userActivity}
                            handleEdit={handleEdit}
                            handleViewDetails={handleViewDetails}
                            setUsers={setUsers}
                        />
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <SafetyOutlined /> Vai trò & Quyền hạn
                            </span>
                        }
                        key="2"
                    >
                        <RolesTab
                            roles={roles}
                            setRoles={setRoles}
                        />
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <ManOutlined /> Giới tính
                            </span>
                        }
                        key="3"
                    >
                        <GenderTab />
                    </TabPane>

                    <TabPane
                        tab={
                            <span>
                                <HistoryOutlined /> Nhật ký hoạt động
                            </span>
                        }
                        key="4"
                    >
                        <ActivityLogTab activityData={userActivity} />
                    </TabPane>
                </Tabs>
            </Card>

            {/* User Details Drawer */}
            <Drawer
                title="User Details"
                width={720}
                visible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
            >
                {selectedUser && (
                    <>
                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <Avatar
                                    size={64}
                                    src={selectedUser.avatar_url}
                                    icon={<UserOutlined />}
                                />
                                <div className="ml-4">
                                    <h2 className="text-2xl font-bold">{selectedUser.fullname}</h2>
                                    <p className="text-gray-500">{selectedUser.email}</p>
                                </div>
                            </div>
                        </div>

                        <Row gutter={16} className="mb-6">
                            <Col span={8}>
                                <Statistic
                                    title="Join Date"
                                    value={moment(selectedUser.createdAt).format('MMM D, YYYY')}
                                    prefix={<UserAddOutlined />}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Last Active"
                                    value={moment(selectedUser.last_active).fromNow()}
                                    prefix={<HistoryOutlined />}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Status"
                                    value={selectedUser?.status?.toUpperCase()}
                                    prefix={selectedUser?.status === 'active' ? <UnlockOutlined /> : <LockOutlined />}
                                />
                            </Col>
                        </Row>

                        <Card title="Permissions" className="mb-6">
                            <List
                                dataSource={selectedUser.permissions || []}
                                renderItem={permission => (
                                    <List.Item>
                                        <Tag color="blue">{permission}</Tag>
                                    </List.Item>
                                )}
                            />
                        </Card>

                        <Card title="Recent Activity">
                            <Timeline>
                                {(selectedUser.recent_activity || []).map((activity, index) => (
                                    <Timeline.Item key={index}>
                                        <p>{activity.action}</p>
                                        <p className="text-gray-500">{moment(activity.timestamp).format('MMM D, YYYY HH:mm')}</p>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </Card>
                    </>
                )}
            </Drawer>

            {/* Add/Edit User Modal */}
            <UserForm
                visible={isModalVisible}
                onCancel={handleModalClose}
                onFinish={handleSubmit}
                editingUser={editingUser}
                roles={roles}
                loading={false}
            />

            {/* User Detail Drawer */}
            <UserDetailDrawer
                visible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
                user={selectedUser}
            />
        </div>
    );
};

export default UserManagement; 