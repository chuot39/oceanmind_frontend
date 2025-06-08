import React, { useMemo } from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { BsCalendarEvent, BsCalendarCheck, BsCalendarX, BsCalendarPlus } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { getLevelColor } from '@/helpers/colorHelper';
import moment from 'moment';
const StatCards = ({ events, isLoading }) => {
    // const { data: stats, isLoading: isLoadingStats } = useEventStats();

    const stats = useMemo(() => {
        return {
            total: events?.length || 0,
            upcoming: events?.filter(event => event.start_date > moment().format('YYYY-MM-DD'))?.length || 0,
            ongoing: events?.filter(event => event.start_date <= moment().format('YYYY-MM-DD') && event.due_date >= moment().format('YYYY-MM-DD'))?.length || 0,
            past: events?.filter(event => event.due_date < moment().format('YYYY-MM-DD'))?.length || 0,
        }
    }, [events])

    return (
        <Row gutter={16} className="mb-6">
            <Col xs={24} sm={6}>
                <Card loading={isLoading} className="h-full card_disabled_box_shadow">
                    <Statistic
                        title={<span className="text_first"><FormattedMessage id="event.stats.total" defaultMessage="Total Events" /></span>}
                        value={events?.length || 0}
                        prefix={<BsCalendarEvent className="mr-2 text-blue-500" />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={6}>
                <Card loading={isLoading} className="h-full card_disabled_box_shadow">
                    <Statistic
                        title={<span className="text_first"><FormattedMessage id="event.stats.upcoming" defaultMessage="Upcoming Events" /></span>}
                        value={stats?.upcoming || 0}
                        prefix={<BsCalendarPlus className="mr-2 text-green-500" />}
                        valueStyle={{ color: '#52c41a' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={6}>
                <Card loading={isLoading} className="h-full card_disabled_box_shadow">
                    <Statistic
                        title={<span className="text_first"><FormattedMessage id="event.stats.ongoing" defaultMessage="Ongoing Events" /></span>}
                        value={stats?.ongoing || 0}
                        prefix={<BsCalendarCheck className="mr-2 text-purple-500" />}
                        valueStyle={{ color: '#722ed1' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={6}>
                <Card loading={isLoading} className="h-full card_disabled_box_shadow">
                    <div>
                        <div className="mb-2">
                            <span className="text-base text_first">
                                <FormattedMessage id="event.stats.completion_rate" defaultMessage="Completion Rate" />
                            </span>
                        </div>
                        <Progress
                            type="dashboard"
                            percent={(stats?.past / stats?.total * 100).toFixed(2) || 0}
                            size="small"
                            format={(percent) => <span style={{ color: getLevelColor(stats?.past / stats?.total * 10) }}>{percent}%</span>}
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