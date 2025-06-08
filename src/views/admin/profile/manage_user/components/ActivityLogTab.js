import React from 'react';
import { Table, Tag, Space, DatePicker, Button, Row, Col, Card } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;

const ActivityLogTab = ({ activityData = [] }) => {
    const [filteredData, setFilteredData] = React.useState(activityData);
    const [dateRange, setDateRange] = React.useState(null);

    React.useEffect(() => {
        setFilteredData(activityData);
    }, [activityData]);

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        if (!dates || dates.length < 2) {
            setFilteredData(activityData);
            return;
        }

        const [start, end] = dates;
        const filtered = activityData.filter(activity => {
            const activityDate = moment(activity.timestamp);
            return activityDate.isSameOrAfter(start, 'day') && activityDate.isSameOrBefore(end, 'day');
        });

        setFilteredData(filtered);
    };

    const handleResetFilter = () => {
        setDateRange(null);
        setFilteredData(activityData);
    };

    const handleExport = (type) => {
        // Thực hiện xuất file trong ứng dụng thực tế
        console.log(`Exporting to ${type}...`);
    };

    const columns = [
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
        },
        {
            title: 'Địa chỉ IP',
            dataIndex: 'ip_address',
            key: 'ip_address',
        },
        {
            title: 'Thiết bị',
            dataIndex: 'device',
            key: 'device',
        },
        {
            title: 'Vị trí',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: type => {
                let color = 'blue';
                if (type === 'auth') color = 'green';
                if (type === 'profile') color = 'orange';
                if (type === 'project') color = 'purple';

                return <Tag color={color}>{type.toUpperCase()}</Tag>;
            },
            filters: [
                { text: 'Xác thực', value: 'auth' },
                { text: 'Hồ sơ', value: 'profile' },
                { text: 'Dự án', value: 'project' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: 'Thời gian',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm:ss'),
            sorter: (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix(),
            defaultSortOrder: 'descend',
        },
    ];

    return (
        <div>
            <Row gutter={16} className="mb-4">
                <Col span={24}>
                    <Card title="Bộ lọc" className="filter-card">
                        <div className="flex flex-wrap items-center gap-4">
                            <div>
                                <label className="block mb-1">Khoảng thời gian</label>
                                <RangePicker
                                    value={dateRange}
                                    onChange={handleDateRangeChange}
                                    allowClear
                                />
                            </div>

                            <Button
                                icon={<FilterOutlined />}
                                onClick={handleResetFilter}
                            >
                                Đặt lại bộ lọc
                            </Button>

                            <div className="ml-auto">
                                <Space>
                                    <Button
                                        icon={<FileExcelOutlined />}
                                        onClick={() => handleExport('excel')}
                                    >
                                        Xuất Excel
                                    </Button>
                                    <Button
                                        icon={<FilePdfOutlined />}
                                        onClick={() => handleExport('pdf')}
                                    >
                                        Xuất PDF
                                    </Button>
                                </Space>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default ActivityLogTab; 