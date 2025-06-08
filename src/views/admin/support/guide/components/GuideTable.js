import React from 'react';
import { Table, Space, Button, Tooltip, Tag, Typography } from 'antd';
import { BsTrash, BsPencil, BsEye } from 'react-icons/bs';
import { format } from 'date-fns';

const { Text, Paragraph } = Typography;

const GuideTable = ({
    data,
    loading,
    pagination,
    onChange,
    onView,
    onEdit,
    onDelete
}) => {
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            className: 'title-column',
            sorter: true,
            render: (text) => (
                <Paragraph
                    ellipsis={{ rows: 2, expandable: false, tooltip: text }}
                    className="font-medium"
                >
                    {text}
                </Paragraph>
            ),
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            className: 'content-column',
            render: (text) => (
                <Paragraph
                    ellipsis={{ rows: 2, expandable: false, tooltip: text }}
                >
                    {text}
                </Paragraph>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: true,
            render: (category) => (
                <Tag color="blue" className="category-tag">
                    {category?.name_vi || 'Unknown'}
                </Tag>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            sorter: true,
            render: (date) => format(new Date(date), 'dd/MM/yyyy'),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            size="small"
                            icon={<BsEye />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onView(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            size="small"
                            icon={<BsPencil />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            danger
                            size="small"
                            icon={<BsTrash />}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(record);
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table
            className="guide-table"
            columns={columns}
            dataSource={data?.map(item => ({ ...item, key: item.documentId }))}
            loading={loading}
            pagination={pagination}
            onChange={onChange}
            rowClassName="cursor-pointer"
            onRow={(record) => ({
                onClick: () => onView(record),
            })}
        />
    );
};

export default GuideTable; 