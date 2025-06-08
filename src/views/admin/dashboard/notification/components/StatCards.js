import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { BsBell, BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { useNotificationStats } from '../hook';
import { getLevelColor } from '@/helpers/colorHelper';

const StatCards = () => {
    const { data: stats, isLoading } = useNotificationStats();

    return (
        <Row gutter={16} className="mb-6">
            <Col xs={24} sm={8}>
                <Card loading={isLoading} className="h-full card_disabled_box_shadow">
                    <Statistic
                        title={<span className="text_first"><FormattedMessage id="admin.dashboard.notification.stats.total" defaultMessage="Total Notifications" /></span>}
                        value={stats?.data?.total || 0}
                        prefix={<BsBell className="mr-2 text-blue-500" />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={8}>
                <Card loading={isLoading} className="h-full card_disabled_box_shadow">
                    <Statistic
                        title={<span className="text_first"><FormattedMessage id="admin.dashboard.notification.stats.read" defaultMessage="Read Notifications" /></span>}
                        value={stats?.data?.read || 0}
                        prefix={<BsCheckCircle className="mr-2 text-green-500" />}
                        valueStyle={{ color: '#52c41a' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={8}>
                <Card loading={isLoading} className="h-full card_disabled_box_shadow">
                    <div>
                        <div className="mb-2">
                            <span className="text-base text_first">
                                <FormattedMessage id="admin.dashboard.notification.stats.read_percentage" defaultMessage="Read Rate" />
                            </span>
                        </div>
                        <Progress
                            type="dashboard"
                            percent={(stats?.data?.read / stats?.data?.total * 100).toFixed(2) || 0}
                            size="small"
                            format={(percent) => <span style={{ color: getLevelColor(stats?.data?.read / stats?.data?.total * 10) }}>{percent}%</span>}
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                        />
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default StatCards; 