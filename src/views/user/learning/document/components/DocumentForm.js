import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Upload, Button, message, Row, Col, Switch, Drawer } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { PlusOutlined } from '@ant-design/icons';
import { useUserData } from '../../../../../utils/hooks/useAuth';
import TagSelect from '@/components/elements/TagSelect';
import { useResolveDocument } from '../mutationHooks';
import useSkin from '@/utils/hooks/useSkin';

const { TextArea } = Input;

const DocumentForm = ({ visible, onClose, initialValues = null, onCloseDetailModel, refetchDocuments }) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const { language } = useSkin();
    const [thumbnailFile, setThumbnailFile] = useState([]);
    const [isPublic, setIsPublic] = useState(true);
    const formRef = useRef(null);
    const [tagOptions, setTagOptions] = useState([]);

    const { mutate: resolveDocument, isLoading: isResolving } = useResolveDocument();

    // Set initial values if editing a document
    useEffect(() => {
        if (initialValues && visible) {
            // Process tags to create options
            const processedTags = initialValues?.tags?.map(postTag => ({
                label: language === 'vi' ? postTag?.name_vi : postTag?.name_en,
                value: postTag?.documentId,
                tag: postTag
            })) || [];

            // Set the options for TagSelect
            setTagOptions(processedTags);

            // Set form values with the full tag objects
            form.setFieldsValue({
                title: initialValues.title,
                description: initialValues.description,
                content: initialValues.content,
                tags: processedTags.map(tag => tag.tag),
                is_global: initialValues.is_global,
                link_document: initialValues.link_document
            });

            // Set thumbnail if exists
            if (initialValues?.thumbnailImage) {
                setThumbnailFile([{
                    uid: '-1',
                    name: 'thumbnail.png',
                    status: 'done',
                    url: initialValues?.thumbnailImage?.file_path,
                }]);
            }

            setIsPublic(initialValues.is_global);
        }
    }, [initialValues, visible, form, language]);

    // Handle drawer close and form reset
    const handleDrawerClose = () => {
        form.resetFields();
        setThumbnailFile([]);
        setIsPublic(true);
        // Let the parent component control the visibility
        onClose();
    };

    // Thumbnail upload configuration
    const thumbnailUploadProps = {
        name: 'thumbnail',
        listType: 'picture-card',
        multiple: false,
        maxCount: 1,
        accept: 'image/*',
        fileList: thumbnailFile,
        beforeUpload: file => {
            // Check file size (e.g., limit to 5MB)
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error(intl.formatMessage({ id: 'learning.document.image_too_large' }, { size: '5MB' }));
                return false;
            }
            // In real implementation, you wouldn't upload immediately
            setThumbnailFile([file]);
            return false; // Prevent automatic upload
        },
        onRemove: () => {
            setThumbnailFile([]);
        },
        onChange: info => {
            // Update thumbnailFile when files change
            let fileList = [...info.fileList];
            fileList = fileList.slice(-1); // Keep only the latest file
            setThumbnailFile(fileList);
        },
    };

    const handleSubmit = async (values) => {
        try {
            // If validation passes, proceed with submission
            const data = {
                ...values,
                file: thumbnailFile[0]?.originFileObj,
                oldFile: initialValues ? thumbnailFile : null
            };

            resolveDocument({
                data,
                oldDocument: initialValues || null
            }, {
                onSuccess: () => {
                    // Close both the form drawer and detail modal
                    onClose();
                    if (onCloseDetailModel) {
                        onCloseDetailModel();
                    }
                    if (typeof refetchDocuments === 'function') {
                        refetchDocuments();
                    }
                }
            });
        } catch (error) {
            // Form validation failed
            console.error('Form validation failed:', error);
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>
                <FormattedMessage id="reuse.upload_img" defaultMessage="Tải thumbnail" />
            </div>
        </div>
    );

    return (
        <Drawer
            title={
                initialValues ? (
                    <FormattedMessage id="learning.document.edit_document" defaultMessage="Chỉnh sửa tài liệu" />
                ) : (
                    <FormattedMessage id="common.post" defaultMessage="Đăng tài liệu" />
                )
            }
            placement="right"
            onClose={handleDrawerClose}
            afterOpenChange={(visible) => {
                if (!visible) {
                    form.resetFields();
                }
            }}
            open={visible}
            width={700}
            destroyOnClose={true}
            extra={
                <div className="flex justify-end gap-3">
                    <Button onClick={handleDrawerClose} className="btn_custom_secondary">
                        <FormattedMessage id="common.cancel" defaultMessage="Hủy" />
                    </Button>
                    <Button
                        type="primary"
                        loading={isResolving}
                        className="btn_custom_accept"
                        onClick={() => form.submit()}
                    >
                        {initialValues ? (
                            <FormattedMessage id="common.update" defaultMessage="Cập nhật" />
                        ) : (
                            <FormattedMessage id="common.post" defaultMessage="Đăng tài liệu" />
                        )}
                    </Button>
                </div>
            }
        >
            <Form
                form={form}
                layout="vertical"
                className="document-form"
                ref={formRef}
                preserve={false}
                onFinish={handleSubmit}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Form.Item
                            name="title"
                            label={<FormattedMessage id="learning.document.title" defaultMessage="Tiêu đề" />}
                            rules={[
                                { required: true, message: intl.formatMessage({ id: 'learning.document.title_required' }, { fallback: 'Vui lòng nhập tiêu đề' }) }
                            ]}
                        >
                            <Input placeholder={intl.formatMessage({ id: 'learning.document.title_placeholder' }, { fallback: 'Nhập tiêu đề tài liệu' })} />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="description"
                            label={<FormattedMessage id="learning.document.description" defaultMessage="Mô tả" />}
                            rules={[
                                { required: true, message: intl.formatMessage({ id: 'learning.document.description_required' }, { fallback: 'Vui lòng nhập mô tả' }) }
                            ]}
                        >
                            <TextArea
                                placeholder={intl.formatMessage({ id: 'learning.document.description_placeholder' }, { fallback: 'Nhập mô tả ngắn về tài liệu' })}
                                autoSize={{ minRows: 2, maxRows: 4 }}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            name="content"
                            label={<FormattedMessage id="learning.document.content_detail" defaultMessage="Nội dung chi tiết" />}
                            rules={[
                                { required: true, message: intl.formatMessage({ id: 'learning.document.content_required' }, { fallback: 'Vui lòng nhập nội dung chi tiết' }) }
                            ]}
                        >
                            <TextArea
                                placeholder={intl.formatMessage({ id: 'learning.document.content_placeholder' }, { fallback: 'Nhập nội dung chi tiết về tài liệu' })}
                                autoSize={{ minRows: 4, maxRows: 8 }}
                            />
                        </Form.Item>
                    </Col>


                    <Col xs={24}>
                        <Form.Item
                            name="link_document"
                            label={<FormattedMessage id="learning.document.link_document" defaultMessage="Link tài liệu" />}
                            rules={[
                                { required: true, message: intl.formatMessage({ id: 'learning.document.link_document_required' }, { fallback: 'Vui lòng nhập link tài liệu' }) }
                            ]}
                        >
                            <Input
                                placeholder={intl.formatMessage({ id: 'learning.document.link_document_placeholder' }, { fallback: 'Nhập link tài liệu' })}
                                autoSize={{ minRows: 1, maxRows: 1 }}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={16}>
                        <Form.Item
                            name="tags"
                            label={intl.formatMessage({ id: 'learning.document.select_tags' })}
                            rules={[{ required: true, message: intl.formatMessage({ id: 'learning.document.tags_required' }) }]}
                        >
                            <TagSelect
                                type="multiple"
                                options={tagOptions}
                                placeholder={intl.formatMessage({ id: 'learning.document.select_tags' })}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} md={8}>
                        <Form.Item
                            name="is_global"
                            label={<FormattedMessage id="learning.document.is_global" defaultMessage="Tài liệu công khai" />}
                            valuePropName="checked"
                            initialValue={isPublic}
                        >
                            <Switch
                                checkedChildren={<FormattedMessage id="reuse.public" defaultMessage="Công khai" />}
                                unCheckedChildren={<FormattedMessage id="reuse.private" defaultMessage="Riêng tư" />}
                                onChange={setIsPublic}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <Form.Item
                            label={<FormattedMessage id="learning.document.thumbnail" defaultMessage="Ảnh thumbnail" />}
                            rules={[{ required: true, message: intl.formatMessage({ id: 'learning.document.thumbnail_required' }) }]}

                            extra={
                                <div className="text_secondary text-xs mt-1">
                                    <FormattedMessage id="learning.document.thumbnail_hint" defaultMessage="Hình ảnh hiển thị cho tài liệu (JPG, PNG, tối đa 1MB)" />
                                    <div>
                                        <FormattedMessage id="learning.document.thumbnail_option" defaultMessage="(Tùy chọn: Nếu không tải lên, hệ thống sẽ sử dụng ảnh mặc định)" />
                                    </div>
                                </div>
                            }
                        >
                            <Upload {...thumbnailUploadProps}>
                                {thumbnailFile.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Drawer>
    );
};

export default DocumentForm; 