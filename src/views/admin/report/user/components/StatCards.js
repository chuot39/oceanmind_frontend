import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { BsFlag, BsClock, BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';

const StatCards = ({ reports, isLoading }) => {
    const stats = {
        total: reports?.length || 0,
        pending: reports?.filter(report => report.status_report === 'pending')?.length || 0,
        denied: reports?.filter(report => report.status_report === 'denied')?.length || 0,
        resolved: reports?.filter(report => report.status_report === 'resolved')?.length || 0,
    }
    return (
        <Row gutter={16} className="mb-6">
            <Col xs={24} sm={12} md={6}>
                <Card loading={isLoading} className="h-full">
                    <Statistic
                        title={<span className='text_first'><FormattedMessage id="admin.report.post.stats.total" defaultMessage="Total Reports" /></span>}
                        value={stats?.total || 0}
                        prefix={<BsFlag className="mr-2 text-blue-500" />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card loading={isLoading} className="h-full">
                    <Statistic
                        title={<span className='text_first'><FormattedMessage id="admin.report.post.stats.pending" defaultMessage="Pending" /></span>}
                        value={stats?.pending || 0}
                        prefix={<BsClock className="mr-2 text-orange-500" />}
                        valueStyle={{ color: '#fa8c16' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card loading={isLoading} className="h-full">
                    <Statistic
                        title={<span className='text_first'><FormattedMessage id="admin.report.post.stats.denied" defaultMessage="Denied" /></span>}
                        value={stats?.denied || 0}
                        prefix={<BsExclamationCircle className="mr-2 text-purple-500" />}
                        valueStyle={{ color: '#722ed1' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Card loading={isLoading} className="h-full">
                    <Statistic
                        title={<span className='text_first'><FormattedMessage id="admin.report.post.stats.resolved" defaultMessage="Resolved" /></span>}
                        value={stats?.resolved || 0}
                        prefix={<BsCheckCircle className="mr-2 text-green-500" />}
                        valueStyle={{ color: '#52c41a' }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default StatCards; 