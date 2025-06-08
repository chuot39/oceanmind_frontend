import React, { useState, useEffect } from 'react';
import { Drawer, Form, Button, Select, DatePicker, Space, Divider, Radio } from 'antd';
import { BsFilter } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNoticeTypes } from '../hook';

const { RangePicker } = DatePicker;
const { Option } = Select;

const FilterDrawer = ({ visible, onClose, onApply, currentFilters = {} }) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const { data: noticeTypesData, isLoading: noticeTypesLoading } = useNoticeTypes();

    // Reset form when drawer opens with current filters
    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                noticeType: currentFilters.noticeType || [],
                isGlobal: currentFilters.isGlobal,
                dateRange: currentFilters.dateRange,
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
                    <FormattedMessage id="admin.dashboard.notification.filter.title" defaultMessage="Filter Notifications" />
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
                    name="noticeType"
                    label={<FormattedMessage id="admin.dashboard.notification.filter.type" defaultMessage="Notification Type" />}
                >
                    <Select
                        mode="multiple"
                        placeholder={intl.formatMessage({
                            id: 'admin.dashboard.notification.filter.type_placeholder',
                            defaultMessage: 'Select notification types'
                        })}
                        loading={noticeTypesLoading}
                        allowClear
                    >
                        {noticeTypesData?.data?.map(type => (
                            <Option key={type.documentId} value={type.documentId}>
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: type.color }}
                                    ></span>
                                    <span>{type.name}</span>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Divider className="my-3" />

                <Form.Item
                    name="isGlobal"
                    label={<FormattedMessage id="admin.dashboard.notification.filter.target" defaultMessage="Target Audience" />}
                >
                    <Radio.Group>
                        <Space direction="vertical">
                            <Radio value={true}>
                                <FormattedMessage id="admin.dashboard.notification.filter.global" defaultMessage="Global" />
                            </Radio>
                            <Radio value={false}>
                                <FormattedMessage id="admin.dashboard.notification.filter.specific" defaultMessage="Specific Users" />
                            </Radio>
                            <Radio value={undefined}>
                                <FormattedMessage id="common.all" defaultMessage="All" />
                            </Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>

                <Divider className="my-3" />

                <Form.Item
                    name="dateRange"
                    label={<FormattedMessage id="admin.dashboard.notification.filter.date_range" defaultMessage="Date Range" />}
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
            </Form>
        </Drawer>
    );
};

export default FilterDrawer; 