import React, { useState } from 'react';
import { Card, Descriptions, Avatar, Button, Tag, Drawer, Form, Input, Switch, Upload, message, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { GlobalOutlined, LockOutlined, CalendarOutlined, TeamOutlined, UserOutlined, EditOutlined, CameraOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDate } from '../../../../../utils';
import ImgCrop from 'antd-img-crop';
import { uploadImage } from '@/helpers/imgHelper';
import { useUpdateGroup, useDeleteGroup } from '../../shared/actions/mutationHooks';
import { notifyError } from '@/utils/Utils';
import { useNavigate } from 'react-router';

const About = ({ group, userData, detailMember }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const deleteGroupAsync = useDeleteGroup();
    const updateGroupAsync = useUpdateGroup();

    const [uploading, setUploading] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState(group?.coverImage?.file_path || null);

    const isAdmin = userData?.username === group?.creator?.username;

    const showDrawer = () => {
        form.setFieldsValue({
            name: group?.name,
            description: group?.description,
            isPublic: group?.isPublic,
        });
        // Reset preview image to current group banner
        setPreviewImage(group?.coverImage?.file_path || null);
        setCurrentFile(null);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    const showDeleteConfirm = () => {
        setDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setDeleteModalVisible(false);
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

    const handleUpdateGroup = async (values) => {
        try {
            setUploading(true);

            // Chuẩn bị dữ liệu cập nhật
            const updateData = {
                ...values
            };

            console.log('currentFile', currentFile)
            // Chỉ upload ảnh nếu có file được chọn
            if (currentFile && currentFile.originFileObj) {
                try {
                    const bannerFile = await uploadImage(currentFile.originFileObj);

                    if (bannerFile && bannerFile?.data?.documentId) {
                        updateData.cover_img_id = bannerFile.data.documentId;
                    }
                } catch (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    notifyError('Không thể tải lên ảnh bìa. Vui lòng thử lại.');
                    setUploading(false);
                    return;
                }
            }

            // Gọi API cập nhật nhóm
            await updateGroupAsync.mutateAsync({
                groupId: group.documentId,
                data: updateData
            }, {
                onSuccess: () => {
                    setTimeout(() => {
                        closeDrawer();
                    }, 3000);
                }

            });

            setUploading(false);
        } catch (error) {
            console.error('Error in handleUpdateGroup:', error);
            message.error('Đã xảy ra lỗi: ' + (error.message || 'Không thể cập nhật nhóm'));
            setUploading(false);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            setDeleteLoading(true);
            await deleteGroupAsync.mutateAsync(group.documentId);
            // window.location.href = '/social/group';
            navigate('/social/group');
            setDeleteModalVisible(false);

            setDeleteLoading(false);
        } catch (error) {
            // Không cần xử lý thông báo lỗi ở đây vì đã được xử lý trong hook
            setDeleteLoading(false);
        }
    };


    return (
        <div className="mt-4">
            <Card className='group_detail_about'>
                <Descriptions
                    title={
                        <div className="flex justify-between items-center">
                            <span><FormattedMessage id="social.group.tabs.about" /></span>
                            {isAdmin && (
                                <div className="flex gap-2">
                                    <Button
                                        type="primary"
                                        icon={<EditOutlined />}
                                        onClick={showDrawer}
                                    >
                                        <FormattedMessage id="social.group.edit" defaultMessage="Edit Group" />
                                    </Button>
                                    <Button
                                        type="primary" danger
                                        icon={<DeleteOutlined />}
                                        onClick={showDeleteConfirm}
                                    >
                                        <FormattedMessage id="social.group.delete" defaultMessage="Delete Group" />
                                    </Button>
                                </div>
                            )}

                        </div>
                    }
                    layout="vertical"
                    bordered
                    column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
                >
                    <Descriptions.Item
                        label={<FormattedMessage id="social.group.name" />}
                    // span={1}
                    >
                        {group?.name}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={<FormattedMessage id="social.group.privacy" />}
                    // span={1}
                    >
                        {group?.isPublic ? (
                            <Tag color="blue" icon={<GlobalOutlined />}>
                                <FormattedMessage id="social.group.public" />
                            </Tag>
                        ) : (
                            <Tag color="red" icon={<LockOutlined />}>
                                <FormattedMessage id="social.group.private" />
                            </Tag>
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={<FormattedMessage id="social.group.created_at" />}
                    // span={1}
                    >
                        <span className="flex items-center gap-1">
                            <CalendarOutlined />
                            {formatDate(group?.createdAt)}
                        </span>
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={<FormattedMessage id="social.group.members" />}
                    // span={1}
                    >
                        <span className="flex items-center gap-1">
                            <TeamOutlined />
                            {detailMember?.length || 0}
                        </span>
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={<FormattedMessage id="social.group.admin" />}
                        span={1}
                    >
                        <div className="flex items-center gap-2">
                            <Avatar
                                src={group?.creator?.avatar?.file_path}
                                icon={<UserOutlined />}
                            />
                            <span>{group?.creator?.fullname}</span>
                        </div>
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={<FormattedMessage id="social.group.requests" />}
                        span={1}
                    >
                        {group?.privacy || (
                            <p className="text_first whitespace-pre-wrap ">
                                <FormattedMessage id="social.group.no_privacy" />
                            </p>
                        )}
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={<FormattedMessage id="social.group.description" />}
                        span={1}
                    >
                        {group?.description || (
                            <p className="text_first whitespace-pre-wrap ">
                                <FormattedMessage id="social.group.no_description" />
                            </p>
                        )}
                    </Descriptions.Item>
                </Descriptions>


            </Card>

            {/* Edit Group Drawer */}
            <Drawer
                title={<FormattedMessage id="social.group.edit" defaultMessage="Edit Group" />}
                placement="right"
                width={500}
                onClose={closeDrawer}
                open={drawerVisible}
                extra={
                    <Button onClick={closeDrawer}>
                        <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
                    </Button>
                }
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateGroup}
                    initialValues={{
                        name: group?.name,
                        description: group?.description,
                        privacy: group?.privacy,
                        isPublic: group?.isPublic,
                    }}
                >
                    <Form.Item
                        name="coverImage"
                        label={<FormattedMessage id="social.group.banner" defaultMessage="Group Banner" />}
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

                    <Form.Item
                        name="name"
                        label={<FormattedMessage id="social.group.name" defaultMessage="Group Name" />}
                        rules={[{ required: true, message: 'Please enter group name' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label={<FormattedMessage id="social.group.description" defaultMessage="Description" />}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="privacy"
                        label={<FormattedMessage id="social.group.requests" defaultMessage="Requests" />}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>

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

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={uploading}>
                            <FormattedMessage id="common.save" defaultMessage="Save" />
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

            {/* Delete Group Modal */}
            <Modal
                title={<FormattedMessage id="social.group.delete_confirm_title" defaultMessage="Delete Group" />}
                open={deleteModalVisible}
                onCancel={handleDeleteCancel}
                footer={[
                    <Button key="cancel" onClick={handleDeleteCancel}>
                        <FormattedMessage id="common.cancel" defaultMessage="Cancel" />
                    </Button>,
                    <Button
                        key="delete"
                        type="primary" danger
                        loading={deleteLoading}
                        onClick={handleDeleteGroup}
                    >
                        <FormattedMessage id="social.group.delete" defaultMessage="Delete" />
                    </Button>
                ]}
            >
                <p><FormattedMessage id="social.group.delete_confirm_message" defaultMessage="Are you sure you want to delete this group? This action cannot be undone." /></p>
            </Modal>
        </div>
    );
};

export default About; 