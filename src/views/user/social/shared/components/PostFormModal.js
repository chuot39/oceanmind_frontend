import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Button, Avatar, Dropdown, Upload, Tooltip, message } from 'antd';
import { BsGlobe, BsLock, BsImages, BsGeoAlt, BsTag, BsEmojiWinkFill } from 'react-icons/bs';
import { CloseOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl';
import EmojiPicker from 'emoji-picker-react';
import StrapiImage from '@/components/common/StrapiImage';
import useSkin from '@/utils/hooks/useSkin';
import TagSelect from '@/components/elements/TagSelect';
const { TextArea } = Input;

const PostFormModal = ({ visible, onClose, onSubmit, userData, intl, language, friends, isSubmitting, isEditing = false, postData = null }) => {
    const { skin } = useSkin();
    const [form] = Form.useForm();

    const [fileList, setFileList] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isPublic, setIsPublic] = useState(postData?.is_public ?? true);
    const [textContent, setTextContent] = useState(postData?.content || '');

    const [activeOptions, setActiveOptions] = useState({
        photo: false,
        tagFriends: false,
        location: false,
        tags: false
    });

    const textAreaRef = useRef(null);

    useEffect(() => {
        if (visible === false) {
            handleFormClose();
        }
    }, [visible]);

    useEffect(() => {
        if (visible && isEditing && postData) {
            form.resetFields();
            setFileList([]);
            setSelectedTags([]);
            setSelectedFriends([]);
            setActiveOptions({
                photo: false,
                tagFriends: false,
                location: false,
                tags: false
            });

            // Then set the values from postData
            setTextContent(postData.content || '');
            setIsPublic(postData.is_public !== undefined ? postData.is_public : true);

            // Handle media files
            if (postData.media && postData.media.length > 0) {
                const mediaFiles = postData.media.map((media, index) => ({
                    uid: `-${index}`,
                    name: `Image ${index}`,
                    status: 'done',
                    url: media?.file_path,
                    file_path: media?.file_path,
                    media_id: media?.documentId,
                    existingMediaId: media?.documentId
                }));
                setFileList(mediaFiles);
                setActiveOptions(prev => ({ ...prev, photo: true }));
            }

            // Handle tags
            if (postData?.tags && postData?.tags?.length > 0) {
                setSelectedTags(postData.tags);
                setActiveOptions(prev => ({ ...prev, tags: true }));
                form.setFieldValue('tags', postData.tags.map(tag => tag.documentId));
            }

            // Set form values
            form.setFieldsValue({
                content: postData.content,
            });
        }
    }, [visible, isEditing, postData, form]);

    const privacyOptions = [
        {
            key: 'public',
            icon: <BsGlobe className="text-lg" />,
            label: intl.formatMessage({ id: 'social.post.privacy.public' }),
            description: intl.formatMessage({ id: 'social.post.privacy.public_desc' })
        },
        {
            key: 'only_me',
            icon: <BsLock className="text-lg" />,
            label: intl.formatMessage({ id: 'social.post.privacy.only_me' }),
            description: intl.formatMessage({ id: 'social.post.privacy.only_me_desc' })
        }
    ];

    const handleFormClose = () => {
        form.resetFields();
        setFileList([]);
        setTextContent('');
        setSelectedTags([]);
        setSelectedFriends([]);
        setActiveOptions({
            photo: false,
            tagFriends: false,
            location: false,
            tags: false
        });
        onClose();
    };

    const handleFormSubmit = async (values) => {
        const formData = {
            content: textContent || values.content,
            userId: userData.documentId,
            isPublic: isPublic,
            post_medias: fileList.map(file => file.originFileObj || file),
            post_tags: selectedTags.map(tag => tag.documentId),
            tagged_friends: selectedFriends,
            oldData: postData,
            media_type: values.contributeToPublic ? 'post_public' : 'post_private',

            ...(isEditing && { existingMediaIds: fileList.filter(f => f.existingMediaId).map(f => f.existingMediaId) }),
            ...(isEditing && { postId: postData.documentId })
        };

        await onSubmit(formData);
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        setActiveOptions(prev => ({ ...prev, photo: newFileList.length > 0 }));
    };

    const handleRemoveFile = (file) => {
        const newFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(newFileList);
        if (newFileList.length === 0) {
            setActiveOptions(prev => ({ ...prev, photo: false }));
        }
    };

    const toggleOption = (option) => {
        setActiveOptions(prev => ({ ...prev, [option]: !prev[option] }));

        // Reset selections when toggling off
        if (option === 'tagFriends' && activeOptions.tagFriends) {
            setSelectedFriends([]);
            form.setFieldValue('friends', []);
        }

        if (option === 'tags' && activeOptions.tags) {
            setSelectedTags([]);
            form.setFieldValue('tags', []);
        }
    };

    const onEmojiClick = (emojiObject) => {
        const textArea = textAreaRef.current?.resizableTextArea?.textArea;
        const currentContent = textContent || '';
        const currentPosition = textArea ? textArea.selectionStart : currentContent.length;

        const beforeCursor = currentContent.slice(0, currentPosition);
        const afterCursor = currentContent.slice(currentPosition);
        const newContent = beforeCursor + emojiObject.emoji + afterCursor;

        // Update both the form field and our controlled state
        setTextContent(newContent);
        form.setFieldValue('content', newContent);

        // Update cursor position after a small delay
        setTimeout(() => {
            if (textArea) {
                const newPosition = currentPosition + emojiObject.emoji.length;
                textArea.focus();
                textArea.setSelectionRange(newPosition, newPosition);
            }
        }, 50);
    };

    const handleTextAreaClick = (e) => {
        // Only track cursor position, no need to do anything else
    };

    const handleTextAreaChange = (e) => {
        setTextContent(e.target.value);
        form.setFieldValue('content', e.target.value);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            const emojiPicker = document.querySelector('.EmojiPickerReact');
            const emojiButton = document.querySelector('.emoji-button');
            if (emojiPicker && !emojiPicker.contains(e.target) && !emojiButton?.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Modal
            title={
                <div className="flex items-center justify-between pb-2 border-b">
                    <h3 className="text-xl font-semibold">
                        {isEditing ? (
                            <FormattedMessage id="social.post.edit_post" defaultMessage="Edit Post" />
                        ) : (
                            <FormattedMessage id="social.post.create_post" defaultMessage="Create Post" />
                        )}
                    </h3>
                    <Dropdown
                        menu={{
                            items: privacyOptions.map(option => ({
                                key: option.key,
                                label: (
                                    <div className="flex items-center gap-2 p-2">
                                        {option.icon}
                                        <div>
                                            <div className="font-medium">{option.label}</div>
                                            <div className="text-xs text_secondary">{option.description}</div>
                                        </div>
                                    </div>
                                ),
                                onClick: () => setIsPublic(option.key === 'public')
                            }))
                        }}
                        trigger={['click']}
                    >
                        <Button
                            className="flex items-center gap-2"
                            icon={isPublic ? <BsGlobe /> : <BsLock />}
                        >
                            {isPublic ?
                                intl.formatMessage({ id: 'social.post.privacy.public' }) :
                                intl.formatMessage({ id: 'social.post.privacy.only_me' })
                            }
                        </Button>
                    </Dropdown>
                </div>
            }
            open={visible}
            onCancel={handleFormClose}
            footer={null}
            width={900}
            className="post-modal"
        >
            <Form form={form} onFinish={handleFormSubmit} className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar src={userData?.avatar?.file_path} size={45} />
                    <div>
                        <h4 className="font-medium text_first">{userData?.fullname}</h4>
                    </div>
                </div>

                <Form.Item name="content" className="mb-4" >
                    <TextArea
                        ref={textAreaRef}
                        placeholder={intl.formatMessage({
                            id: 'social.post.write_something',
                            defaultMessage: "What's on your mind?"
                        })}
                        autoSize={{ minRows: 3, maxRows: 8 }}
                        className="text-lg border-none resize-none focus:shadow-none"
                        onClick={handleTextAreaClick}
                        onChange={handleTextAreaChange}
                        value={textContent}
                    />
                    <div className="absolute right-2 bottom-2">
                        <Tooltip title={intl.formatMessage({ id: 'social.post.add_emoji' })}>
                            <Button
                                type="text"
                                className="emoji-button"
                                icon={<BsEmojiWinkFill className="!text-yellow-300 text-xl" />}
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            />
                        </Tooltip>
                    </div>
                    {showEmojiPicker && (
                        <div className="fixed z-[9999] bottom-auto right-44 mt-20" >
                            <div className="shadow-lg rounded-lg" onClick={(e) => e.stopPropagation()}>
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    width={320}
                                    height={400}
                                    searchDisabled={false}
                                    skinTonesDisabled={true}
                                    lazyLoadEmojis={true}
                                    previewConfig={{
                                        showPreview: false
                                    }}
                                    theme={skin === 'dark' ? 'dark' : 'light'}
                                />
                            </div>
                        </div>
                    )}
                </Form.Item>

                {/* Image Preview Area */}
                {fileList.length > 0 && (
                    <>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {fileList.map(file => (
                                <div key={file.uid} className="relative">
                                    {file.originFileObj ? (
                                        <img
                                            src={URL.createObjectURL(file.originFileObj)}
                                            alt="preview"
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <StrapiImage
                                            src={file.url || file.file_path}
                                            alt={file.name || "Image"}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />
                                    )}
                                    <Button
                                        type="text"
                                        className="absolute top-2 right-2 bg-gray-800/50 text-white"
                                        onClick={() => handleRemoveFile(file)}
                                        icon={<CloseOutlined />}
                                    />
                                </div>
                            ))}
                        </div>
                        {/* <Form.Item
                            name="contributeToPublic"
                            valuePropName="checked"
                            initialValue={true}
                            className="flex items-center gap-2 text_first"
                        >
                            <Switch
                                checkedChildren={<FormattedMessage id="reuse.public" defaultMessage="Public" />}
                                unCheckedChildren={<FormattedMessage id="reuse.private" defaultMessage="Private" />}
                                className='me-2'
                                defaultChecked={true}
                            />
                            <FormattedMessage
                                id="reuse.contribute_to_public"
                                defaultMessage="Contribute these images to the public repository for other users to reuse"
                            />
                        </Form.Item> */}
                    </>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">
                        <FormattedMessage id="social.post.add_to_post" defaultMessage="Add to your post:" />
                    </span>
                    <div className="flex gap-2 ml-auto">
                        <Upload
                            multiple
                            fileList={fileList}
                            onChange={handleFileChange}
                            beforeUpload={(file, fileList) => {
                                const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                                if (!acceptedTypes.includes(file.type)) {
                                    message.destroy();
                                    message.error(`File ${file.name} không được hỗ trợ. Chỉ chấp nhận file PNG, JPG.`);
                                    return Upload.LIST_IGNORE;
                                }

                                if (fileList.length + fileList.length > 10) {
                                    message.destroy();
                                    message.warning('Bạn chỉ có thể tải lên tối đa 10 file.');
                                    return Upload.LIST_IGNORE;
                                }

                                return false;
                            }}
                            showUploadList={false}
                            accept=".jpg,.jpeg,.png"
                            maxCount={10}
                        >
                            <Tooltip title={intl.formatMessage({ id: 'social.post.photo_video' })}>
                                <Button
                                    type={activeOptions.photo ? "primary" : "text"}
                                    className={activeOptions.photo ? "bg-green-50 border-green-200 hover:bg-green-100" : ""}
                                    icon={<BsImages className={`text-xl ${activeOptions.photo ? "!text-green-700" : "!text-green-600"}`} />}
                                />
                            </Tooltip>
                        </Upload>
                        {/* <Tooltip title={intl.formatMessage({ id: 'social.post.tag_friends' })}>
                            <Button
                                type={activeOptions.tagFriends ? "primary" : "text"}
                                className={activeOptions.tagFriends ? "bg-blue-50 border-blue-200 hover:bg-blue-100" : ""}
                                icon={<FaUserTag className={`text-xl ${activeOptions.tagFriends ? "!text-blue-700" : "!text-blue-600"}`} />}
                                onClick={() => toggleOption('tagFriends')}
                            />
                        </Tooltip> */}
                        <Tooltip title={intl.formatMessage({ id: 'social.post.add_tags' })}>
                            <Button
                                type={activeOptions.tags ? "primary" : "text"}
                                className={activeOptions.tags ? "bg-purple-50 border-purple-200 hover:bg-purple-100" : ""}
                                icon={<BsTag className={`text-xl ${activeOptions.tags ? "!text-purple-700" : "!text-purple-600"}`} />}
                                onClick={() => toggleOption('tags')}
                            />
                        </Tooltip>
                        <Tooltip title={intl.formatMessage({ id: 'social.post.location' })}>
                            <Button
                                type={activeOptions.location ? "primary" : "text"}
                                className={activeOptions.location ? "bg-red-50 border-red-200 hover:bg-red-100" : ""}
                                icon={<BsGeoAlt className={`text-xl ${activeOptions.location ? "!text-red-700" : "!text-red-600"}`} />}
                                onClick={() => toggleOption('location')}
                            />
                        </Tooltip>
                    </div>
                </div>

                {/* Tags Select - Only show when tags option is active */}
                {activeOptions.tags && (
                    <Form.Item name="tags" className="mb-4">
                        {/* <Select
                            mode="multiple"
                            placeholder={intl.formatMessage({ id: 'social.post.add_tags' })}
                            options={tagsListSelect}
                            onChange={handleTagChange}
                            className="w-full"
                            showSearch
                            onSearch={handleSearchTag}
                            filterOption={false}
                            loading={tagStatus === 'loading'}
                            notFoundContent={
                                tagStatus === 'loading' ? (
                                    <div className="flex justify-center py-2">
                                        <Spin size="small" />
                                    </div>
                                ) : null
                            }
                        /> */}

                        <TagSelect
                            type="multiple"
                            value={selectedTags}
                            onChange={(selectedTags) => {
                                setSelectedTags(selectedTags);
                            }}
                            placeholder={intl.formatMessage({ id: 'learning.document.select_tags' })}
                        />
                    </Form.Item>
                )}

                {/* Friends Select - Only show when tag friends option is active */}
                {/* {activeOptions.tagFriends && (
                    <Form.Item name="friends" className="mb-4">
                        <Select
                            mode="multiple"
                            placeholder={intl.formatMessage({ id: 'social.post.tag_friends' })}
                            options={friendsListSelect}
                            onChange={setSelectedFriends}
                            className="w-full"
                        />
                    </Form.Item>
                )} */}

                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={textContent?.length <= 5}
                    loading={isSubmitting}
                    className="w-full h-10 text-lg font-medium"
                >
                    {isEditing ? (
                        <FormattedMessage id="common.update" defaultMessage="Update" />
                    ) : (
                        <FormattedMessage id="common.post" defaultMessage="Post" />
                    )}
                </Button>
            </Form>
        </Modal>
    );
};

export default PostFormModal; 