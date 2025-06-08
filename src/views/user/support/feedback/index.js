import React, { useState } from 'react';
import { Alert, Button, Card, Input } from 'antd';
import ContactInfo from './components/ContactInfo';
import EmojiRating from './components/EmojiRating';
import FeedbackSection from './components/FeedbackSection';
import '../../../../core/scss/styles/pages/support/feedback.scss';
import Marquee from 'react-fast-marquee';

const Feedback = () => {
    const [frequencyRating, setFrequencyRating] = useState(null);
    const [experienceRating, setExperienceRating] = useState(null);
    const [interfaceRating, setInterfaceRating] = useState(null);

    const frequencyOptions = [
        { value: 'never', label: 'Không bao giờ' },
        { value: 'rarely', label: 'Hiếm khi' },
        { value: 'monthly', label: 'Hàng tháng' },
        { value: 'weekly', label: 'Hàng tuần' },
        { value: 'daily', label: 'Hàng ngày' }
    ];

    const experienceOptions = [
        { value: 'very_difficult', label: 'Rất khó' },
        { value: 'difficult', label: 'Khó' },
        { value: 'normal', label: 'Ổn' },
        { value: 'easy', label: 'Dễ dàng' },
        { value: 'very_easy', label: 'Rất dễ dàng' }
    ];

    const interfaceOptions = [
        { value: 'very_difficult', label: 'Rất khó sử dụng' },
        { value: 'difficult', label: 'Khó sử dụng' },
        { value: 'normal', label: 'Bình thường' },
        { value: 'friendly', label: 'Thân thiện' },
        { value: 'very_friendly', label: 'Rất thân thiện' }
    ];

    const learningManagementQuestions = [
        {
            text: 'Các chức năng quản lý bài tập cá nhân và nhóm có đáp ứng được nhu cầu của bạn không? (nếu không, hãy nêu lý do)',
            hasTextArea: true
        },
        {
            text: 'Bạn có gặp khó khăn nào trong việc theo dõi tiến độ học tập không? Nếu có, hãy mô tả.',
            hasTextArea: true
        }
    ];

    const documentsDiscussionQuestions = [
        {
            text: 'Chức năng chia sẻ tài liệu có hữu ích với bạn không? (Có/Không, nếu không, tại sao?)',
            hasTextArea: true
        },
        {
            text: 'Bạn có gặp vấn đề nào khi tham gia thảo luận hoặc đăng bài trong cộng đồng không? (Có/Không, nếu có, hãy nêu cụ thể)',
            hasTextArea: true
        }
    ];

    const portfolioQuestions = [
        {
            text: 'Bạn có thấy dễ dàng trong việc tạo và quản lý portfolio cá nhân của mình trên trang web không? (Có/Không, nếu không, hãy nêu lý do)',
            hasTextArea: true
        }
    ];

    const userSupportQuestions = [
        {
            text: 'Bạn có hài lòng với tính năng hỗ trợ/hướng dẫn sử dụng trang web không? (Có/Không, nếu không, hãy nêu lý do)',
            hasTextArea: false
        },
        {
            text: 'Bạn có gặp vấn đề kỹ thuật nào khi sử dụng trang web không? Nếu có, hãy mô tả.',
            hasTextArea: true
        }
    ];

    const finalEvaluationQuestions = [
        {
            text: 'Bạn có sẵn sàng giới thiệu trang web này cho bạn bè/cộng đồng học tập của mình không? (Có/Không, nếu không, hãy nêu lý do)',
            hasTextArea: false
        }
    ];

    const handleSubmit = () => {
        // Handle form submission
        console.log('Form submitted');
    };

    return (
        <div className="feedback_container mb-14">
            {/* <div className="max-w-7xl mx-auto"> */}
            {/* <Header /> */}
            <Alert
                banner
                type="info"
                showIcon
                message={
                    <Marquee speed={60} pauseOnHover gradient={false}>
                        This feature is under development, please wait for the next update! We will notify you when it is ready.🥰🥰🥰
                    </Marquee>
                }
                className="mb-6 rounded-lg text-lg"
            />


            <div className="flex flex-row gap-6">
                <div className="w-1/3">
                    <div className="sticky top-16">
                        <ContactInfo />
                    </div>
                </div>
                <div className="w-2/3 space-y-6">
                    <Card className=" rounded-lg p-6"
                        title={
                            <h3 className=" text-lg font-medium mb-6">Đánh giá tổng quan</h3>
                        }
                    >
                        <EmojiRating
                            question="Bạn có thường xuyên sử dụng trang web này để hỗ trợ học tập không?"
                            options={frequencyOptions}
                            value={frequencyRating}
                            onChange={(e) => setFrequencyRating(e.target.value)}
                        />
                        <EmojiRating
                            question="Bạn cảm thấy trải nghiệm sử dụng trang web có dễ dàng và trực quan không?"
                            options={experienceOptions}
                            value={experienceRating}
                            onChange={(e) => setExperienceRating(e.target.value)}
                        />
                    </Card>

                    <FeedbackSection
                        title="Quản lý học tập"
                        questions={learningManagementQuestions}
                    />

                    <FeedbackSection
                        title="Tài liệu và thảo luận"
                        questions={documentsDiscussionQuestions}
                    />

                    <FeedbackSection
                        title="Portfolio cá nhân hóa"
                        questions={portfolioQuestions}
                    />

                    <Card className="rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-6">Đánh giá giao diện và thiết kế</h3>
                        <EmojiRating
                            question="Giao diện trang web có thân thiện và dễ sử dụng không?"
                            options={interfaceOptions}
                            value={interfaceRating}
                            onChange={(e) => setInterfaceRating(e.target.value)}
                        />
                        <div className="mt-4">
                            <p className="mb-2">Bạn có đề xuất gì để cải thiện giao diện trang web?</p>
                            <Input.TextArea
                                className="w-full p-2 border rounded-md"
                                rows="4"
                                placeholder="Add your comments..."
                            />
                        </div>
                    </Card>

                    <FeedbackSection
                        title="Hỗ trợ người dùng"
                        questions={userSupportQuestions}
                    />

                    <Card className=" rounded-lg p-6">
                        <h3 className=" text-lg font-medium mb-6">Ý tưởng và đề xuất</h3>
                        <div className="space-y-4">
                            <div>
                                <p className=" mb-2">Theo bạn, trang web còn thiếu những tính năng nào mà bạn mong muốn?</p>
                                <Input.TextArea
                                    className="w-full p-2 border rounded-md"
                                    rows="4"
                                    placeholder="Add your comments..."
                                />
                            </div>
                            <div>
                                <p className=" mb-2">Bạn có đề xuất nào để cải thiện trải nghiệm học tập hoặc quản lý cá nhân trên trang web này?</p>
                                <Input.TextArea
                                    className="w-full p-2 border rounded-md"
                                    rows="4"
                                    placeholder="Add your comments..."
                                />
                            </div>
                        </div>
                    </Card>

                    <FeedbackSection
                        title="Đánh giá tổng thể"
                        questions={finalEvaluationQuestions}
                    />

                    <div className="mt-8">
                        <Button type="primary" onClick={handleSubmit} className="submit-button float-right">
                            SUBMIT
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        // </div>
    );
};

export default Feedback;