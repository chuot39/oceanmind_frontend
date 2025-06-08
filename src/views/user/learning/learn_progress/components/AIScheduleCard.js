import React, { useState } from 'react';
import { Card, Button, Modal, Radio, Input, Form, Divider } from 'antd';
import { BsLightbulb } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import light from '../../../../../assets/images/pages/light.png'
import pen from '../../../../../assets/images/pages/pen.png'
const { TextArea } = Input;

const AIScheduleCard = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const intl = useIntl();

    const surveyQuestions = [
        {
            question: intl.formatMessage({ id: 'learning.learning_progress.survey.morning_study' }),
            key: 'morning_study'
        },
        {
            question: intl.formatMessage({ id: 'learning.learning_progress.survey.break_time' }),
            key: 'break_time'
        },
        {
            question: intl.formatMessage({ id: 'learning.learning_progress.survey.subject_grouping' }),
            key: 'subject_grouping'
        },
        {
            question: intl.formatMessage({ id: 'learning.learning_progress.survey.extracurricular' }),
            key: 'extracurricular'
        },
        {
            question: intl.formatMessage({ id: 'learning.learning_progress.survey.difficulty_based' }),
            key: 'difficulty_based'
        },
        {
            question: intl.formatMessage({ id: 'learning.learning_progress.survey.part_time_job' }),
            key: 'part_time_job'
        }
    ];

    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        console.log(values);
        setIsModalVisible(false);
    };

    return (
        <>
            <Card className="ai-schedule-card mb-6">
                <div className='flex items-center gap-2'>
                    <img
                        src={light}
                        alt={intl.formatMessage({ id: 'learning.learning_progress.light_icon_alt' })}
                        className='p-4 w-36 h-36'
                    />
                    <h2 className="text-center text_first ps-6 pe-24 text-2xl font-bold mb-4">
                        <FormattedMessage id="learning.learning_progress.start_learning" />
                    </h2>
                </div>
                <p className="text-center px-32 text-xl mb-4 text_first">
                    <FormattedMessage id="learning.learning_progress.start_learning_description" />
                </p>
                <div className='flex justify-center items-center relative pt-4'>
                    <Button className='p-7' type="primary" size="large" onClick={() => setIsModalVisible(true)}>
                        <FormattedMessage id="learning.learning_progress.start_learning_button" />
                    </Button>
                    <div className="icon-wrapper text-primary text-4xl absolute right-6">
                        <BsLightbulb />
                    </div>
                    {/* <img src={pen} preview={false} alt="light" className='image_pen' /> */}
                </div>
            </Card>

            <Modal
                title={<FormattedMessage id="learning.learning_progress.survey.title" />}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
                className='ai_schedule_modal'
            >

                <Divider className='my-3' />
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    {surveyQuestions.map((q, index) => (
                        <Form.Item
                            key={q.key}
                            name={q.key}
                            label={q.question}
                            rules={[{ required: true, message: intl.formatMessage({ id: 'learning.learning_progress.survey.required_message' }) }]}
                        >
                            <Radio.Group>
                                <Radio value="yes">
                                    <FormattedMessage id="learning.learning_progress.survey.yes" />
                                </Radio>
                                <Radio value="no">
                                    <FormattedMessage id="learning.learning_progress.survey.no" />
                                </Radio>
                                <Radio value="maybe">
                                    <FormattedMessage id="learning.learning_progress.survey.maybe" />
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    ))}

                    <Form.Item
                        name="other_requirements"
                        label={<FormattedMessage id="learning.learning_progress.survey.other_requirements" />}
                    >
                        <TextArea
                            rows={4}
                            placeholder={intl.formatMessage({ id: 'learning.learning_progress.survey.other_requirements_placeholder' })}
                        />
                    </Form.Item>

                    <Form.Item className="text-right">
                        <Button type="default" className="mr-2" onClick={() => setIsModalVisible(false)}>
                            <FormattedMessage id="learning.learning_progress.survey.cancel" />
                        </Button>
                        <Button type="primary" htmlType="submit">
                            <FormattedMessage id="learning.learning_progress.survey.create" />
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default AIScheduleCard; 