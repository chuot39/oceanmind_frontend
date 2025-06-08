import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Drawer, Space, Divider, Upload, message } from 'antd';
import { BsPlus, BsPencil, BsUpload, BsImage } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useCreateEvent, useUpdateEvent, useUploadBanner } from '../mutationHook';
import dayjs from 'dayjs';
import ImgCrop from 'antd-img-crop';
import { CameraOutlined, PlusOutlined } from '@ant-design/icons';


const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EventForm = ({ visible, onClose, initialValues = null, isEdit = false }) => {
    const intl = useIntl();
    const [form] = Form.useForm();
    const [currentFile, setCurrentFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const { mutate: createEvent, isLoading: isCreating } = useCreateEvent();
    const { mutate: updateEvent, isLoading: isUpdating } = useUpdateEvent();

    const isSubmitting = isCreating || isUpdating;

    // Reset form when drawer opens with initial values
    useEffect(() => {
        if (visible) {
            if (initialValues) {
                // Ensure dates are properly formatted as dayjs objects
                const startDate = initialValues.start_date ? dayjs(initialValues.start_date) : null;
                const dueDate = initialValues.due_date ? dayjs(initialValues.due_date) : null;

                form.setFieldsValue({
                    name: initialValues.name,
                    description: initialValues.description,
                    location: initialValues.location,
                    date: (startDate && dueDate) ? [startDate, dueDate] : undefined
                });
                setCurrentFile(initialValues.banner?.file_path || null);
            } else {
                form.resetFields();
            }
        }
    }, [visible, form, initialValues]);

    // Prevent selecting dates in the past
    const disabledDate = (current) => {
        return current && current < dayjs().startOf('day');
    };

    const handleSubmit = () => {
        form.validateFields().then(values => {
            const submitData = async () => {
                values.banner = currentFile

                if (isEdit && initialValues) {
                    updateEvent({
                        documentId: initialValues.documentId,
                        data: values
                    }, {
                        onSuccess: () => {
                            onClose();
                        },
                        onError: () => { }
                    });
                } else {
                    createEvent(values, {
                        onSuccess: () => {
                            onClose();
                        },
                        onError: () => { }
                    });
                }
            };

            submitData();
        });
    };

    // Dummy request để không thực sự upload file khi chọn
    const dummyRequest = ({ onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };
    // Kiểm tra định dạng file
    const isValidFileType = (file) => {
        const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        return acceptedTypes.includes(file.type);
    };


    const handleBannerUpload = ({ file }) => {
        // Kiểm tra định dạng file
        if (!isValidFileType(file)) {
            message.error(`File ${file.name} không được hỗ trợ. Chỉ chấp nhận file PNG, JPG.`);
            return;
        }

        // Lưu file hiện tại
        setCurrentFile(file);

        // Tạo URL preview cho file
        if (file.originFileObj) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file.originFileObj);
        }
    };
    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };


    const uploadButton = (
        <div className="flex flex-col items-center justify-center">
            <BsUpload size={24} />
            <div className="mt-2">
                <FormattedMessage id="event.form.upload_banner" defaultMessage="Upload Banner" />
            </div>
        </div>
    );

    return (
        <Drawer
            title={
                <div className="flex items-center gap-2">
                    {isEdit ? <BsPencil size={18} /> : <BsPlus size={18} />}
                    <FormattedMessage
                        id={isEdit ? 'event.edit.title' : 'event.create.title'}
                        defaultMessage={isEdit ? 'Edit Event' : 'Create New Event'}
                    />
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={600}
            extra={
                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>
                        <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={isSubmitting}
                    >
                        <FormattedMessage
                            id={isEdit ? 'common.update' : 'common.create'}
                            defaultMessage={isEdit ? 'Update' : 'Create'}
                        />
                    </Button>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label={<FormattedMessage id="event.form.banner" defaultMessage="Event Banner" />}
                >
                    <div className="relative overflow-hidden rounded-lg shadow-sm border border-gray-200 cursor-pointer" style={{ height: '200px' }}>
                        {previewImage ? (
                            <img
                                src={previewImage}
                                alt="Banner Preview"
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        ) : initialValues?.banner?.file_path ? (
                            <img
                                src={initialValues.banner.file_path}
                                alt="Banner Preview"
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full transition-colors duration-300">
                                <BsImage size={40} className="text_secondary mb-2" />
                                <p className="text_secondary font-medium">
                                    <FormattedMessage id="event.form.upload_banner" defaultMessage="Upload Banner Image" />
                                </p>
                                <p className="text-xs text_secondary mt-1">
                                    <FormattedMessage id="event.form.banner_hint" defaultMessage="Recommended size: 800x400 pixels" />
                                </p>
                            </div>
                        )}

                        <ImgCrop aspect={2 / 1} quality={1} modalTitle={intl.formatMessage({ id: 'event.form.crop_banner', defaultMessage: 'Crop Banner Image' })}>
                            <Upload
                                accept=".jpg,.jpeg,.png"
                                showUploadList={false}
                                customRequest={dummyRequest}
                                onChange={handleBannerUpload}
                                fileList={currentFile ? [currentFile] : []}
                                onPreview={onPreview}
                                beforeUpload={(file) => {
                                    if (!isValidFileType(file)) {
                                        message.error(intl.formatMessage({
                                            id: 'event.form.invalid_file_type',
                                            defaultMessage: 'Only JPG, JPEG and PNG files are supported'
                                        }));
                                        return Upload.LIST_IGNORE;
                                    }
                                    // Kiểm tra kích thước file (tối đa 5MB)
                                    if (file.size > 5 * 1024 * 1024) {
                                        message.error(intl.formatMessage({
                                            id: 'event.form.file_too_large',
                                            defaultMessage: 'Image must be smaller than 5MB'
                                        }));
                                        return Upload.LIST_IGNORE;
                                    }
                                    return true;
                                }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300">
                                    <Button
                                        type="primary"
                                        icon={<CameraOutlined />}
                                        className="opacity-0 hover:opacity-100 transition-opacity duration-300 absolute bottom-4 right-4 shadow-lg"
                                    >
                                        <FormattedMessage id="event.form.change_banner" defaultMessage="Change Banner" />
                                    </Button>
                                </div>
                            </Upload>
                        </ImgCrop>
                    </div>
                </Form.Item>

                <Form.Item
                    name="name"
                    label={<FormattedMessage id="event.form.name" defaultMessage="Event Name" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'event.form.name_required',
                                defaultMessage: 'Please enter event name'
                            })
                        }
                    ]}
                >
                    <Input
                        placeholder={intl.formatMessage({
                            id: 'event.form.name_placeholder',
                            defaultMessage: 'Enter event name'
                        })}
                    />
                </Form.Item>

                <Form.Item
                    name="date"
                    label={<FormattedMessage id="event.form.date" defaultMessage="Event Date" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'event.form.date_required',
                                defaultMessage: 'Please select event date'
                            })
                        }
                    ]}
                >
                    <RangePicker
                        className="w-full"
                        format="DD/MM/YYYY"
                        disabledDate={disabledDate}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        popupClassName="date-range-popup"
                        presets={[
                            {
                                label: intl.formatMessage({ id: 'event.date.next_week', defaultMessage: 'Next Week' }),
                                value: [dayjs().add(1, 'day'), dayjs().add(7, 'days')]
                            },
                            {
                                label: intl.formatMessage({ id: 'event.date.next_month', defaultMessage: 'Next Month' }),
                                value: [dayjs().add(1, 'day'), dayjs().add(30, 'days')]
                            }
                        ]}
                        placeholder={[
                            intl.formatMessage({ id: 'event.form.start_date', defaultMessage: 'Start Date' }),
                            intl.formatMessage({ id: 'event.form.end_date', defaultMessage: 'End Date' })
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    name="location"
                    label={<FormattedMessage id="event.form.location" defaultMessage="Location" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'event.form.location_required',
                                defaultMessage: 'Please enter event location'
                            })
                        }
                    ]}
                >
                    <Input
                        placeholder={intl.formatMessage({
                            id: 'event.form.location_placeholder',
                            defaultMessage: 'Enter event location'
                        })}
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={<FormattedMessage id="event.form.description" defaultMessage="Description" />}
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({
                                id: 'event.form.description_required',
                                defaultMessage: 'Please enter event description'
                            })
                        }
                    ]}
                >
                    <TextArea
                        rows={6}
                        placeholder={intl.formatMessage({
                            id: 'event.form.description_placeholder',
                            defaultMessage: 'Enter event description'
                        })}
                    />
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default EventForm; 