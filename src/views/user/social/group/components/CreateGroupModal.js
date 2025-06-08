import React, { useState } from 'react';
import { Modal, Form, Input, Button, Switch, Upload, message } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { CameraOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { uploadImage } from '@/helpers/imgHelper';
import { useNavigate } from 'react-router-dom';
import { useCreateGroup } from '../../shared/actions/mutationHooks';

const CreateGroupModal = ({ userData }) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [uploading, setUploading] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();
    const createGroupMutation = useCreateGroup();
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

    // Kiểm tra định dạng file
    const isValidFileType = (file) => {
        const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        return acceptedTypes.includes(file.type);
    };

    // Dummy request để không thực sự upload file khi chọn
    const dummyRequest = ({ onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const handleBannerUpload = ({ file }) => {
        // Kiểm tra định dạng file
        if (!isValidFileType(file)) {
            message.error(`File ${file.name} không được hỗ trợ. Chỉ chấp nhận file PNG, JPG.`);
            return;
        }

        // Lưu file hiện tại
        setCurrentFile(file);

        // Xử lý trạng thái uploading
        if (file.status === 'uploading') {
            setUploading(true);
            return;
        }

        if (file.status === 'done' || file.status === 'error') {
            setUploading(false);
        }

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

    const handleCreateGroup = async (values) => {
        try {
            setUploading(true);

            // Chuẩn bị dữ liệu tạo nhóm
            const groupData = {
                ...values,
                group_created_by: userData?.documentId
            };

            // Upload ảnh bìa nếu có
            if (currentFile && currentFile.originFileObj) {
                try {
                    const bannerFile = await uploadImage(currentFile.originFileObj);
                    if (bannerFile && bannerFile?.data?.documentId) {
                        groupData.cover_img_id = bannerFile.data.documentId;
                    }
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    message.error('Không thể tải lên ảnh bìa. Vui lòng thử lại.');
                    setUploading(false);
                    return;
                }
            }

            // Gọi API tạo nhóm
            await createGroupMutation.mutateAsync(groupData, {
                onSuccess: (data) => {
                    handleClose();

                    console.log('data response', data);
                    if (data && data?.data?.documentId) {
                        navigate(`/social/group/${data?.data?.documentId}`);
                    }
                },
                onError: (error) => {
                    console.error('Error creating group:', error);
                    message.error('Không thể tạo nhóm. Vui lòng thử lại.');
                }
            });

            setUploading(false);
        } catch (error) {
            console.error('Error in handleCreateGroup:', error);
            message.error('Đã xảy ra lỗi: ' + (error.message || 'Không thể tạo nhóm'));
            setUploading(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setPreviewImage(null);
        setCurrentFile(null);
        closeGroupModal();
    };

    // Group Modal functions
    const showGroupModal = () => {
        setShowCreateGroupModal(true);
    };

    const closeGroupModal = () => {
        setShowCreateGroupModal(false);
    };


    return (
        <>
            <div className="col-span-12 p-4">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={showGroupModal}
                    className="w-full"
                >
                    <FormattedMessage id="social.group.create" defaultMessage="Create New Group" />
                </Button>
            </div>

            <Modal
                open={showCreateGroupModal}
                onCancel={closeGroupModal}
                title={<FormattedMessage id="social.group.create" defaultMessage="Create New Group" />}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateGroup}
                    initialValues={{
                        isPublic: true
                    }}
                >
                    {/* Group Banner */}
                    <Form.Item
                        name="cover_img_id"
                        label={<FormattedMessage id="social.group.banner" defaultMessage="Group Banner" />}
                        rules={[{ required: true, message: intl.formatMessage({ id: 'social.group.banner_required' }) }]}
                    >
                        <div className="border-2 border-dashed border-gray-300 relative w-full h-44 overflow-hidden rounded-lg mb-4">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="Banner Preview"
                                    className="w-full h-full object-fill"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full bg-gray-100">
                                    <p className="text-gray-500">
                                        <FormattedMessage id="social.group.upload_banner" defaultMessage="Upload banner image" />
                                    </p>
                                </div>
                            )}
                            <ImgCrop aspect={16 / 9} rotationSlider>
                                <Upload
                                    accept=".jpg,.jpeg,.png"
                                    showUploadList={false}
                                    customRequest={dummyRequest}
                                    onChange={handleBannerUpload}
                                    fileList={currentFile ? [currentFile] : []}
                                    onPreview={onPreview}
                                    beforeUpload={(file) => {
                                        if (!isValidFileType(file)) {
                                            message.error(`File ${file.name} không được hỗ trợ. Chỉ chấp nhận file PNG, JPG.`);
                                            return Upload.LIST_IGNORE;
                                        }
                                        return true;
                                    }}
                                >
                                    <Button
                                        icon={<CameraOutlined />}
                                        className="absolute bottom-2 right-2"
                                    >
                                        <FormattedMessage id="social.group.change_banner" defaultMessage="Change Banner" />
                                    </Button>
                                </Upload>
                            </ImgCrop>
                        </div>
                    </Form.Item>

                    {/* Group Name */}
                    <Form.Item
                        name="name"
                        label={<FormattedMessage id="social.group.name" defaultMessage="Group Name" />}
                        rules={[{ required: true, message: intl.formatMessage({ id: 'social.group.name_required' }) }]}
                    >
                        <Input placeholder="Enter group name" />
                    </Form.Item>

                    {/* Group Description */}
                    <Form.Item
                        name="privacy"
                        label={<FormattedMessage id="social.group.requests" defaultMessage="Request Join" />}
                        rules={[{ required: true, message: intl.formatMessage({ id: 'social.group.request_join_required' }) }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter group request join" />
                    </Form.Item>

                    {/* Group Description */}
                    <Form.Item
                        name="description"
                        label={<FormattedMessage id="social.group.description" defaultMessage="Description" />}
                        rules={[{ required: true, message: intl.formatMessage({ id: 'social.group.description_required' }) }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter group description" />
                    </Form.Item>

                    {/* Group Privacy */}
                    <Form.Item
                        name="isPublic"
                        label={<FormattedMessage id="social.group.privacy" defaultMessage="Privacy" />}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={<FormattedMessage id="social.group.public" defaultMessage="Public" />}
                            unCheckedChildren={<FormattedMessage id="social.group.private" defaultMessage="Private" />}
                        />
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item className="mb-0">
                        <div className="flex justify-end gap-2">
                            <Button onClick={handleClose}>
                                <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
                            </Button>
                            <Button type="primary" htmlType="submit" loading={uploading}>
                                <FormattedMessage id="social.group.create" defaultMessage="Create Group" />
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>


    );
};

export default CreateGroupModal; 