import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space, Input, Tabs, DatePicker, Alert, Progress, Select } from 'antd';
import {
    UserOutlined, ProjectOutlined, BookOutlined, TeamOutlined,
    RiseOutlined, FallOutlined, WarningOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useQuery } from 'react-query';
import apiClient from '@utils/api';
import { API_BASE_URL } from '@constants';
import moment from 'moment';
import { Area, Column } from '@ant-design/plots';
import { useGroup, useProject, useUser } from './hook';

const { Search } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const AdminDashboard = () => {


    const { data: user, status: userStatus } = useUser();
    const { data: project, status: projectStatus } = useProject();
    const { data: group, status: groupStatus } = useGroup();


    console.log('user', user)

    const [dateRange, setDateRange] = useState([moment().subtract(7, 'days'), moment()]);
    const [timeFrame, setTimeFrame] = useState('daily'); // daily, weekly, monthly

    // Mock data for system health
    const { data: systemHealth } = {
        data: {
            cpuUsage: 45,
            memoryUsage: 62,
            diskUsage: 78,
            systemHealth: 85,
            uptime: '15 days, 7 hours',
            activeConnections: 124,
            responseTime: '218ms',
            lastRestart: '2023-12-15 03:15 AM',
            nodejsVersion: '16.14.0',
            expressVersion: '4.17.1'
        }
    };

    // Mock data for recent activities
    const { data: recentActivities } = {
        data: [
            {
                id: 1,
                user: { name: 'Nguyen Van A', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
                action: 'Created a new project',
                timestamp: moment().subtract(30, 'minutes').toDate(),
                status: 'success'
            },
            {
                id: 2,
                user: { name: 'Tran Thi B', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
                action: 'Joined group "Software Engineering"',
                timestamp: moment().subtract(2, 'hours').toDate(),
                status: 'success'
            },
            {
                id: 3,
                user: { name: 'Le Van C', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
                action: 'Attempted to access restricted area',
                timestamp: moment().subtract(3, 'hours').toDate(),
                status: 'failed'
            },
            {
                id: 4,
                user: { name: 'Pham Thi D', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
                action: 'Updated profile information',
                timestamp: moment().subtract(5, 'hours').toDate(),
                status: 'success'
            },
            {
                id: 5,
                user: { name: 'Hoang Van E', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
                action: 'Uploaded a new assignment',
                timestamp: moment().subtract(1, 'day').toDate(),
                status: 'success'
            }
        ]
    };

    // Mock data for alerts
    const { data: alerts } = {
        data: [
            {
                id: 1,
                title: 'System Maintenance',
                description: 'Scheduled maintenance on Saturday from 2AM to 4AM',
                type: 'warning',
            },
            {
                id: 2,
                title: 'High Server Load',
                description: 'The server is experiencing high load. Some operations may be slower.',
                type: 'error',
            },
            {
                id: 3,
                title: 'New Feature Available',
                description: 'Group chat feature has been released. Try it now!',
                type: 'success',
            }
        ]
    };


    const userActivityConfig = {
        data: user?.data?.map(user => ({
            date: user.createdAt,
            value: 3,
            type: user.deletedAt ? 'deleted' : 'active'
        })),
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

    const learningProgressConfig = {
        data: group?.data?.map(group => ({
            program: group.name,
            completion: group.totalTasks,
            type: group.status
        })),
        xField: 'program',
        yField: 'completion',
        label: {
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
    };

    const activityColumns = [
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <Space>
                    <UserOutlined />
                    {user.name}
                </Space>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Time',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp) => moment(timestamp).fromNow(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span style={{ color: status === 'active' ? '#52c41a' : '#ff4d4f' }}>
                    {status === 'active' ? <CheckCircleOutlined /> : <WarningOutlined />}
                    {' '}{status}
                </span>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <Space>
                    <RangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        allowClear={false}
                    />
                    <Select value={timeFrame} onChange={setTimeFrame}>
                        <Option value="daily">Daily</Option>
                        <Option value="weekly">Weekly</Option>
                        <Option value="monthly">Monthly</Option>
                    </Select>
                </Space>
            </div>

            {/* System Alerts */}
            {alerts?.length > 0 && (
                <div className="mb-6">
                    {alerts.map((alert, index) => (
                        <Alert
                            key={index}
                            message={alert.title}
                            description={alert.description}
                            type={alert.type}
                            showIcon
                            className="mb-2"
                        />
                    ))}
                </div>
            )}

            {/* Key Metrics */}
            <Row gutter={16} className="mb-6">
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            loading={userStatus === 'loading'}
                            value={user?.pagination?.total || 0}
                            prefix={<UserOutlined />}
                            suffix={
                                <span className="text-xs" style={{ color: 1 > 0 ? '#52c41a' : '#ff4d4f' }}>
                                    {user?.pagination?.total > 0 ? <RiseOutlined /> : <FallOutlined />}
                                    {' '}{Math.abs(user?.pagination?.total || 0)}%
                                </span>
                            }
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Projects"
                            loading={projectStatus === 'loading'}
                            value={project?.pagination?.total || 0}
                            prefix={<ProjectOutlined />}
                            suffix={
                                <span className="text-xs" style={{ color: project?.pagination?.total > 0 ? '#52c41a' : '#ff4d4f' }}>
                                    {project?.pagination?.total > 0 ? <RiseOutlined /> : <FallOutlined />}
                                    {' '}{Math.abs(project?.pagination?.total || 0)}%
                                </span>
                            }
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Learning Programs"
                            loading={groupStatus === 'loading'}
                            value={group?.pagination?.total || 0}
                            prefix={<BookOutlined />}
                            suffix={
                                <span className="text-xs" style={{ color: group?.pagination?.total > 0 ? '#52c41a' : '#ff4d4f' }}>
                                    {group?.pagination?.total > 0 ? <RiseOutlined /> : <FallOutlined />}
                                    {' '}{Math.abs(group?.pagination?.total || 0)}%
                                </span>
                            }
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Active Groups"
                            loading={groupStatus === 'loading'}
                            value={group?.pagination?.total || 0}
                            prefix={<TeamOutlined />}
                            suffix={
                                <span className="text-xs" style={{ color: group?.pagination?.total > 0 ? '#52c41a' : '#ff4d4f' }}>
                                    {group?.pagination?.total > 0 ? <RiseOutlined /> : <FallOutlined />}
                                    {' '}{Math.abs(group?.pagination?.total || 0)}%
                                </span>
                            }
                        />
                    </Card>
                </Col>
            </Row>

            {/* System Health */}
            <Card title="System Health" className="mb-6">
                <Row gutter={16}>
                    <Col span={6}>
                        <Progress
                            type="dashboard"
                            percent={systemHealth?.data?.cpuUsage || 0}
                            title="CPU Usage"
                            status={systemHealth?.data?.cpuUsage > 80 ? 'exception' : 'normal'}
                        />
                        <div className="text-center mt-2">CPU Usage</div>
                    </Col>
                    <Col span={6}>
                        <Progress
                            type="dashboard"
                            percent={systemHealth?.data?.memoryUsage || 0}
                            status={systemHealth?.data?.memoryUsage > 80 ? 'exception' : 'normal'}
                        />
                        <div className="text-center mt-2">Memory Usage</div>
                    </Col>
                    <Col span={6}>
                        <Progress
                            type="dashboard"
                            percent={systemHealth?.data?.diskUsage || 0}
                            status={systemHealth?.data?.diskUsage > 80 ? 'exception' : 'normal'}
                        />
                        <div className="text-center mt-2">Disk Usage</div>
                    </Col>
                    <Col span={6}>
                        <Progress
                            type="dashboard"
                            percent={systemHealth?.data?.systemHealth || 0}
                            status={systemHealth?.data?.systemHealth < 60 ? 'exception' : 'normal'}
                        />
                        <div className="text-center mt-2">Overall Health</div>
                    </Col>
                </Row>

                {/* Server Details */}
                <div className="mt-4 p-4 border-t">
                    <Row gutter={16}>
                        <Col span={6}>
                            <div className="text-gray-500">Server Uptime</div>
                            <div className="font-medium">{systemHealth?.data?.uptime}</div>
                        </Col>
                        <Col span={6}>
                            <div className="text-gray-500">Active Connections</div>
                            <div className="font-medium">{systemHealth?.data?.activeConnections}</div>
                        </Col>
                        <Col span={6}>
                            <div className="text-gray-500">Response Time</div>
                            <div className="font-medium">{systemHealth?.data?.responseTime}</div>
                        </Col>
                        <Col span={6}>
                            <div className="text-gray-500">Last Restart</div>
                            <div className="font-medium">{systemHealth?.data?.lastRestart}</div>
                        </Col>
                    </Row>
                    <Row gutter={16} className="mt-4">
                        <Col span={6}>
                            <div className="text-gray-500">Node.js Version</div>
                            <div className="font-medium">{systemHealth?.data?.nodejsVersion}</div>
                        </Col>
                        <Col span={6}>
                            <div className="text-gray-500">Express Version</div>
                            <div className="font-medium">{systemHealth?.data?.expressVersion}</div>
                        </Col>
                        <Col span={6}>
                            <div className="text-gray-500">OS Platform</div>
                            <div className="font-medium">Ubuntu Server</div>
                        </Col>
                        <Col span={6}>
                            <div className="text-gray-500">Environment</div>
                            <div className="font-medium">Production</div>
                        </Col>
                    </Row>
                </div>
            </Card>

            {/* Analytics Tabs */}
            <Card className="mb-6">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="User Activity" key="1">
                        <div style={{ height: 400 }}>
                            <Area {...userActivityConfig} />
                        </div>
                    </TabPane>
                    <TabPane tab="Learning Progress" key="2">
                        <div style={{ height: 400 }}>
                            <Column {...learningProgressConfig} />
                        </div>
                    </TabPane>
                </Tabs>
            </Card>

            {/* Recent Activities */}
            <Card title="Recent Activities">
                <Table
                    columns={activityColumns}
                    dataSource={recentActivities?.data}
                    rowKey="id"
                    pagination={false}
                />
            </Card>
        </div>
    );
};

export default AdminDashboard; 