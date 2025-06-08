import React from 'react';
import { Card } from 'antd';
import { BsFileText, BsBarChart, BsPeople, BsPerson } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { useDocumentUser, useSubjectUserLearn } from '../hook';

const OverviewCard = ({ userData, allFriends, statusFriend }) => {

    const { status: statusDocumentUser, data: userDocuments } = useDocumentUser(userData?.documentId)
    const { status: statusSubjectUserLearn, data: userSubjectLearned } = useSubjectUserLearn(userData?.documentId)

    const totalCredits = userSubjectLearned?.data?.map(item => item?.subject?.credits).reduce((a, b) => a + b, 0) || 0
    const totalCreditsLearned = userSubjectLearned?.data?.filter(item => item?.score !== null).map(item => item?.subject?.credits).reduce((a, b) => a + b, 0) || 0
    const totalScore = userSubjectLearned?.data
        ?.filter(item => item?.score !== null)
        .reduce((acc, item) => acc + (item?.score * item?.subject?.credits), 0) || 0;

    const gpa = totalCreditsLearned > 0 ? totalScore / totalCreditsLearned : 0;

    const overviewItems = [
        {
            icon: <BsFileText />,
            label: <FormattedMessage id="profile.overview.completed_credits" defaultMessage="Completed Credits" />,
            value: totalCreditsLearned + '/' + totalCredits
        },
        {
            icon: <BsBarChart />,
            label: <FormattedMessage id="profile.overview.gpa" defaultMessage="GPA" />,
            value: gpa.toFixed(2)
        },
        {
            icon: <BsFileText />,
            label: <FormattedMessage id="profile.overview.documents" defaultMessage="Documents" />,
            value: userDocuments?.pagination?.total || 0
        },
        {
            icon: <BsPerson />,
            label: <FormattedMessage id="profile.overview.friends" defaultMessage="Friends" />,
            value: allFriends?.length || 0
        },
        {
            icon: <BsPeople />,
            label: <FormattedMessage id="profile.overview.groups" defaultMessage="Groups" />,
            value: "16"
        }
    ];

    return (
        <Card className="info-card flex-1" loading={statusDocumentUser === 'loading' || statusFriend === 'loading' || statusSubjectUserLearn === 'loading'}>
            <h2 className="card-title uppercase">
                <FormattedMessage id="profile.overview.title" defaultMessage="OVERVIEW" />
            </h2>
            {overviewItems.map((item, index) => (
                <div key={index} className="info-item">
                    <span className="icon">{item.icon}</span>
                    <span className="label">{item.label}:</span>
                    <span className="value ms-3">{item.value}</span>
                </div>
            ))}
        </Card>
    );
};

export default OverviewCard; 