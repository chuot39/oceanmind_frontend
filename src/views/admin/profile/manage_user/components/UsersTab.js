import React, { useState } from 'react';
import {
    Table, Button, Space, Input, Row, Col, Card, Statistic,
    Badge, Avatar, Tag, message, Modal
} from 'antd';
import {
    UserOutlined, TeamOutlined, UserAddOutlined, LockOutlined,
    UnlockOutlined, EditOutlined, SettingOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { Area } from '@ant-design/plots';

const { Search } = Input;

const UsersTab = ({
    users,
    userActivity,
    handleEdit,
    handleViewDetails,
    setUsers
}) => {
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

    const handleUpdateStatus = (userId, status) => {
        Modal.confirm({
            title: `Bạn có chắc chắn muốn ${status === 'blocked' ? 'khóa' : 'kích hoạt'} người dùng này?`,
            content: `Hành động này sẽ ${status === 'blocked' ? 'ngăn' : 'cho phép'} người dùng truy cập vào hệ thống.`,
            okText: 'Có',
            okType: status === 'blocked' ? 'danger' : 'primary',
            cancelText: 'Không',
            onOk: () => {
                const updatedUsers = users.map(user =>
                    user.id === userId ? { ...user, status } : user
                );
                setUsers(updatedUsers);
                message.success('Cập nhật trạng thái người dùng thành công');
            },
        });
    };

    const columns = [
        {
            title: 'Người dùng',
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
            title: 'Vai trò',
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
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
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
            title: 'Hoạt động cuối',
            dataIndex: 'last_active',
            key: 'last_active',
            render: (date) => moment(date).fromNow(),
            sorter: (a, b) => moment(a.last_active).unix() - moment(b.last_active).unix(),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<SettingOutlined />}
                        onClick={() => handleViewDetails(record)}
                    >
                        Chi tiết
                    </Button>
                    {record.status === 'active' ? (
                        <Button
                            danger
                            icon={<LockOutlined />}
                            onClick={() => handleUpdateStatus(record.id, 'blocked')}
                        >
                            Khóa
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            icon={<UnlockOutlined />}
                            onClick={() => handleUpdateStatus(record.id, 'active')}
                        >
                            Kích hoạt
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-4">
                <Row gutter={16} className="mb-4">
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Tổng người dùng"
                                value={users?.length || 0}
                                prefix={<UserOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Người dùng đang hoạt động"
                                value={users?.filter(u => u.status === 'active').length || 0}
                                prefix={<TeamOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Người dùng mới (Tháng này)"
                                value={
                                    users?.filter(u =>
                                        moment(u.createdAt).isAfter(moment().startOf('month'))
                                    ).length || 0
                                }
                                prefix={<UserAddOutlined />}
                            />
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <Statistic
                                title="Người dùng bị khóa"
                                value={users?.filter(u => u.status === 'blocked').length || 0}
                                prefix={<LockOutlined />}
                            />
                        </Card>
                    </Col>
                </Row>

                <Space className="mb-4">
                    <Search
                        placeholder="Tìm kiếm người dùng"
                        style={{ width: 200 }}
                        allowClear
                    />
                    <Button
                        type="primary"
                        icon={<UserAddOutlined />}
                        onClick={() => handleEdit(null)}
                    >
                        Thêm người dùng
                    </Button>
                </Space>

                <div style={{ height: 300 }} className="mb-4">
                    <Area {...activityConfig} />
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="id"
            />
        </div>
    );
};

export default UsersTab; 