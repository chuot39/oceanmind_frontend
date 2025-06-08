import React from 'react';
import { Drawer, Avatar, Row, Col, Statistic, Card, List, Tag, Timeline } from 'antd';
import {
    UserOutlined, UserAddOutlined, HistoryOutlined,
    LockOutlined, UnlockOutlined
} from '@ant-design/icons';
import moment from 'moment';

const UserDetailDrawer = ({ visible, onClose, user }) => {
    if (!user) return null;

    return (
        <Drawer
            title="Chi tiết người dùng"
            width={720}
            visible={visible}
            onClose={onClose}
            bodyStyle={{ paddingBottom: 80 }}
        >
            <div className="mb-6">
                <div className="flex items-center mb-4">
                    <Avatar
                        size={64}
                        src={user.avatar_url}
                        icon={<UserOutlined />}
                    />
                    <div className="ml-4">
                        <h2 className="text-2xl font-bold">{user.fullname}</h2>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                </div>
            </div>

            <Row gutter={16} className="mb-6">
                <Col span={8}>
                    <Statistic
                        title="Ngày tham gia"
                        value={moment(user.createdAt).format('DD/MM/YYYY')}
                        prefix={<UserAddOutlined />}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Hoạt động cuối"
                        value={moment(user.last_active).fromNow()}
                        prefix={<HistoryOutlined />}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="Trạng thái"
                        value={user?.status?.toUpperCase()}
                        prefix={user?.status === 'active' ? <UnlockOutlined /> : <LockOutlined />}
                    />
                </Col>
            </Row>

            <Card title="Quyền" className="mb-6">
                <List
                    dataSource={user.permissions || []}
                    renderItem={permission => (
                        <List.Item>
                            <Tag color="blue">{permission}</Tag>
                        </List.Item>
                    )}
                />
            </Card>

            <Card title="Hoạt động gần đây">
                <Timeline>
                    {(user.recent_activity || []).map((activity, index) => (
                        <Timeline.Item key={index}>
                            <p>{activity.action}</p>
                            <p className="text-gray-500">{moment(activity.timestamp).format('DD/MM/YYYY HH:mm')}</p>
                        </Timeline.Item>
                    ))}
                    {!user.recent_activity || user.recent_activity.length === 0 ? (
                        <Timeline.Item>Không có hoạt động gần đây</Timeline.Item>
                    ) : null}
                </Timeline>
            </Card>
        </Drawer>
    );
};

export default UserDetailDrawer; 