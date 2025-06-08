import React, { useMemo, useState } from 'react';
import { Row, Col, Card } from 'antd';
import { BsBook, BsClock, BsAward, BsCalendar3, BsBarChart, BsStarFill, BsCheck2Circle } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import AIScheduleCard from './components/AIScheduleCard';
import TimelineProgressCard from './components/TimelineProgressCard';
import SubjectListTable from './components/SubjectListTable';
import '@core/scss/styles/pages/learning/index.scss';
import { useSubject, useSubjectUserLearn } from './hook';
import { useUserData } from '@utils/hooks/useAuth';

const LearnProgress = () => {
    const intl = useIntl();
    const { userData } = useUserData();

    const { status: subjectStatus, data: subjects } = useSubject(userData?.regularClass?.specialized?.documentId);
    const { status: subjectLearnStatus, data: subjectLearn, refetch: refetchSubjectLearn } = useSubjectUserLearn()

    const getGPARank = (gpa) => {
        if (gpa >= 3.6) return <FormattedMessage id="learning.learning_progress.stats.excellent" />;
        if (gpa >= 3.2) return <FormattedMessage id="learning.learning_progress.stats.very_good" />;
        if (gpa >= 2.5) return <FormattedMessage id="learning.learning_progress.stats.good" />;
        if (gpa >= 2) return <FormattedMessage id="learning.learning_progress.stats.average" />;
        return <FormattedMessage id="learning.learning_progress.stats.below_average" />;
    };

    const getScoreAlpha = (score) => {
        if (score >= 8) return 'A';
        if (score >= 7) return 'B';
        if (score >= 6) return 'C';
        if (score >= 5) return 'D';
        return 'F';
    }

    const getCalculatedGPA = useMemo(() => {
        const totalCredits = subjectLearn?.data?.filter(item => item?.score)?.reduce((acc, item) => acc + item?.subject?.subject?.credits || 0, 0) || 0;
        const totalScore = subjectLearn?.data?.filter(item => item?.score)?.reduce((acc, item) => acc + (item?.score * item?.subject?.subject?.credits || 0), 0) || 0;

        const gpa = (totalScore / totalCredits).toFixed(2);
        return gpa;
    }, [subjectLearn]);


    // console.log('subjectLearn', subjectLearn);
    const progressStats = [
        {
            title: <FormattedMessage id="learning.learning_progress.stats.total_subjects" />,
            value: subjects?.data?.length || 0,
            icon: <BsBook />,
            color: 'blue'
        },
        {
            title: <FormattedMessage id="learning.learning_progress.stats.completed_subjects" />,
            value: subjectLearn?.data?.filter(item => item?.score).length || 0,
            icon: <BsCheck2Circle />,
            color: 'green'
        },
        {
            title: <FormattedMessage id="learning.learning_progress.stats.total_credits" />,
            value: subjectLearn?.data?.filter(item => item?.score)?.reduce((acc, item) => acc + item?.subject?.credits, 0) || 0,
            icon: <BsAward />,
            color: 'gold'
        },
        {
            title: <FormattedMessage id="learning.learning_progress.stats.current_semester" />,
            value: intl.formatMessage(
                { id: 'learning.learning_progress.stats.semester_value' },
                { number: subjectLearn?.data?.length > 0 ? Math.max(...subjectLearn?.data?.map(item => item?.semester)) : 0 }
            ),
            icon: <BsCalendar3 />,
            color: 'purple'
        },
        {
            title: <FormattedMessage id="learning.learning_progress.stats.cumulative_gpa" />,
            value: getCalculatedGPA && getCalculatedGPA > 0 ? getCalculatedGPA : 0,
            icon: <BsBarChart />,
            color: 'cyan'
        },
        {
            title: <FormattedMessage id="learning.learning_progress.stats.academic_standing" />,
            value: getGPARank(getCalculatedGPA),
            icon: <BsStarFill />,
            color: 'orange'
        }
    ];

    return (
        <div className="learn-progress-page p-6">

            {/* Progress Stats Cards */}
            <Row gutter={[16, 16]} className="mb-6">
                {progressStats.map((stat, index) => (
                    <Col xs={24} sm={12} md={12} lg={8} xl={8} key={index}>
                        <Card className="stat-card h-full">
                            <div className="flex items-center gap-4">
                                <div className={`icon-wrapper text-2xl text-${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text_secondary text-sm mb-1">{stat.title}</p>
                                    <p className="text-xl font-semibold text_first">{stat.value} </p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* AI Schedule Card */}
            <AIScheduleCard />

            {/* Timeline Progress Card */}
            <TimelineProgressCard subjectLearn={subjectLearn} />

            {/* Subject List Table */}
            <SubjectListTable subjects={subjects?.data} subjectStatus={subjectStatus} subjectLearn={subjectLearn?.data} subjectLearnStatus={subjectLearnStatus} refetchSubjectLearn={refetchSubjectLearn} />
        </div>
    );
};

export default LearnProgress;