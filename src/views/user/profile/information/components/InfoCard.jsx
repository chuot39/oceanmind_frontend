import React from 'react';
import { Card } from 'antd';
import { BsPerson, BsCalendar, BsBook, BsCodeSlash, BsPeople, BsGenderTrans } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { useDetailClassUser } from '../hook';
import useSkin from '../../../../../utils/hooks/useSkin';
import { formatDate } from '../../../../../utils/format/datetime';

const InfoCard = ({ userData }) => {

    const { status: statusDetailClassUser, data: detailClassUser } = useDetailClassUser(userData?.regularClass?.documentId);
    const { language } = useSkin()

    const infoItems = [
        {
            icon: <BsPerson />,
            label: <FormattedMessage id="profile.fullname" defaultMessage="Full Name" />,
            value: userData?.fullname
        },
        {
            icon: <BsCalendar />,
            label: <FormattedMessage id="profile.birthday" defaultMessage="Birthday" />,
            value: formatDate(userData?.date_of_birth)
        },
        {
            icon: <BsGenderTrans />,
            label: <FormattedMessage id="profile.gender" defaultMessage="Gender" />,
            value: language === 'vi' ? userData?.gender?.name_vi : userData?.gender?.name_en
        },
        {
            icon: <BsBook />,
            label: <FormattedMessage id="profile.faculty" defaultMessage="Faculty" />,
            value: language === 'vi' ? detailClassUser?.data?.specialized?.faculty?.name_vi : detailClassUser?.data?.specialized?.faculty?.name_en
        },
        {
            icon: <BsCodeSlash />,
            label: <FormattedMessage id="profile.major" defaultMessage="Major" />,
            value: language === 'vi' ? detailClassUser?.data?.specialized?.name_vi : detailClassUser?.data?.specialized?.name_en
        },
        {
            icon: <BsPeople />,
            label: <FormattedMessage id="profile.class" defaultMessage="Class" />,
            value: detailClassUser?.data?.name
        }
    ];

    return (
        <Card className="info-card flex-1" loading={statusDetailClassUser === 'loading'}>
            <h2 className="card-title">
                <FormattedMessage id="profile.information.info" defaultMessage="INFORMATION" />
            </h2>
            {infoItems.map((item, index) => (
                <div key={index} className="info-item">
                    <span className="icon">{item.icon}</span>
                    <span className="label">{item.label}:</span>
                    <span className="value">{item.value}</span>
                </div>
            ))}
        </Card>
    );
};

export default InfoCard; 