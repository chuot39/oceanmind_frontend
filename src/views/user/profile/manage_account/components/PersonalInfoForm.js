import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, Card, Button, DatePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import { isEqual } from 'lodash';
import { getPlaceholderSocial } from '@/utils/format/formartText';
import { useUpdateUserInfoBasic } from '../hookMutation';
import { useUpdateUserInfo } from '@/utils/hooks/useAuth';
import { notifyError, notifySuccess } from '@/utils/Utils';
import GenderSelect from '@/components/elements/GenderSelect';
import { Controller, useForm } from 'react-hook-form';
import FacultySelect from '@/components/elements/FacultySelect';
import SpecializeSelect from '@/components/elements/SpecializeSelect';
import ClassSelect from '@/components/elements/ClassSelect';
import moment from 'moment';

const PersonalInfoForm = ({ userData, intl, language }) => {
    // Prepare initial values from userData
    const initialValues = useMemo(() => ({
        fullname: userData?.fullname,
        nickname: userData?.nickname,
        phone: userData?.phone,
        address: userData?.address,
        faculty: userData?.regularClass?.specialized?.faculty?.documentId,
        major: userData?.regularClass?.specialized?.documentId,
        class: userData?.regularClass ? {
            value: userData?.regularClass?.documentId,
            label: userData?.regularClass?.name
        } : undefined,
        gender: userData?.gender?.documentId,
        birthday: userData?.date_of_birth ? moment(userData?.date_of_birth) : undefined
    }), [userData]);

    console.log('userData', userData);

    // Initialize Ant Design Form
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);

    // Initialize React Hook Form with same values
    const { control, setValue } = useForm({
        defaultValues: initialValues
    });

    // Track dependent fields that need special handling
    const [faculty, setFaculty] = useState(initialValues.faculty);
    const [major, setMajor] = useState(initialValues.major);
    const [gender, setGender] = useState(initialValues.gender);

    // Data fetching hooks
    const { mutateAsync: updateUserInfo, isLoading: isUpdating } = useUpdateUserInfo();
    const { mutateAsync: updateUserInfoBasic, isLoading: isUpdatingUserInfoBasic } = useUpdateUserInfoBasic();

    // Check for form changes
    const hasChanges = useMemo(() =>
        initialValues && formValues && !isEqual(initialValues, formValues),
        [initialValues, formValues]);

    // Initialize form with values
    useEffect(() => {
        form.setFieldsValue(initialValues);
    }, [form, initialValues]);

    // Handle faculty change and reset dependent fields
    const handleFacultyChange = (value) => {
        // Update faculty state
        setFaculty(value?.documentId);

        // Reset dependent fields in Ant Design form
        form.setFieldsValue({
            major: undefined,
            class: undefined
        });

        // Reset dependent fields in React Hook Form
        setValue('major', undefined);
        setValue('class', undefined);

        // Reset major state
        setMajor(null);
    };

    // Handle major change and reset dependent class
    const handleMajorChange = (value) => {
        // Update major state
        setMajor(value);

        // Reset class field in Ant Design form
        form.setFieldsValue({
            class: undefined
        });

        // Reset class field in React Hook Form
        setValue('class', undefined);
    };

    // Form submission handler
    const handleSubmit = async (values) => {
        try {
            const dataSubmit = {
                userId: userData?.documentId,
                dataSubmit: {
                    fullname: values?.fullname,
                    nickname: values?.nickname,
                    phone: values?.phone,
                    address: values?.address,
                    regular_class_id: values?.class?.value,
                    gender_id: values?.gender,
                    date_of_birth: values?.birthday ? values.birthday.format('YYYY-MM-DD') : null
                }
            };

            await updateUserInfoBasic(dataSubmit, {
                onSuccess: (res) => {
                    updateUserInfo();
                },
                onError: (error) => {
                    console.error('Update error:', error);
                    notifyError(intl.formatMessage({ id: 'common.update_error' }));
                }
            });
        } catch (error) {
            console.error('Update error:', error);
            notifyError(intl.formatMessage({ id: 'common.update_error' }));
        }
    };

    return (
        <Card className="personal-info-form mb-6">
            <h2 className="text-xl font-semibold mb-4">
                <FormattedMessage id="profile.manage_account.personal_info" />
            </h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={initialValues}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* fullname */}
                    <Form.Item
                        name="fullname"
                        label={<FormattedMessage id="profile.manage_account.fullname" />}
                        rules={[
                            { required: true, message: intl.formatMessage({ id: 'profile.manage_account.fullname_required' }) },
                            { max: 30, message: intl.formatMessage({ id: 'profile.manage_account.fullname_max' }, { max: 30 }) },
                            { min: 3, message: intl.formatMessage({ id: 'profile.manage_account.fullname_min' }, { min: 3 }) },
                        ]}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.fullname_placeholder' })} />
                    </Form.Item>

                    {/* nickname */}
                    <Form.Item
                        name="nickname"
                        label={<FormattedMessage id="profile.manage_account.nickname" />}
                        rules={[
                            { required: true, message: intl.formatMessage({ id: 'profile.manage_account.nickname_required' }) },
                            { max: 30, message: intl.formatMessage({ id: 'profile.manage_account.nickname_max' }, { max: 30 }) },
                            { min: 3, message: intl.formatMessage({ id: 'profile.manage_account.nickname_min' }, { min: 3 }) },
                        ]}
                    >
                        <Input placeholder={intl.formatMessage({ id: 'setting.account.nickname_placeholder' })} />
                    </Form.Item>

                    {/* phone */}
                    <Form.Item
                        name="phone"
                        label={<FormattedMessage id="profile.manage_account.phone" />}
                        rules={[
                            {
                                pattern: /^0[0-9]{9}$/,
                                message: intl.formatMessage({ id: 'profile.manage_account.phone_invalid' })
                            }
                        ]}
                    >
                        <Input placeholder={getPlaceholderSocial('phone')} />
                    </Form.Item>

                    {/* address */}
                    <Form.Item
                        name="address"
                        label={<FormattedMessage id="profile.manage_account.location" />}
                    >
                        <Input placeholder={getPlaceholderSocial('address')} />
                    </Form.Item>

                    {/* gender */}
                    <Form.Item
                        className="flex-1 mb-4"
                        name="gender"
                        label={<FormattedMessage id="profile.manage_account.gender" />}
                    >
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <GenderSelect
                                    value={gender}
                                    onChange={(value) => {
                                        // Update all forms with the same value
                                        field.onChange(value);
                                        setGender(value);
                                        form.setFieldsValue({ gender: value });
                                    }}
                                />
                            )}
                        />
                    </Form.Item>

                    {/* birthday */}
                    <Form.Item
                        className='flex-1 mb-4'
                        name="birthday"
                        label={<FormattedMessage id="profile.manage_account.birthday" />}
                    >
                        <DatePicker
                            className="w-full"
                            format='DD/MM/YYYY'
                        />
                    </Form.Item>

                    {/* faculty */}
                    <Form.Item
                        name="faculty"
                        label={<FormattedMessage id="profile.manage_account.faculty" />}
                    >
                        <Controller
                            name="faculty"
                            control={control}
                            render={({ field }) => (
                                <FacultySelect
                                    value={field.value}
                                    onChange={(value) => {
                                        // Update react-hook-form
                                        field.onChange(value);

                                        // Update ant design form
                                        form.setFieldsValue({ faculty: value });

                                        // Handle dependent fields
                                        handleFacultyChange(value);
                                    }}
                                />
                            )}
                        />
                    </Form.Item>

                    {/* major */}
                    <Form.Item
                        name="major"
                        label={<FormattedMessage id="profile.manage_account.major" />}
                    >
                        <Controller
                            name="major"
                            control={control}
                            render={({ field }) => (
                                <SpecializeSelect
                                    value={field.value}
                                    onChange={(value) => {
                                        // Update react-hook-form
                                        field.onChange(value);

                                        // Update ant design form and state
                                        setMajor(value);
                                        form.setFieldsValue({ major: value });

                                        // Handle dependent fields
                                        handleMajorChange(value);
                                    }}
                                    facultyId={faculty}
                                    disabled={!faculty}
                                />
                            )}
                        />
                    </Form.Item>

                    {/* class */}
                    <Form.Item
                        name="class"
                        label={<FormattedMessage id="profile.manage_account.class" />}
                    >
                        <Controller
                            name="class"
                            control={control}
                            render={({ field }) => (
                                <ClassSelect
                                    value={field.value}
                                    onChange={(value) => {
                                        // Update react-hook-form
                                        field.onChange(value);

                                        // Update ant design form
                                        form.setFieldsValue({ class: value });
                                    }}
                                    specializedId={major}
                                    disabled={!major}
                                />
                            )}
                        />
                    </Form.Item>
                </div>

                <Form.Item className="flex justify-end mt-4">
                    <Button
                        loading={isUpdating || isUpdatingUserInfoBasic}
                        type="primary"
                        htmlType="submit"
                        className="btn_custom_accept"
                        disabled={!hasChanges}
                    >
                        <FormattedMessage id="common.save" />
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default React.memo(PersonalInfoForm); 