import React, { useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import { Button, Card } from 'antd';
import GuideModal from './GuideModal';
import { FormattedMessage } from 'react-intl';

const cardData = [
    {
        icon: <FaUsers className="text-4xl text-[#5B9BD5]" />,
        title: "Đăng bài thảo luận",
        description: "Chúc mừng! Đăng Bài Thảo luận giúp bạn chia sẻ ý kiến, câu hỏi và tham gia thảo luận với cộng đồng. Đây là nơi để học hỏi và kết nối với người dùng khác.",
        modalContent: "Hướng dẫn chi tiết về cách đăng bài thảo luận và các quy tắc cần tuân thủ."
    },
    {
        icon: <FaUsers className="text-4xl text-[#5B9BD5]" />,
        title: "Tham gia thảo luận",
        description: "Chúc mừng! Đăng Bài Thảo luận giúp bạn chia sẻ ý kiến, câu hỏi và tham gia thảo luận với cộng đồng. Đây là nơi để học hỏi và kết nối với người dùng khác.",
        modalContent: "Hướng dẫn chi tiết về cách tham gia thảo luận hiệu quả."
    },
    {
        icon: <FaUsers className="text-4xl text-[#5B9BD5]" />,
        title: "Quản lý bài viết",
        description: "Chúc mừng! Đăng Bài Thảo luận giúp bạn chia sẻ ý kiến, câu hỏi và tham gia thảo luận với cộng đồng. Đây là nơi để học hỏi và kết nối với người dùng khác.",
        modalContent: "Thông tin về cách quản lý các bài viết của bạn."
    },
    {
        icon: <FaUsers className="text-4xl text-[#5B9BD5]" />,
        title: "Tương tác cộng đồng",
        description: "Chúc mừng! Đăng Bài Thảo luận giúp bạn chia sẻ ý kiến, câu hỏi và tham gia thảo luận với cộng đồng. Đây là nơi để học hỏi và kết nối với người dùng khác.",
        modalContent: "Hướng dẫn về cách tương tác hiệu quả với cộng đồng."
    },
    {
        icon: <FaUsers className="text-4xl text-[#5B9BD5]" />,
        title: "Báo cáo và phản hồi",
        description: "Chúc mừng! Đăng Bài Thảo luận giúp bạn chia sẻ ý kiến, câu hỏi và tham gia thảo luận với cộng đồng. Đây là nơi để học hỏi và kết nối với người dùng khác.",
        modalContent: "Hướng dẫn về cách báo cáo nội dung không phù hợp."
    },
    {
        icon: <FaUsers className="text-4xl text-[#5B9BD5]" />,
        title: "Quy tắc cộng đồng",
        description: "Chúc mừng! Đăng Bài Thảo luận giúp bạn chia sẻ ý kiến, câu hỏi và tham gia thảo luận với cộng đồng. Đây là nơi để học hỏi và kết nối với người dùng khác.",
        modalContent: "Thông tin về các quy tắc và hướng dẫn của cộng đồng."
    }
];

const DiscussionCard = ({ icon, title, description, modalContent, onShowModal }) => {
    return (
        <Card className="text-center">
            <div className="flex justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text_secondary text-sm mb-4">
                {description}
            </p>
            <Button
                type="primary"
                className="btn_guide_show w-24"
                onClick={() => onShowModal(title, modalContent)}
            >
                <FormattedMessage id="support.guide.show" defaultMessage="Show" />
            </Button>
        </Card>
    );
};

const DiscussionCards = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '' });

    const handleShowModal = (title, content) => {
        setModalContent({ title, content });
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardData.map((card, index) => (
                    <DiscussionCard
                        key={index}
                        {...card}
                        onShowModal={handleShowModal}
                    />
                ))}
            </div>

            <GuideModal
                isOpen={modalVisible}
                onClose={handleCloseModal}
                title={modalContent.title}
                content={modalContent.content}
            />
        </>
    );
};

export default DiscussionCards; 