import React from 'react';
import { List, Button, Empty } from 'antd';
import { FormattedMessage } from 'react-intl';
import { FileOutlined, DownloadOutlined } from '@ant-design/icons';
import { getRelativeTime } from '../../../../../utils';

const Files = ({ group, skin }) => {
    // Extract all files from posts
    const allFiles = React.useMemo(() => {
        if (!group?.posts) return [];

        const files = [];
        group.posts.forEach(post => {
            if (post.postMedias?.data) {
                post.postMedias.data.forEach(item => {
                    if (item.media_id?.file_path && !item.media_id.file_path.match(/\.(jpeg|jpg|gif|png|mp4|webm|ogg)$/i)) {
                        files.push({
                            id: item.documentId,
                            name: item.media_id.name || 'File',
                            src: item.media_id.file_path,
                            size: item.media_id.size || '0',
                            type: item.media_id.mime_type || 'application/octet-stream',
                            postId: post.documentId,
                            createdAt: item.createdAt || post.createdAt,
                            createdBy: post.post_created_by?.fullname || 'Unknown'
                        });
                    }
                });
            }
        });

        // Sort by date (newest first)
        return files.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [group?.posts]);

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes || isNaN(bytes)) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Handle file download
    const handleDownload = (file) => {
        window.open(file.src, '_blank');
    };

    return (
        <div className="mt-4">
            {allFiles.length > 0 ? (
                <List
                    itemLayout="horizontal"
                    dataSource={allFiles}
                    renderItem={(file) => (
                        <List.Item
                            actions={[
                                <Button
                                    key="download"
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    onClick={() => handleDownload(file)}
                                >
                                    <FormattedMessage id="social.group.download" />
                                </Button>
                            ]}
                            className={`rounded-lg mb-2 ${skin === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
                        >
                            <List.Item.Meta
                                avatar={<FileOutlined className="text-3xl text-blue-500" />}
                                title={file.name}
                                description={
                                    <div className="flex flex-col">
                                        <span>{formatFileSize(file.size)}</span>
                                        <span className="text-gray-500">
                                            <FormattedMessage
                                                id="social.group.uploaded_by"
                                                values={{
                                                    user: file.createdBy,
                                                    time: getRelativeTime(file.createdAt)
                                                }}
                                            />
                                        </span>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty
                    description={<FormattedMessage id="social.group.no_files" />}
                    className="py-8"
                />
            )}
        </div>
    );
};

export default Files; 