import React, { useEffect } from 'react';
import { Drawer, Form, Button, DatePicker, Space, Divider, Radio } from 'antd';
import { BsFilter } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';

const { RangePicker } = DatePicker;

const FilterDrawer = ({ visible, onClose, onApply, currentFilters = {} }) => {
    const intl = useIntl();
    const [form] = Form.useForm();

    // Reset form when drawer opens with current filters
    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                dateRange: currentFilters.dateRange,
                sortBy: currentFilters.sortBy || 'date_desc',
                status: currentFilters.status,
            });
        }
    }, [visible, form, currentFilters]);

    const handleReset = () => {
        form.resetFields();
    };

    const handleApply = () => {
        const values = form.getFieldsValue();
        onApply(values);
        onClose();
    };

    return (
        <Drawer
            title={
                <div className="flex items-center gap-2">
                    <BsFilter size={18} />
                    <FormattedMessage id="admin.dashboard.event.filter.title" defaultMessage="Filter Events" />
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={320}
            footer={
                <div className="flex justify-end gap-2">
                    <Button onClick={handleReset}>
                        <FormattedMessage id="common.reset" defaultMessage="Reset" />
                    </Button>
                    <Button type="primary" onClick={handleApply}>
                        <FormattedMessage id="common.apply" defaultMessage="Apply" />
                    </Button>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="dateRange"
                    label={<FormattedMessage id="admin.dashboard.event.filter.date_range" defaultMessage="Date Range" />}
                >
                    <RangePicker
                        className="w-full"
                        format="DD/MM/YYYY"
                        placeholder={[
                            intl.formatMessage({ id: 'common.start_date', defaultMessage: 'Start Date' }),
                            intl.formatMessage({ id: 'common.end_date', defaultMessage: 'End Date' })
                        ]}
                    />
                </Form.Item>

                <Divider className="my-3" />

                <Form.Item
                    name="status"
                    label={<FormattedMessage id="admin.dashboard.event.filter.status" defaultMessage="Event Status" />}
                >
                    <Radio.Group>
                        <Space direction="vertical">
                            <Radio className="text-red-500" value="upcoming">
                                <FormattedMessage id="admin.dashboard.event.filter.upcoming" defaultMessage="Upcoming" />
                            </Radio>
                            <Radio className="text-green-500" value="ongoing">
                                <FormattedMessage id="admin.dashboard.event.filter.ongoing" defaultMessage="Ongoing" />
                            </Radio>
                            <Radio className="text_secondary" value="past">
                                <FormattedMessage id="admin.dashboard.event.filter.past" defaultMessage="Past" />
                            </Radio>
                            <Radio className="text-blue-500" value={undefined}>
                                <FormattedMessage id="admin.dashboard.event.filter.all" defaultMessage="All" />
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>

                <Divider className="my-3" />

                <Form.Item
                    name="sortBy"
                    label={<FormattedMessage id="admin.dashboard.event.filter.sort_by" defaultMessage="Sort By" />}
                >
                    <Radio.Group>
                        <Space direction="vertical">
                            <Radio value="date_desc" className="text_first">
                                <FormattedMessage id="admin.dashboard.event.filter.date_desc" defaultMessage="Date (Newest First)" />
                            </Radio>
                            <Radio value="date_asc" className="text_first">
                                <FormattedMessage id="admin.dashboard.event.filter.date_asc" defaultMessage="Date (Oldest First)" />
                            </Radio>
                            <Radio value="name" className="text_first">
                                <FormattedMessage id="admin.dashboard.event.filter.name" defaultMessage="Name (A-Z)" />
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default FilterDrawer; 