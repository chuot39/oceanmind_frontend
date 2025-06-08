import React, { useMemo } from 'react';
import { Avatar, Card, Carousel, Col, Row } from 'antd';
import welcome_left from '@assets/icons/welcome_left.png'
import welcome_right from '@assets/icons/welcome_right.png'
import { FormattedMessage } from 'react-intl';
import { useEvent, useGroup, usePost, useTaskInWeek, useTaskUserCurrentWeek, useUserOnline } from '../hook';
import carousel_analytic from '@assets/icons/carousel_analytic.png'
import { getTaskStatus } from '@/helpers/taskHelper';
import { formatDate } from '@/utils';
import BtnLocation from '@/components/button/ui/BtnLocation';

const CardCarousel = ({ userData, language }) => {
    const { data: taskUserCurrentWeek } = useTaskUserCurrentWeek(userData?.documentId)
    const { data: newTaskInWeek } = useTaskInWeek()
    const { data: post } = usePost();
    const { data: group } = useGroup();
    const { data: userOnline } = useUserOnline();
    const { data: event } = useEvent();


    const taskCompletedCurrentWeek = taskUserCurrentWeek?.data?.filter(task => getTaskStatus(task) === 'completed');
    const percentage = useMemo(() => {
        return taskUserCurrentWeek?.data?.length > 0 ? (taskCompletedCurrentWeek?.length / taskUserCurrentWeek?.data?.length) * 100 || 0 : 100
    }, [taskUserCurrentWeek, taskCompletedCurrentWeek])


    return (
        <Carousel autoplay className='h-full'>
            <Card className='card-carousel h-full'>
                <Row gutter={10} className='text-center flex '>
                    <Col span={10}><img className='congratulations-img-left' src={welcome_left} alt='decor-left' /> </Col>
                    <Col span={4} className='mt-6'><Avatar src={userData?.avatar?.file_path} className='shadow' size={60} /> </Col>
                    <Col span={10} className='flex justify-end'><img className='w-40 h-20' src={welcome_right} alt='decor-right' /> </Col>
                </Row>

                <Row className='text-center justify-center flex flex-wrap'>
                    <div className={`text-carousel text-3xl font-bold ${language === 'vi' ? 'w-52' : 'w-60'}`}><FormattedMessage id="dashboard.congratulations" /> {userData?.fullname}!</div>
                    <div className={`text-2xl mt-6 w-full font-semibold text_first px-4`}><FormattedMessage id="dashboard.completion_message" values={{ percentage: percentage }} /></div>
                </Row>
            </Card>

            <Card className='card-carousel web_analytic h-full'>
                <Row gutter={10} className='text-center flex '>
                    <Col span={24} className='flex justify-start font-bold text_first text-2xl py-3' style={{ paddingLeft: '24px', paddingRight: '24px' }}><FormattedMessage id="dashboard.carousel.analytic" /> </Col>
                </Row>

                <Row gutter={16} align="middle ps-6 mt-4">
                    <Col span={12} className=''>
                        <Row gutter={[10, 16]} className='flex justify-center items-center my-4 '>
                            <Col span={6} className="bg-indigo-500 text-white font-bold text-center rounded-md py-1">
                                {newTaskInWeek?.pagination?.total || 0}
                            </Col>
                            <Col span={18} className="text_first text-lg">
                                <FormattedMessage id="dashboard.carousel.new_tasks" />
                            </Col>
                        </Row>
                        <Row gutter={[10, 16]} className='flex justify-center items-center my-4'>
                            <Col span={6} className="bg-indigo-500 text-white font-bold text-center rounded-md py-1">
                                {userOnline?.pagination?.total + 10 || 0}
                            </Col>
                            <Col span={18} className="text_first text-lg">
                                <FormattedMessage id="dashboard.carousel.visitors" />
                            </Col>
                        </Row>
                        <Row gutter={[10, 16]} className='flex justify-center items-center my-4'>
                            <Col span={6} className="bg-indigo-500 text-white font-bold text-center rounded-md py-1">
                                {post?.pagination?.total || 0}
                            </Col>
                            <Col span={18} className="text_first text-lg">
                                <FormattedMessage id="dashboard.carousel.posts" />
                            </Col>
                        </Row>
                        <Row gutter={[10, 16]} className='flex justify-center items-center my-4'>
                            <Col span={6} className="bg-indigo-500 text-white font-bold text-center rounded-md py-1">
                                {group?.pagination?.total || 0}
                            </Col>
                            <Col span={18} className="text_first text-lg">
                                <FormattedMessage id="dashboard.carousel.groups" />
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <div className='flex justify-center items-center h-full'>
                            <img src={carousel_analytic} alt="3D Sphere" className='w-36 h-36 animate-spin-slow' />
                        </div>
                    </Col>
                </Row>
            </Card>

            <Card className='card-carousel new_event h-full'>
                <Row gutter={10} className='text-center flex '>
                    <Col span={24} className='flex justify-start font-bold text_first text-2xl py-3' style={{ paddingLeft: '24px', paddingRight: '24px' }}><FormattedMessage id="dashboard.carousel.new_event" /> </Col>
                </Row>

                <Row gutter={16} align="middle px-6 h-56 mt-4">
                    <Col span={24} className='flex h-full'>
                        <div className='flex flex-wrap content-between  w-full'>
                            <div>
                                <p className='text_first text-lg font-semibold'>
                                    {event?.data[0]?.name}
                                </p>
                                <p className='text_first text-sm font-light'>{event?.data[0]?.description}</p>
                                <p className='text_first italic flex items-center text-sm font-light mt-2'> <BtnLocation /> <span className='ml-2'>{event?.data[0]?.location}</span></p>
                            </div>
                            <div className='flex content-between'>
                                <img src={event?.data[0]?.banner?.file_path || carousel_analytic} alt="3D Sphere" className='w-10 h-auto me-3 rounded-full' />
                                <div>
                                    <p className='text_first text-sm font-semibold'>by Super Admin OceanMind |</p>
                                    <p className='text_first text-sm font-light'>{formatDate(event?.data[0]?.createdAt, 'dd/MM/yyyy')}</p>
                                </div>

                            </div>
                        </div>
                        <div className='flex justify-center content-center w-full'>
                            <img src={event?.data[0]?.banner?.file_path || carousel_analytic} alt="3D Sphere" className='w-62 h-auto rounded-md' />
                        </div>
                    </Col>
                </Row>
            </Card>


        </Carousel>
    )
};
export default CardCarousel;