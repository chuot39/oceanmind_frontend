import React from 'react';
import { Drawer, Form, Input, DatePicker, Select, Switch, Button } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

const { TextArea } = Input;

const EventDrawer = ({
    visible,
    onClose,
    event,
    mode = 'add'
}) => {
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        // Handle form submission
        console.log(values);
        onClose();
    };

    const labelOptions = [
        { value: 'personal', label: 'Personal', color: 'red' },
        { value: 'business', label: 'Business', color: 'blue' },
        { value: 'family', label: 'Family', color: 'orange' },
        { value: 'holiday', label: 'Holiday', color: 'green' },
        { value: 'etc', label: 'ETC', color: 'cyan' }
    ];

    return (
        <Drawer
            title={
                mode === 'add' ? (
                    <FormattedMessage id="calendar.add_event" defaultMessage="Add Event" />
                ) : (
                    <FormattedMessage id="calendar.edit_event" defaultMessage="Update Event" />
                )
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={400}
            extra={
                <div className="flex gap-2">
                    {mode === 'edit' && (
                        <Button danger>
                            <FormattedMessage id="calendar.delete" defaultMessage="Delete" />
                        </Button>
                    )}
                    <Button type="primary" onClick={() => form.submit()}>
                        {mode === 'add' ? (
                            <FormattedMessage id="calendar.add" defaultMessage="Add" />
                        ) : (
                            <FormattedMessage id="calendar.update" defaultMessage="Update" />
                        )}
                    </Button>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    ...event,
                    startDate: event?.startDate ? moment(event.startDate) : null,
                    endDate: event?.endDate ? moment(event.endDate) : null
                }}
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="title"
                    label={<FormattedMessage id="calendar.event_title" defaultMessage="Title" />}
                    rules={[{ required: true, message: 'Please input event title!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="label"
                    label={<FormattedMessage id="calendar.label" defaultMessage="Label" />}
                >
                    <Select
                        options={labelOptions}
                        placeholder="Select label"
                    />
                </Form.Item>

                <Form.Item
                    name="startDate"
                    label={<FormattedMessage id="calendar.start_date" defaultMessage="Start Date" />}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item
                    name="endDate"
                    label={<FormattedMessage id="calendar.end_date" defaultMessage="End Date" />}
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item
                    name="allDay"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren={
                            <FormattedMessage id="calendar.all_day" defaultMessage="All Day" />
                        }
                        unCheckedChildren={
                            <FormattedMessage id="calendar.all_day" defaultMessage="All Day" />
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="url"
                    label={<FormattedMessage id="calendar.event_url" defaultMessage="Event URL" />}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="guests"
                    label={<FormattedMessage id="calendar.add_guests" defaultMessage="Add Guests" />}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select guests"
                        options={[
                            // Add your guest options here
                            { value: 'user1', label: 'User 1' },
                            { value: 'user2', label: 'User 2' }
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="location"
                    label={<FormattedMessage id="calendar.location" defaultMessage="Location" />}
                >
                    <Input placeholder="Enter Location" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={<FormattedMessage id="calendar.description" defaultMessage="Description" />}
                >
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default EventDrawer; 