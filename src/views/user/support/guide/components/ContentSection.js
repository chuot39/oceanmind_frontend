import React from 'react';
import { Collapse, Divider } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const discussionGuides = [
    {
        key: '1',
        title: 'Làm sao đăng một bài thảo luận',
        content: (
            <div className="text_secondary">
                <p className="mb-3">Để đăng một bài thảo luận, bạn làm theo các bước sau:</p>
                <ol className="list-decimal list-inside space-y-2">
                    <li>Đăng nhập vào tài khoản của bạn trên trang web.</li>
                    <li>Truy cập vào mục Diễn đàn hoặc Cộng đồng.</li>
                    <li>Nhấn vào "Đăng Chủ Đề Mới" để tạo bài thảo luận.</li>
                    <li>Điền tiêu đề và nội dung bài thảo luận.</li>
                    <li>Nhấn "Đăng" để gửi bài.</li>
                </ol>
            </div>
        )
    },
    {
        key: '2',
        title: 'Làm sao đăng một bài thảo luận',
        content: 'Nội dung hướng dẫn chi tiết về cách đăng bài thảo luận...'
    },
    {
        key: '3',
        title: 'Làm sao đăng một bài thảo luận',
        content: 'Nội dung hướng dẫn chi tiết về cách đăng bài thảo luận...'
    },
    {
        key: '4',
        title: 'Làm sao đăng một bài thảo luận',
        content: 'Nội dung hướng dẫn chi tiết về cách đăng bài thảo luận...'
    }
];

const ContentSection = ({ activeSection }) => {
    if (!activeSection) return null;

    return (
        <div className="content_section rounded-lg shadow-sm">
            {/* Header */}
            <div className="p-4 rounded-t-lg flex items-center space-x-3">
                <div className="">{activeSection.icon}</div>
                <div>
                    <h2 className="text-lg font-semibold">{activeSection.title}</h2>
                    <p className="text-sm text_secondary">{activeSection.description}</p>
                </div>
            </div>

            <Divider className='my-0' />

            {/* Content */}
            <div className="p-4">
                <Collapse
                    expandIcon={({ isActive }) => (
                        <RightOutlined rotate={isActive ? 90 : 0} className="" />
                    )}
                    ghost
                    className="guide_collapse"
                >
                    {discussionGuides.map((guide) => (
                        <Panel
                            key={guide.key}
                            header={
                                <span className="font-medium text_first">{guide.title}</span>
                            }
                        >
                            <div className="text_secondary">
                                {guide.content}
                            </div>
                        </Panel>
                    ))}
                </Collapse>
            </div>
        </div>
    );
};

export default ContentSection; 