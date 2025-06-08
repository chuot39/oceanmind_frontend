import React, { useState } from 'react';
import {
    Modal, Descriptions, Tag, Button, Tabs,
    Card, Empty, Spin, Typography, Divider,
    List, Space
} from 'antd';
import {
    FormattedMessage, useIntl
} from 'react-intl';
import {
    PlusOutlined, DeleteOutlined,
    CloseCircleOutlined, ArrowRightOutlined
} from '@ant-design/icons';
import { useSubject } from '../hook';
import AddSpecializationForm from './AddSpecializationForm';
import AddRelationshipForm from './AddRelationshipForm';

const { Text } = Typography;

const SubjectDetail = ({
    visible,
    onClose,
    subjectId,
    onEdit,
    onAddSpecialization,
    onRemoveSpecialization,
    onAddPreviousSubject,
    onRemovePreviousSubject,
    onAddPrerequisiteSubject,
    onRemovePrerequisiteSubject,
    isRemovingSpecialization,
    isRemovingPreviousSubject,
    isRemovingPrerequisiteSubject
}) => {
    const intl = useIntl();
    const { data: subject, isLoading } = useSubject(subjectId);

    const [activeTab, setActiveTab] = useState('1');
    const [isAddSpecializationVisible, setIsAddSpecializationVisible] = useState(false);
    const [isAddPreviousSubjectVisible, setIsAddPreviousSubjectVisible] = useState(false);
    const [isAddPrerequisiteSubjectVisible, setIsAddPrerequisiteSubjectVisible] = useState(false);

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const handleAddSpecialization = (values) => {
        onAddSpecialization({
            subject_id: subjectId,
            ...values
        });
        setIsAddSpecializationVisible(false);
    };

    const handleAddPreviousSubject = (values) => {
        onAddPreviousSubject({
            subject_id: subjectId,
            previous_subject_id: values.related_subject_id
        });
        setIsAddPreviousSubjectVisible(false);
    };

    const handleAddPrerequisiteSubject = (values) => {
        onAddPrerequisiteSubject({
            subject_id: subjectId,
            prerequisite_subject_id: values.related_subject_id
        });
        setIsAddPrerequisiteSubjectVisible(false);
    };

    const renderBasicInfo = () => (
        <Card className="subject-detail-card">
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Spin />
                </div>
            ) : subject ? (
                <Descriptions bordered column={1}>
                    <Descriptions.Item label={intl.formatMessage({ id: 'subject.detail.code', defaultMessage: 'Subject Code' })}>
                        <Text code>{subject.subject_code}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'subject.detail.name', defaultMessage: 'Subject Name' })}>
                        {subject.name}
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'subject.detail.credits', defaultMessage: 'Credits' })}>
                        <Tag className="tag-credits">
                            {subject.credits} <FormattedMessage id="subject.credits" defaultMessage="credits" />
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'subject.detail.created_at', defaultMessage: 'Created At' })}>
                        {new Date(subject.createdAt).toLocaleString()}
                    </Descriptions.Item>
                    <Descriptions.Item label={intl.formatMessage({ id: 'subject.detail.updated_at', defaultMessage: 'Updated At' })}>
                        {new Date(subject.updatedAt).toLocaleString()}
                    </Descriptions.Item>
                </Descriptions>
            ) : (
                <Empty description={intl.formatMessage({ id: 'subject.detail.not_found', defaultMessage: 'Subject not found' })} />
            )}
        </Card>
    );

    const renderSpecializations = () => (
        <Card
            className="subject-detail-card"
            title={intl.formatMessage({ id: 'subject.detail.specializations', defaultMessage: 'Specializations' })}
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="small"
                    onClick={() => setIsAddSpecializationVisible(true)}
                >
                    <FormattedMessage id="subject.action.add_specialization" defaultMessage="Add to Specialization" />
                </Button>
            }
        >
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Spin />
                </div>
            ) : subject?.specializations?.length > 0 ? (
                <List
                    dataSource={subject.specializations}
                    renderItem={item => (
                        <div className="specialization-item">
                            <div className="spec-info">
                                <div className="spec-name">{item.name_vi}</div>
                                <div className="spec-meta">
                                    <Tag className="tag-category">{item.category.name_vi}</Tag>
                                    <Tag className="tag-batch">{item.batch.name}</Tag>
                                    <Tag className="tag-semester">
                                        <FormattedMessage
                                            id="subject.semester"
                                            defaultMessage="Semester {semester}"
                                            values={{ semester: item.semester }}
                                        />
                                    </Tag>
                                </div>
                            </div>
                            <div className="spec-actions">
                                <Button
                                    danger
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={() => onRemoveSpecialization(item.specialized_subject_id)}
                                    loading={isRemovingSpecialization === item.specialized_subject_id}
                                />
                            </div>
                        </div>
                    )}
                />
            ) : (
                <Empty
                    description={
                        <FormattedMessage
                            id="subject.detail.no_specializations"
                            defaultMessage="This subject is not assigned to any specialization yet"
                        />
                    }
                />
            )}
        </Card>
    );

    const renderPreviousSubjects = () => (
        <Card
            className="subject-detail-card"
            title={intl.formatMessage({ id: 'subject.detail.previous_subjects', defaultMessage: 'Previous Subjects' })}
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="small"
                    onClick={() => setIsAddPreviousSubjectVisible(true)}
                >
                    <FormattedMessage id="subject.action.add_previous" defaultMessage="Add Previous Subject" />
                </Button>
            }
        >
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Spin />
                </div>
            ) : subject?.previousSubjects?.length > 0 ? (
                <List
                    dataSource={subject.previousSubjects}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button
                                    danger
                                    type="text"
                                    icon={<CloseCircleOutlined />}
                                    onClick={() => onRemovePreviousSubject(item.relation_id)}
                                    loading={isRemovingPreviousSubject === item.relation_id}
                                />
                            ]}
                        >
                            <Space>
                                <Tag className="tag-relationship">{item.subject_code}</Tag>
                                <ArrowRightOutlined />
                                <Tag>{subject.subject_code}</Tag>
                                <Text>{item.name}</Text>
                            </Space>
                        </List.Item>
                    )}
                />
            ) : (
                <Empty
                    description={
                        <FormattedMessage
                            id="subject.detail.no_previous_subjects"
                            defaultMessage="No previous subjects defined"
                        />
                    }
                />
            )}
        </Card>
    );

    const renderPrerequisiteSubjects = () => (
        <Card
            className="subject-detail-card"
            title={intl.formatMessage({ id: 'subject.detail.prerequisite_subjects', defaultMessage: 'Prerequisite Subjects' })}
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="small"
                    onClick={() => setIsAddPrerequisiteSubjectVisible(true)}
                >
                    <FormattedMessage id="subject.action.add_prerequisite" defaultMessage="Add Prerequisite Subject" />
                </Button>
            }
        >
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <Spin />
                </div>
            ) : subject?.prerequisiteSubjects?.length > 0 ? (
                <List
                    dataSource={subject.prerequisiteSubjects}
                    renderItem={item => (
                        <List.Item
                            actions={[
                                <Button
                                    danger
                                    type="text"
                                    icon={<CloseCircleOutlined />}
                                    onClick={() => onRemovePrerequisiteSubject(item.relation_id)}
                                    loading={isRemovingPrerequisiteSubject === item.relation_id}
                                />
                            ]}
                        >
                            <Space>
                                <Tag className="tag-relationship">{item.subject_code}</Tag>
                                <ArrowRightOutlined />
                                <Tag>{subject.subject_code}</Tag>
                                <Text>{item.name}</Text>
                            </Space>
                        </List.Item>
                    )}
                />
            ) : (
                <Empty
                    description={
                        <FormattedMessage
                            id="subject.detail.no_prerequisite_subjects"
                            defaultMessage="No prerequisite subjects defined"
                        />
                    }
                />
            )}
        </Card>
    );

    const items = [
        {
            key: '1',
            label: intl.formatMessage({ id: 'subject.tab.basic', defaultMessage: 'Basic Information' }),
            children: renderBasicInfo()
        },
        {
            key: '2',
            label: intl.formatMessage({ id: 'subject.tab.specializations', defaultMessage: 'Specializations' }),
            children: renderSpecializations()
        },
        {
            key: '3',
            label: intl.formatMessage({ id: 'subject.tab.previous', defaultMessage: 'Previous Subjects' }),
            children: renderPreviousSubjects()
        },
        {
            key: '4',
            label: intl.formatMessage({ id: 'subject.tab.prerequisites', defaultMessage: 'Prerequisites' }),
            children: renderPrerequisiteSubjects()
        }
    ];

    return (
        <>
            <Modal
                title={
                    isLoading ? (
                        <FormattedMessage id="subject.detail.loading" defaultMessage="Loading Subject Details..." />
                    ) : subject ? (
                        <>
                            <span>{subject.name}</span>
                            <Text code className="ml-2">{subject.subject_code}</Text>
                        </>
                    ) : (
                        <FormattedMessage id="subject.detail.title" defaultMessage="Subject Details" />
                    )
                }
                open={visible}
                onCancel={onClose}
                footer={[
                    <Button key="close" onClick={onClose}>
                        <FormattedMessage id="common.close" defaultMessage="Close" />
                    </Button>,
                    <Button
                        key="edit"
                        type="primary"
                        onClick={() => onEdit(subject)}
                        disabled={isLoading || !subject}
                    >
                        <FormattedMessage id="subject.action.edit" defaultMessage="Edit Subject" />
                    </Button>,
                ]}
                width={800}
                maskClosable={false}
                destroyOnClose={true}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    items={items}
                    className="tabs-container"
                />
            </Modal>

            {/* Add Specialization Form */}
            {subject && (
                <AddSpecializationForm
                    visible={isAddSpecializationVisible}
                    onClose={() => setIsAddSpecializationVisible(false)}
                    onSubmit={handleAddSpecialization}
                    subjectId={subjectId}
                />
            )}

            {/* Add Previous Subject Form */}
            {subject && (
                <AddRelationshipForm
                    visible={isAddPreviousSubjectVisible}
                    onClose={() => setIsAddPreviousSubjectVisible(false)}
                    onSubmit={handleAddPreviousSubject}
                    subjectId={subjectId}
                    title={intl.formatMessage({ id: 'subject.form.add_previous', defaultMessage: 'Add Previous Subject' })}
                    excludeIds={[subjectId, ...(subject.previousSubjects?.map(s => s.documentId) || [])]}
                />
            )}

            {/* Add Prerequisite Subject Form */}
            {subject && (
                <AddRelationshipForm
                    visible={isAddPrerequisiteSubjectVisible}
                    onClose={() => setIsAddPrerequisiteSubjectVisible(false)}
                    onSubmit={handleAddPrerequisiteSubject}
                    subjectId={subjectId}
                    title={intl.formatMessage({ id: 'subject.form.add_prerequisite', defaultMessage: 'Add Prerequisite Subject' })}
                    excludeIds={[subjectId, ...(subject.prerequisiteSubjects?.map(s => s.documentId) || [])]}
                />
            )}
        </>
    );
};

export default SubjectDetail; 