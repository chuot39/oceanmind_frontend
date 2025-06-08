import React, { useMemo, useState } from 'react';
import { Card, Button, Select, DatePicker, Form } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUserReports } from './hook';
import ReportTable from './components/ReportTable';
import ReportDetail from './components/ReportDetail';
import StatCards from './components/StatCards';
import './user-report.scss';

const { RangePicker } = DatePicker;
const { Option } = Select;

const UserReportDashboard = () => {
    const intl = useIntl();
    const [form] = Form.useForm();

    // State for pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    // State for filters
    const [filterValues, setFilterValues] = useState({});

    // State for report detail
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [detailReport, setDetailReport] = useState(null);

    // Fetch reports with filters
    const { data: reportsData, isLoading: isLoadingReports } = useUserReports({
        ...filterValues,
    });

    const totalReports = useMemo(() => reportsData?.pages.flatMap(page => page.data), [reportsData]);

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
    };

    // Handle filter apply
    const handleFilter = () => {
        const values = form.getFieldsValue();
        setFilterValues(values);
        setPagination({ ...pagination, current: 1 });
    };

    // Handle view report details
    const handleView = (report) => {
        setDetailReport(report);
        setIsDetailVisible(true);
    };

    // Handle detail close
    const handleDetailClose = () => {
        setIsDetailVisible(false);
        setDetailReport(null);
    };

    // Handle clearing all filters
    const handleClearAllFilters = () => {
        form.resetFields();
        setFilterValues({});
    };


    console.log('totalReports', totalReports);

    return (
        <div className="user-report-dashboard min-h-screen p-4">
            <div className="mx-auto">
                <h1 className="text-3xl font-bold text_first mb-4">
                    <FormattedMessage id="admin.report.user.title" defaultMessage="User Reports Dashboard" />
                </h1>

                {/* Statistics Cards */}
                <StatCards reports={totalReports} isLoading={isLoadingReports} />

                <Card className="mb-6">
                    <Form
                        form={form}
                        layout="horizontal"
                        className="filter-form"
                        initialValues={filterValues}
                        onFinish={handleFilter}
                    >
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <Form.Item
                                name="status_report"
                                label={<span className='text_first'><FormattedMessage id="reuse.status" defaultMessage="Status" /></span>}
                                className="mb-0 flex-1 min-w-[200px]"
                            >
                                <Select
                                    placeholder={intl.formatMessage({
                                        id: 'reuse.status_placeholder',
                                        defaultMessage: 'Select status'
                                    })}
                                    allowClear
                                    style={{ width: '100%' }}
                                >
                                    <Option value="pending">
                                        <FormattedMessage id="admin.report.post.stats.pending" defaultMessage="Pending" />
                                    </Option>
                                    <Option value="denied">
                                        <FormattedMessage id="admin.report.post.stats.denied" defaultMessage="Denied" />
                                    </Option>
                                    <Option value="resolved">
                                        <FormattedMessage id="admin.report.post.stats.resolved" defaultMessage="Resolved" />
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="dateRange"
                                label={<span className='text_first'><FormattedMessage id="reuse.date_range" defaultMessage="Report Date" /></span>}
                                className="mb-0 flex-1 min-w-[200px]"
                            >
                                <RangePicker format="DD/MM/YYYY" style={{ width: '100%' }}
                                    placeholder={[
                                        intl.formatMessage({
                                            id: 'reuse.start_date_placeholder',
                                            defaultMessage: 'Start Date',
                                        }),
                                        intl.formatMessage({
                                            id: 'reuse.end_date_placeholder',
                                            defaultMessage: 'End Date',
                                        }),
                                    ]}
                                />
                            </Form.Item>

                            <Form.Item
                                name="sortBy"
                                label={<span className='text_first'><FormattedMessage id="reuse.sort_by" defaultMessage="Sort By" /></span>}
                                className="mb-0 flex-1 min-w-[150px]"
                            >
                                <Select
                                    placeholder={intl.formatMessage({
                                        id: 'reuse.sort_by_placeholder',
                                        defaultMessage: 'Select sort order'
                                    })}
                                    allowClear
                                    style={{ width: '100%' }}
                                >
                                    <Option value="newest">
                                        <FormattedMessage id="reuse.newest" defaultMessage="Newest First" />
                                    </Option>
                                    <Option value="oldest">
                                        <FormattedMessage id="reuse.oldest" defaultMessage="Oldest First" />
                                    </Option>
                                    <Option value="status_report_asc">
                                        <FormattedMessage id="reuse.status_report_asc" defaultMessage="Status Report ASC" />
                                    </Option>
                                    <Option value="status_report_desc">
                                        <FormattedMessage id="reuse.status_report_desc" defaultMessage="Status Report DESC" />
                                    </Option>
                                </Select>
                            </Form.Item>

                            <Button type="primary" onClick={handleFilter}>
                                <FormattedMessage id="common.apply" defaultMessage="Apply" />
                            </Button>

                            <Button onClick={handleClearAllFilters}>
                                <FormattedMessage id="common.reset" defaultMessage="Reset" />
                            </Button>
                        </div>
                    </Form>

                    <ReportTable
                        data={totalReports}
                        loading={isLoadingReports}
                        pagination={{
                            ...pagination,
                            total: totalReports?.length || 0
                        }}
                        onChange={handleTableChange}
                        onView={handleView}
                    />
                </Card>
            </div>

            {/* Report Detail Drawer */}
            <ReportDetail
                visible={isDetailVisible}
                onClose={handleDetailClose}
                report={detailReport}
            />
        </div>
    );
};

export default UserReportDashboard;