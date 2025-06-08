import { Alert, Avatar, Button, Card, Modal, Tag } from 'antd';
import { BsCalendar, BsCheckCircle, BsClock, BsFileText, BsGear, BsLink45Deg } from 'react-icons/bs';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FormattedMessage, useIntl } from 'react-intl';
import { getStatusColor } from './util';
import { formatDate } from '@/utils';
import ModalConfirm from '@/views/user/components/ModalConfirm';
import { useState } from 'react';
import { useUpdateProject } from '../mutationHooks';
import dayjs from 'dayjs';


const ProjectInfo = ({ project, isLeader, onEditProject, statusProject, onClose }) => {
    const intl = useIntl();

    const [typeModal, setTypeModal] = useState('');
    const [modalLoading, setModalLoading] = useState(false);

    const { mutate: updateProject, status: statusUpdateProject } = useUpdateProject();

    console.log('project', project);
    const handleResolveModal = async ({ objNeedConfirm, type }) => {
        setModalLoading(true);
        const data = {
            project_completed_on: type === 'mark_complete' ? dayjs().format('YYYY-MM-DD') : null,
            project_members: project?.members?.map(member => member?.user),
        }

        updateProject({ documentId: project?.documentId, newData: data, oldData: project },
            {
                onSuccess: () => {
                    setModalLoading(false);
                    onClose();
                },
                onError: (error) => {
                    setModalLoading(false);
                }
            }
        );
    };

    const handleShowModal = (type) => {
        setTypeModal(type);
        ModalConfirm({
            typeModal: type,
            objNeedConfirm: {
                name: project?.name || intl.formatMessage({ id: 'learning.learn_exercise.this_project', defaultMessage: 'this project' })
            },
            handleResolve: handleResolveModal,
            loading: modalLoading,
            intl: intl
        });
    };



    return (
        <>
            <div className="space-y-5 mb-4">

                {!isLeader && (
                    <Alert
                        message={intl.formatMessage({ id: 'learning.learn_exercise.role_update_project', defaultMessage: 'Only the leader of the project has the right to update the project information.' })}
                        type="warning"
                        showIcon
                        className='mb-4'
                    />
                )}

                {/* Header with Edit Button */}
                {isLeader && (
                    <div className="flex justify-end items-center gap-3">
                        {!statusProject ? (
                            <Button
                                color="cyan"
                                variant="solid"
                                icon={<IoMdCheckmarkCircleOutline />}
                                onClick={() => handleShowModal('mark_complete')}
                            >
                                <FormattedMessage id="common.mark_complete" />
                            </Button>
                        ) : (
                            <Button
                                color="orange"
                                variant="solid"
                                icon={<IoMdCheckmarkCircleOutline />}
                                onClick={() => handleShowModal('mark_uncompleted')}
                            >
                                <FormattedMessage id="common.mark_uncompleted" />
                            </Button>
                        )
                        }

                        <Button
                            type="primary"
                            icon={<BsGear />}
                            onClick={() => onEditProject(project)}
                        >
                            <FormattedMessage id="common.edit" />
                        </Button>
                    </div>
                )}

                {/* Project Main Info Card */}
                <Card className="custom_card rounded-lg p-6">
                    {/* Project Name */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text_secondary mb-2">
                            <FormattedMessage id="learning.learn_exercise.project_name" />
                        </h3>
                        <p className="text_first text-xl font-bold">{project?.name}</p>
                    </div>

                    {/* Project Description */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text_secondary mb-2">
                            <FormattedMessage id="learning.learn_exercise.project_description" />
                        </h3>
                        <p className="text_first text-base leading-relaxed">{project?.description}</p>
                    </div>

                    {/* Subject Information */}
                    <div className='flex items-center gap-3'>
                        <div className='flex-1 items-center gap-3'>

                            <h3 className="text-sm font-medium text_secondary mb-2">
                                <FormattedMessage id="learning.learn_exercise.subject" />
                            </h3>
                            <div className="flex items-center gap-3">
                                <Tag color="blue" className="text-base px-4 py-1">
                                    {project?.project?.subject?.name}
                                </Tag>
                            </div>
                        </div>

                        <div className='flex-1 items-center gap-3'>
                            <h3 className="text-sm font-medium text_secondary mb-2">
                                <FormattedMessage id="learning.learn_exercise.leader_project" />
                            </h3>
                            <div className="flex items-center gap-3">
                                <Avatar src={project?.project?.leader?.avatar?.file_path} size={40} />
                                <Tag color="blue" className="text-base px-4 py-1">
                                    {project?.project?.leader?.fullname}
                                </Tag>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Project Status Card */}
                <Card className="custom_card rounded-lg p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text_secondary mb-2">
                                <FormattedMessage id="learning.learn_exercise.status" />
                            </h3>
                            <Tag color={getStatusColor(statusProject ? 'completed' : 'in_progress')}
                                className="text-base px-4 py-1 m-0 uppercase font-semibold"
                            >
                                {statusProject ? (
                                    <span className="flex items-center gap-2">
                                        <BsCheckCircle />
                                        <FormattedMessage id="learning.learn_exercise.status_completed" /> :
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <BsClock />
                                        <FormattedMessage id="learning.learn_exercise.status_in_progress" />
                                    </span>
                                )}
                            </Tag>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text_secondary mb-2">
                                <FormattedMessage id="learning.learn_exercise.due_date" />
                            </h3>
                            <p className="text_first flex items-center gap-2">
                                <BsCalendar />
                                {formatDate(project?.project?.due_date)}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text_secondary mb-2">
                                <FormattedMessage id="learning.learn_exercise.created_at" />
                            </h3>
                            <p className="text_first">{formatDate(project?.project?.createdAt)}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text_secondary mb-2">
                                <FormattedMessage id="learning.learn_exercise.updated_at" />
                            </h3>
                            <p className="text_first">{formatDate(project?.project?.updatedAt)}</p>
                        </div>
                    </div>
                </Card>

                {/* Project Links Card */}
                <Card className="custom_card rounded-lg p-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text_secondary mb-2">
                                <FormattedMessage id="learning.learn_exercise.document_url" />
                            </h3>
                            <a
                                href={project?.project?.document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                            >
                                <BsFileText />
                                {project?.project?.document_url}
                            </a>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text_secondary mb-2">
                                <FormattedMessage id="learning.learn_exercise.project_url" />
                            </h3>
                            <a
                                href={project?.project?.project_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                            >
                                <BsLink45Deg />
                                {project?.project?.project_url}
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
}

export default ProjectInfo;
