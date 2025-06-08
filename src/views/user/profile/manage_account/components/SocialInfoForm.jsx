import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, Card, Button, Modal, Spin } from 'antd';
import { FormattedMessage } from 'react-intl';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useSocial, useSocialUser } from '../hook';
import { getPlaceholderSocial } from '@/utils/format/formartText';
import { useUpdateSocialInfo } from '../hookMutation';

const SelectContactTypeModal = ({ visible, onClose, onSelect, existingTypes, socialPlatforms, isLoading, socialList }) => {
    const filteredTypes = useMemo(() => {
        if (!socialPlatforms) return [];
        return socialPlatforms
            .filter(platform => !existingTypes.includes(platform))
            .map(platform => {
                const socialInfo = socialList?.find(s => s.platform === platform);
                return {
                    key: platform,
                    label: platform?.charAt(0).toUpperCase() + platform?.slice(1),
                    socialInfo
                };
            });
    }, [existingTypes, socialPlatforms, socialList]);

    if (isLoading) {
        return (
            <Modal
                title={<FormattedMessage id="profile.manage_account.add_contact" />}
                open={visible}
                onCancel={onClose}
                footer={null}
            >
                <div className="flex justify-center items-center h-32">
                    <Spin />
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            title={<FormattedMessage id="profile.manage_account.add_contact" />}
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <div className="grid grid-cols-2 gap-4">
                {filteredTypes.map(type => (
                    <Button
                        key={type.key}
                        className="text-left"
                        onClick={() => {
                            onSelect(type.key, type.socialInfo);
                            onClose();
                        }}
                    >
                        {type.label}
                    </Button>
                ))}
            </div>
        </Modal>
    );
};

const SocialInfoForm = ({ userData, intl }) => {
    const [form] = Form.useForm();
    const [showAddContact, setShowAddContact] = useState(false);
    const [socialContacts, setSocialContacts] = useState([]);

    const { data: socialUser, isLoading: isLoadingSocialUser } = useSocialUser(userData?.documentId);
    const { data: social, isLoading: isLoadingSocial } = useSocial();
    const { mutateAsync: updateSocialInfo, isLoading: isUpdatingSocialInfo } = useUpdateSocialInfo();

    // Memoize available social platforms
    const socialPlatforms = useMemo(() =>
        social?.data?.map(item => item.platform) || [],
        [social]
    );

    console.log('socialUser', socialUser)
    console.log('socialContacts', socialContacts)
    // Handle social data
    useEffect(() => {
        if (socialUser?.data) {
            const socialData = socialUser.data.map(item => ({
                type: item?.social?.platform,
                url: item?.account_url,
                platform: item?.social?.documentId
            }));
            setSocialContacts(socialData);

            const socialFormData = socialData.reduce((acc, item) => ({
                ...acc,
                [item.type]: item.url
            }), {});
            form.setFieldsValue(socialFormData);
        }
    }, [socialUser, form]);

    const handleAddContact = (type, socialInfo) => {
        setSocialContacts(prev => [...prev, {
            type,
            url: '',
            platform: socialInfo
        }]);
    };

    const handleRemoveContact = (type) => {
        setSocialContacts(prev => prev.filter(contact => contact.type !== type));
        form.setFieldValue(type, undefined);
    };

    const handleSubmit = (values) => {
        const socialData = socialContacts.map(contact => ({
            platform: contact.platform || social?.data?.find(s => s.platform === contact.type),
            account_url: values[contact.type]
        }));

        updateSocialInfo({
            userId: userData?.documentId,
            socialData,
            oldData: socialUser?.data
        });
    };

    return (
        <Card className="contact-info-form mb-6">
            <h2 className="text-xl font-semibold mb-4">
                <FormattedMessage id="profile.manage_account.social_contact" />
            </h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {socialContacts.map(contact => (
                        <Form.Item
                            key={contact.type}
                            name={contact.type}
                            label={contact?.type?.charAt(0)?.toUpperCase() + contact?.type?.slice(1)}
                            rules={[
                                {
                                    type: 'url',
                                    message: intl.formatMessage(
                                        { id: 'profile.manage_account.social_invalid' },
                                        { platform: contact?.type }
                                    )
                                }
                            ]}
                        >
                            <Input
                                placeholder={getPlaceholderSocial(contact?.type?.toLowerCase())}
                                className="input_social bg-transparent p-0"
                                suffix={
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleRemoveContact(contact?.type)}
                                    />
                                }
                            />
                        </Form.Item>
                    ))}
                </div>

                <Button
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddContact(true)}
                    className="mt-4 tag-info btn_add_contact"
                    disabled={isLoadingSocial || socialContacts.length === socialPlatforms.length}
                >
                    <FormattedMessage id="profile.manage_account.add_contact" />
                </Button>

                <Form.Item className="flex justify-end mt-4">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="btn_custom_accept"
                        loading={isLoadingSocialUser || isLoadingSocial || isUpdatingSocialInfo}
                    >
                        <FormattedMessage id="common.save" />
                    </Button>
                </Form.Item>
            </Form>

            <SelectContactTypeModal
                visible={showAddContact}
                onClose={() => setShowAddContact(false)}
                onSelect={handleAddContact}
                existingTypes={socialContacts.map(contact => contact.type)}
                socialPlatforms={socialPlatforms}
                isLoading={isLoadingSocial}
                socialList={social?.data}
            />
        </Card>
    );
};

export default React.memo(SocialInfoForm); 