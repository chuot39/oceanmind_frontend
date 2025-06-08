import React from 'react';
import { Table, Space, Button, Tooltip, Typography } from 'antd';
import { BsTrash, BsPencil, BsEye } from 'react-icons/bs';
import { format } from 'date-fns';

const { Text } = Typography;

const CategorySupportTable = ({
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
            title: 'Vietnamese Name',
            dataIndex: 'name_vi',
            key: 'name_vi',
            sorter: true,
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'English Name',
            dataIndex: 'name_en',
            key: 'name_en',
            sorter: true,
        },
        {
            title: 'Vietnamese Description',
            dataIndex: 'description_vi',
            key: 'description_vi',
            ellipsis: true,
            render: (text) => text ?
                <Text ellipsis={{ tooltip: text }}>{text}</Text> :
                <Text type="secondary" italic>No description</Text>,
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
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
            className="category-support-table"
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

export default CategorySupportTable; 