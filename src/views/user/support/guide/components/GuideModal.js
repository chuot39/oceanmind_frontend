import React from 'react';
import { Modal } from 'antd';

const GuideModal = ({ isOpen, onClose, title, content }) => {
    return (
        <Modal
            title={title}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={700}
            className="guide-modal"
        >
            <div className="p-4">
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Để đăng một bài thảo luận, bạn làm theo các bước sau:</h3>
                    <ol className="list-decimal list-inside space-y-2 text_secondary">
                        <li>Đăng nhập vào tài khoản của bạn trên trang web.</li>
                        <li>Truy cập vào mục Diễn đàn hoặc Cộng đồng.</li>
                        <li>Nhấn vào "Đăng Chủ Đề Mới" để tạo bài thảo luận.</li>
                        <li>Điền tiêu đề và nội dung bài thảo luận.</li>
                        <li>Nhấn "Đăng" để gửi bài.</li>
                    </ol>
                </div>
                <div className="text_secondary">
                    {content}
                </div>
            </div>
        </Modal>
    );
};

export default GuideModal; 