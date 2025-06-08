import React, { useState } from 'react';
import { Card, Timeline, Progress, Tag, Modal, Table, Button, Tooltip } from 'antd';
import { BsCalendar3, BsBook, BsAward, BsEye } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';

const TimelineProgressCard = ({ subjectLearn }) => {
    const intl = useIntl();
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const getYear = (semester) => {
        switch (parseInt(semester)) {
            case 1:
            case 2:
                return 1;
            case 3:
            case 4:
                return 2;
            case 5:
            case 6:
                return 3;
            case 7:
            case 8:
                return 4;
            default:
                return 0;
        }
    }

    // Group subjects by semester
    const groupSubjectsBySemester = () => {
        const semesterGroups = {};

        subjectLearn?.data?.forEach(item => {
            const semester = item?.semester;
            if (!semesterGroups[semester]) {
                semesterGroups[semester] = {
                    subjects: [],
                    totalCredits: 0,
                    totalScore: 0,
                };
            }
            semesterGroups[semester].subjects.push(item);
            semesterGroups[semester].totalCredits += item?.subject?.subject?.credits || 0;
            semesterGroups[semester].totalScore += item.score * (item?.subject?.subject?.credits || 1) || 0;
        });

        // console.log('semesterGroups', semesterGroups);
        return Object.entries(semesterGroups).map(([semester, data]) => {
            const averageGPA = data.subjects.length > 0 ? data.totalScore / data.totalCredits : 0;

            return {
                id: semester,
                name: intl.formatMessage(
                    { id: 'learning.learning_progress.timeline.semester' },
                    { number: semester, year: getYear(semester) }
                ),
                gpa: averageGPA,
                subjects: data.subjects.length,
                credits: data.totalCredits,
                status: data.subjects[0]?.status || 'upcoming',
                subjectList: data.subjects.map(item => ({
                    code: item?.subject?.subject?.subject_code,
                    name: item?.subject?.subject?.name,
                    credits: item?.subject?.subject?.credits,
                    grade: item?.score,
                    status: item?.score ? 'completed' : 'in_progress',
                })),
                year: getYear(semester),
            };
        }).sort((a, b) => a.year - b.year || a.id - b.id);
    };


    const semesterData = groupSubjectsBySemester();

    // console.log('subjectLearn', subjectLearn);
    // console.log('semesterData', semesterData);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'in_progress':
                return 'processing';
            case 'upcoming':
                return 'default';
            default:
                return 'default';
        }
    };

    const getGPAColor = (gpa) => {
        if (gpa >= 3.6) return '#52c41a';
        if (gpa >= 3.2) return '#1890ff';
        if (gpa >= 2.5) return '#faad14';
        return '#ff4d4f';
    };

    const handleViewDetails = (semester) => {
        setSelectedSemester(semester);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: <FormattedMessage id="learning.learning_progress.timeline.subject_code" defaultMessage="Code" />,
            dataIndex: 'code',
            key: 'code',
            width: 100,
        },
        {
            title: <FormattedMessage id="learning.learning_progress.timeline.subject_name" defaultMessage="Subject" />,
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: <FormattedMessage id="learning.learning_progress.timeline.subject_credits" defaultMessage="Credits" />,
            dataIndex: 'credits',
            key: 'credits',
            width: 100,
            align: 'center',
        },
        {
            title: <FormattedMessage id="learning.learning_progress.timeline.subject_grade" defaultMessage="Grade" />,
            dataIndex: 'grade',
            key: 'grade',
            width: 100,
            align: 'center',
        },
        {
            title: <FormattedMessage id="learning.learning_progress.timeline.subject_status" defaultMessage="Status" />,
            dataIndex: 'status',
            key: 'status',
            width: 120,
            align: 'center',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    <FormattedMessage id={`learning.learning_progress.status.${status}`} defaultMessage={status} />
                </Tag>
            ),
        },
    ];

    return (
        <>
            <Card
                title={<FormattedMessage id="learning.learning_progress.timeline.title" />}
                className="timeline-progress-card mb-6"
            >
                <Timeline
                    mode="left"
                    className='timeline_progress'
                    items={semesterData?.map(semester => ({
                        label: (
                            <div className="flex items-center gap-2 text_first">
                                <span>{semester.name}</span>
                                <Tooltip title={<FormattedMessage id="learning.learning_progress.timeline.view_details" defaultMessage="View Details" />}>
                                    <Button
                                        type="text"
                                        icon={<BsEye />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewDetails(semester);
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        ),
                        color: getStatusColor(semester.status),
                        children: (
                            <div className="semester-info p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <BsAward className="text-lg" />
                                    <span className="font-medium">
                                        <FormattedMessage id="learning.learning_progress.timeline.gpa" />:
                                    </span>
                                    <Tag color={getGPAColor(semester?.gpa)}>{semester?.gpa?.toFixed(2)}</Tag>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <BsBook className="text-lg" />
                                    <span className="font-medium">
                                        <FormattedMessage id="learning.learning_progress.timeline.subjects" />:
                                    </span>
                                    <span>
                                        <FormattedMessage
                                            id="learning.learning_progress.timeline.subjects_count"
                                            values={{ count: semester.subjects }}
                                        />
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BsCalendar3 className="text-lg" />
                                    <span className="font-medium">
                                        <FormattedMessage id="learning.learning_progress.timeline.credits" />:
                                    </span>
                                    <span>
                                        <FormattedMessage
                                            id="learning.learning_progress.timeline.credits_count"
                                            values={{ count: semester.credits }}
                                        />
                                    </span>
                                </div>
                                {semester.status === 'in-progress' && (
                                    <div className="mt-3">
                                        <Progress
                                            percent={75}
                                            size="small"
                                            status="active"
                                            format={(percent) => intl.formatMessage(
                                                { id: 'learning.learning_progress.timeline.progress' },
                                                { percent }
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    }))}
                />
            </Card>

            <Modal
                title={selectedSemester?.name}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                width={800}
                footer={null}
                className="semester-detail-modal"
            >
                <Table
                    columns={columns}
                    dataSource={selectedSemester?.subjectList}
                    pagination={false}
                    className="semester-subjects-table"
                    rowKey="code"
                />
            </Modal>
        </>
    );
};

export default TimelineProgressCard; 