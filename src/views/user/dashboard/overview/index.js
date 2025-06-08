import React from 'react';
import '@core/scss/styles/pages/dashboard/index.scss'
import useSkin from '@utils/hooks/useSkin';
import { useUserData } from '@utils/hooks/useAuth';
import { Col, Row } from 'antd';
import CardWelcomes from './components/CardWelcomes';
import CardCarousel from './components/CardCarousel';
import CardTrainingProcess from './components/CardTrainingProcess';
import CardTask from './components/CardTask';
import PostOfMonth from './components/PostOfMonth';
import TableGroup from './components/TableGroup';

const Dashboard = () => {
    const { userData } = useUserData()
    const { skin, language } = useSkin()
    return (
        <div className="min-h-screen bg-transparent">
            <Row gutter={16}>
                <Col lg={12} md={24} >
                    <CardWelcomes userData={userData} language={language} />
                </Col>
                <Col lg={12} md={24} className='parent_carousel'>
                    <CardCarousel userData={userData} language={language} />
                </Col>
            </Row>

            <Row gutter={16} className='mt-10'>
                <Col lg={12} md={24} >
                    <CardTrainingProcess skin={skin} userData={userData} />
                </Col>
                <Col lg={12} md={24} className='parent_carousel'>
                    <CardTask userData={userData} skin={skin} />
                </Col>
            </Row>

            <Row gutter={16} className='mt-10'>
                <Col lg={24} md={24} >
                    <PostOfMonth userData={userData} skin={skin} />
                </Col>
            </Row>

            <Row gutter={16} className='mt-10 mb-20'>
                <Col lg={24} md={24} >
                    <TableGroup userData={userData} skin={skin} />
                </Col>
            </Row>
        </div>

    );
}

export default Dashboard;