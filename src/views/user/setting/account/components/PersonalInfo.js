import React from 'react';
import { Form, Input } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';

const PersonalInfo = ({ form, initialValues }) => {
    const intl = useIntl();

    return (
        <div className="info-section">
            <h2 className="section-title text-xl font-semibold">
                <FormattedMessage id="setting.account.personal_info" />
            </h2>

            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
            >
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        name="fullname"
                        label={<FormattedMessage id="setting.account.fullname" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({ id: 'setting.account.fullname_required' })
                            }
                        ]}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.fullname_placeholder' })} />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label={<FormattedMessage id="setting.account.username" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({ id: 'setting.account.username_required' })
                            }
                        ]}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.username_placeholder' })} />
                    </Form.Item>

                    <Form.Item
                        name="nickname"
                        label={<FormattedMessage id="setting.account.nickname" />}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.nickname_placeholder' })} />
                    </Form.Item>

                    <Form.Item
                        name="major"
                        label={<FormattedMessage id="setting.account.major" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({ id: 'setting.account.major_required' })
                            }
                        ]}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.major_placeholder' })} />
                    </Form.Item>

                    <Form.Item
                        name="class"
                        label={<FormattedMessage id="setting.account.class" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({ id: 'setting.account.class_required' })
                            }
                        ]}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.class_placeholder' })} />
                    </Form.Item>

                    <Form.Item
                        name="studentId"
                        label={<FormattedMessage id="setting.account.student_id" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({ id: 'setting.account.student_id_required' })
                            }
                        ]}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.student_id_placeholder' })} />
                    </Form.Item>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Form.Item
                        name="phone"
                        label={<FormattedMessage id="setting.account.phone" />}
                        rules={[
                            {
                                required: true,
                                message: intl.formatMessage({ id: 'setting.account.phone_required' })
                            }
                        ]}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.phone_placeholder' })} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label={<FormattedMessage id="setting.account.email" />}
                        rules={[
                            {
                                required: true,
                                type: 'email',
                                message: intl.formatMessage({ id: 'setting.account.email_required' })
                            }
                        ]}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.email_placeholder' })} />
                    </Form.Item>

                    <Form.Item
                        name="facebook"
                        label={<FormattedMessage id="setting.account.facebook" />}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.facebook_placeholder' })} />
                    </Form.Item>

                    <Form.Item
                        name="zalo"
                        label={<FormattedMessage id="setting.account.zalo" />}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.zalo_placeholder' })} />
                    </Form.Item>

                    <Form.Item
                        name="github"
                        label={<FormattedMessage id="setting.account.github" />}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.github_placeholder' })} />
                    </Form.Item>

                    <Form.Item
                        name="location"
                        label={<FormattedMessage id="setting.account.location" />}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.location_placeholder' })} />
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default PersonalInfo; 