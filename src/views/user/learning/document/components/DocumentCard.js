import React from 'react';
import { Card, Tag, Avatar, Tooltip } from 'antd';
import { BsBookmark, BsDownload } from 'react-icons/bs';
import { formatDate } from '../../../../../utils/format/datetime';
import useSkin from '../../../../../utils/hooks/useSkin';
import { getTagColor } from '../../../../../utils/format/formartText';

const DocumentCard = ({ document, onViewDetail }) => {
    const { title, description, thumbnailImage, tags, creator, createdAt } = document;
    const { language } = useSkin()

    return (
        <div className="w-full h-full">
            <Card
                hoverable
                className="w-full document-card flex flex-col h-full"
                cover={
                    <div className="h-48 relative">
                        <img
                            alt={title}
                            src={thumbnailImage?.file_path}
                            className="h-full w-full object-cover"
                        />
                        <div className="flex absolute gap-2 right-2 top-2">
                            <Tooltip title="Lưu tài liệu">
                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                                    <BsBookmark className="text-gray-600" />
                                </button>
                            </Tooltip>
                            <Tooltip title="Tải xuống">
                                <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                                    <BsDownload className="text-gray-600" />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                }
                onClick={onViewDetail}
            >
                <div className="flex flex-col h-full">
                    <div className="flex flex-wrap gap-2 mb-3 ">
                        {tags?.length > 0 && tags?.map((tag, index) => (
                            <Tag key={index} className={`${getTagColor(tag?.name_en)}`}>
                                {language === 'vi' ? tag?.name_vi : tag?.name_en}
                            </Tag>
                        ))}
                    </div>

                    <h3 className="text-lg font-semibold line-clamp-2 mb-2">{title}</h3>
                    <p className="line-clamp-2 mb-4 text_secondary">{description}</p>

                    <div className="flex justify-between items-center mt-auto">
                        <div className="flex gap-2 items-center">
                            <Avatar src={creator?.avatar?.file_path} size="small" />
                            <span className="text-sm text_secondary">{creator?.fullname}</span>
                        </div>
                        <div className="flex text-gray-500 text-sm gap-3 items-center">
                            <span>{formatDate(createdAt) || ''}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default DocumentCard; 