import React from 'react';
import { List, Tag, Avatar, Button } from 'antd';
import { BsBookmark, BsEye } from 'react-icons/bs';
import { formatDate } from '../../../../../utils/format/datetime';
import useSkin from '../../../../../utils/hooks/useSkin';
import { getTagColor } from '../../../../../utils/format/formartText';
import { FormattedMessage } from 'react-intl';

const DocumentListItem = ({ document, onViewDetail }) => {
    const { title, description, tags, creator, createdAt } = document;
    const { language } = useSkin()
    return (
        <List.Item
            className="document-list-item my-3"
            actions={[
                <Button
                    key="view"
                    type="primary"
                    onClick={() => onViewDetail(document)}
                >
                    <BsEye className="mr-1" /> <FormattedMessage id="common.view_detail" />
                </Button>
            ]}
        >
            <div className="flex items-start gap-4 w-full">
                <div className="document-thumbnail">
                    <img
                        src={document?.thumbnailImage?.file_path}
                        alt={title}
                        className="w-24 h-24 object-cover rounded-lg"
                    />
                </div>
                <div className="flex-1">
                    <div className="document-tags mb-2 flex flex-wrap gap-2">
                        {tags?.map((tag, index) => (
                            <Tag key={index} className={`${getTagColor(tag?.name_en)}`}>
                                {language === 'vi' ? tag?.name_vi : tag?.name_en}
                            </Tag>
                        ))}
                    </div>
                    <h3 className="text-lg text_first font-semibold mb-2">{title}</h3>
                    <p className="text-sm mb-3 line-clamp-2 text_secondary">{description}</p>

                    <div className="document-meta flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Avatar src={creator?.avatar?.file_path} size="small" />
                                <span className="text-sm text_secondary">by {creator?.fullname}</span>
                            </div>
                            <span className="text-sm text_secondary">{formatDate(createdAt)}</span>
                            <div className="flex items-center gap-1">
                                <BsBookmark className="text_secondary" />
                                {/* <span className="text-sm">{commentCount} Bình luận</span> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </List.Item>
    );
};

export default DocumentListItem; 