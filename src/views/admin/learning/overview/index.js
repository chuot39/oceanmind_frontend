import React, { useState } from 'react';
import {
    Tabs, Card, Table, Button, Space, Input, Modal, Form,
    Select, Upload, message, Progress, Tag, Row, Col, Statistic,
    Timeline, Tooltip, Drawer, List, Avatar
} from 'antd';
import {
    PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined,
    FileOutlined, UserOutlined, CheckCircleOutlined, ClockCircleOutlined,
    ExclamationCircleOutlined, BarChartOutlined, FileTextOutlined,
    VideoCameraOutlined, BookOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import apiClient from '@utils/api';
import { API_BASE_URL } from '@constants';
import moment from 'moment';
import { Column } from '@ant-design/plots';

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const LearningManagement = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const queryClient = useQueryClient();

    // Fetch learning programs with detailed info
    const { data: programs, isLoading } = useQuery('learning-programs', async () => {
        const response = await apiClient.get(`${API_BASE_URL}/learning-programs?populate=*`);
        return response?.data || [];
    });

    // Fetch progress data with student details
    const { data: progress } = useQuery('learning-progress', async () => {
        const response = await apiClient.get(`${API_BASE_URL}/learning-progress?populate=*`);
        return response?.data || [];
    });

    // Fetch course materials
    const { data: materials } = useQuery('learning-materials', async () => {
        const response = await apiClient.get(`${API_BASE_URL}/learning-materials?populate=*`);
        return response?.data || [];
    });

    // Fetch assessments
    const { data: assessments } = useQuery('assessments', async () => {
        const response = await apiClient.get(`${API_BASE_URL}/assessments?populate=*`);
        return response?.data || [];
    });

    // Create/Update program mutation
    const { mutate: saveProgram } = useMutation(
        async (values) => {
            const formData = new FormData();
            Object.keys(values).forEach(key => {
                if (key === 'materials') {
                    values[key].forEach(file => {
                        formData.append('materials', file.originFileObj);
                    });
                } else {
                    formData.append(key, values[key]);
                }
            });

            if (editingProgram) {
                return apiClient.put(`${API_BASE_URL}/learning-programs/${editingProgram.id}`, formData);
            }
            return apiClient.post(`${API_BASE_URL}/learning-programs`, formData);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('learning-programs');
                message.success(`Program ${editingProgram ? 'updated' : 'created'} successfully`);
                handleModalClose();
            },
            onError: (error) => {
                message.error(error.message || 'An error occurred');
            },
        }
    );

    // Program performance data for charts
    const performanceData = programs?.map(program => [
        {
            program: program.name,
            type: 'Completion',
            value: program.completion_rate
        },
        {
            program: program.name,
            type: 'Satisfaction',
            value: program.satisfaction_rate
        },
        {
            program: program.name,
            type: 'Engagement',
            value: program.engagement_rate
        }
    ]).flat() || [];

    const performanceConfig = {
        data: performanceData,
        isGroup: true,
        xField: 'program',
        yField: 'value',
        seriesField: 'type',
        label: {
            position: 'middle',
            layout: [
                { type: 'interval-adjust-position' },
                { type: 'interval-hide-overlap' },
                { type: 'adjust-color' }
            ]
        }
    };

    const programColumns = [
        {
            title: 'Program Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <a onClick={() => handleProgramClick(record)}>{text}</a>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            render: (duration) => `${duration} weeks`,
            sorter: (a, b) => a.duration - b.duration,
        },
        {
            title: 'Enrollment',
            dataIndex: 'enrollment_count',
            key: 'enrollment',
            sorter: (a, b) => a.enrollment_count - b.enrollment_count,
        },
        {
            title: 'Completion Rate',
            dataIndex: 'completion_rate',
            key: 'completion',
            render: (rate) => (
                <Tooltip title={`${rate}% completed`}>
                    <Progress percent={rate} size="small" />
                </Tooltip>
            ),
            sorter: (a, b) => a.completion_rate - b.completion_rate,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    active: 'green',
                    draft: 'gold',
                    archived: 'red',
                };
                return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
            },
            filters: [
                { text: 'Active', value: 'active' },
                { text: 'Draft', value: 'draft' },
                { text: 'Archived', value: 'archived' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Button icon={<BarChartOutlined />} onClick={() => handleViewAnalytics(record)}>
                        Analytics
                    </Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const materialColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Space>
                    {record.type === 'video' ? <VideoCameraOutlined /> :
                        record.type === 'document' ? <FileTextOutlined /> : <BookOutlined />}
                    {text}
                </Space>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: [
                { text: 'Video', value: 'video' },
                { text: 'Document', value: 'document' },
                { text: 'Quiz', value: 'quiz' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: 'Program',
            dataIndex: ['program', 'name'],
            key: 'program',
        },
        {
            title: 'Upload Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('MMM D, YYYY'),
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (size) => `${(size / 1024 / 1024).toFixed(2)} MB`,
            sorter: (a, b) => a.size - b.size,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<FileOutlined />}>View</Button>
                    <Button icon={<EditOutlined />}>Edit</Button>
                    <Button danger icon={<DeleteOutlined />}>Delete</Button>
                </Space>
            ),
        },
    ];

    const assessmentColumns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            filters: [
                { text: 'Quiz', value: 'quiz' },
                { text: 'Assignment', value: 'assignment' },
                { text: 'Exam', value: 'exam' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date) => moment(date).format('MMM D, YYYY'),
            sorter: (a, b) => moment(a.dueDate).unix() - moment(b.dueDate).unix(),
        },
        {
            title: 'Submissions',
            dataIndex: 'submission_count',
            key: 'submissions',
            sorter: (a, b) => a.submission_count - b.submission_count,
        },
        {
            title: 'Average Score',
            dataIndex: 'average_score',
            key: 'average_score',
            render: (score) => (
                <Tooltip title={`${score}% average score`}>
                    <Progress percent={score} size="small" />
                </Tooltip>
            ),
            sorter: (a, b) => a.average_score - b.average_score,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    active: 'green',
                    pending: 'gold',
                    closed: 'red',
                };
                return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button>View Submissions</Button>
                    <Button icon={<EditOutlined />}>Edit</Button>
                    <Button danger icon={<DeleteOutlined />}>Delete</Button>
                </Space>
            ),
        },
    ];

    const handleProgramClick = (program) => {
        setSelectedProgram(program);
        setIsDrawerVisible(true);
    };

    const handleViewAnalytics = (program) => {
        // Implement analytics view
        console.log('View analytics:', program);
    };

    const handleEdit = (program) => {
        setEditingProgram(program);
        form.setFieldsValue(program);
        setIsModalVisible(true);
    };

    const handleDelete = (programId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this program?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await apiClient.delete(`${API_BASE_URL}/learning-programs/${programId}`);
                    queryClient.invalidateQueries('learning-programs');
                    message.success('Program deleted successfully');
                } catch (error) {
                    message.error(error.message || 'An error occurred');
                }
            },
        });
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setEditingProgram(null);
        form.resetFields();
    };

    const handleSubmit = (values) => {
        saveProgram(values);
    };

    return (
        <div className="p-6">
            <Card>
                <Tabs defaultActiveKey="1">
                    <TabPane
                        tab={
                            <span>
                                <BookOutlined /> Programs
                            </span>
                        }
                        key="1"
                    >
                        <div className="mb-4">
                            <Row gutter={16} className="mb-4">
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Total Programs"
                                            value={programs?.length || 0}
                                            prefix={<BookOutlined />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Active Students"
                                            value={progress?.length || 0}
                                            prefix={<UserOutlined />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Completion Rate"
                                            value={
                                                programs?.reduce((acc, curr) => acc + curr.completion_rate, 0) /
                                                (programs?.length || 1)
                                            }
                                            suffix="%"
                                            prefix={<CheckCircleOutlined />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card>
                                        <Statistic
                                            title="Average Duration"
                                            value={
                                                programs?.reduce((acc, curr) => acc + curr.duration, 0) /
                                                (programs?.length || 1)
                                            }
                                            suffix="weeks"
                                            prefix={<ClockCircleOutlined />}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                            <Space className="mb-4">
                                <Search
                                    placeholder="Search programs"
                                    style={{ width: 200 }}
                                    allowClear
                                />
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setIsModalVisible(true)}
                                >
                                    Add Program
                                </Button>
                            </Space>
                            <div style={{ height: 300 }} className="mb-4">
                                <Column {...performanceConfig} />
                            </div>
                        </div>
                        <Table
                            columns={programColumns}
                            dataSource={programs}
                            rowKey="id"
                            loading={isLoading}
                        />
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <FileTextOutlined /> Materials
                            </span>
                        }
                        key="2"
                    >
                        <div className="mb-4">
                            <Space>
                                <Search
                                    placeholder="Search materials"
                                    style={{ width: 200 }}
                                    allowClear
                                />
                                <Button
                                    type="primary"
                                    icon={<UploadOutlined />}
                                >
                                    Upload Material
                                </Button>
                            </Space>
                        </div>
                        <Table
                            columns={materialColumns}
                            dataSource={materials}
                            rowKey="id"
                        />
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <BarChartOutlined /> Assessments
                            </span>
                        }
                        key="3"
                    >
                        <div className="mb-4">
                            <Space>
                                <Search
                                    placeholder="Search assessments"
                                    style={{ width: 200 }}
                                    allowClear
                                />
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                >
                                    Create Assessment
                                </Button>
                            </Space>
                        </div>
                        <Table
                            columns={assessmentColumns}
                            dataSource={assessments}
                            rowKey="id"
                        />
                    </TabPane>
                </Tabs>
            </Card>

            {/* Program Details Drawer */}
            <Drawer
                title="Program Details"
                width={720}
                visible={isDrawerVisible}
                onClose={() => setIsDrawerVisible(false)}
            >
                {selectedProgram && (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">{selectedProgram.name}</h2>
                            <p className="text-gray-600">{selectedProgram.description}</p>
                        </div>

                        <Row gutter={16} className="mb-6">
                            <Col span={8}>
                                <Statistic
                                    title="Students Enrolled"
                                    value={selectedProgram.enrollment_count}
                                    prefix={<UserOutlined />}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Completion Rate"
                                    value={selectedProgram.completion_rate}
                                    suffix="%"
                                    prefix={<CheckCircleOutlined />}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Duration"
                                    value={selectedProgram.duration}
                                    suffix="weeks"
                                    prefix={<ClockCircleOutlined />}
                                />
                            </Col>
                        </Row>

                        <Card title="Course Materials" className="mb-6">
                            <List
                                itemLayout="horizontal"
                                dataSource={selectedProgram.materials || []}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar icon={item.type === 'video' ? <VideoCameraOutlined /> : <FileTextOutlined />} />}
                                            title={item.title}
                                            description={`${item.type} • ${moment(item.createdAt).format('MMM D, YYYY')}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>

                        <Card title="Progress Timeline">
                            <Timeline>
                                {(selectedProgram.milestones || []).map((milestone, index) => (
                                    <Timeline.Item
                                        key={index}
                                        color={milestone.completed ? 'green' : 'blue'}
                                        dot={milestone.completed ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                                    >
                                        <p className="font-bold">{milestone.title}</p>
                                        <p className="text-gray-600">{milestone.description}</p>
                                        <p className="text-sm text-gray-400">
                                            {moment(milestone.date).format('MMM D, YYYY')}
                                        </p>
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        </Card>
                    </>
                )}
            </Drawer>

            {/* Add/Edit Program Modal */}
            <Modal
                title={editingProgram ? 'Edit Program' : 'Add New Program'}
                visible={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Program Name"
                        rules={[{ required: true, message: 'Please input program name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please input description!' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="duration"
                        label="Duration (weeks)"
                        rules={[{ required: true, message: 'Please input duration!' }]}
                    >
                        <Input type="number" min={1} />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: 'Please select status!' }]}
                    >
                        <Select>
                            <Option value="active">Active</Option>
                            <Option value="draft">Draft</Option>
                            <Option value="archived">Archived</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="prerequisites"
                        label="Prerequisites"
                    >
                        <Select mode="multiple" placeholder="Select prerequisites">
                            {programs?.map(program => (
                                <Option key={program.id} value={program.id}>
                                    {program.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="materials"
                        label="Learning Materials"
                    >
                        <Upload
                            multiple
                            listType="text"
                            beforeUpload={() => false}
                        >
                            <Button icon={<UploadOutlined />}>Upload Materials</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingProgram ? 'Update' : 'Create'}
                            </Button>
                            <Button onClick={handleModalClose}>Cancel</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default LearningManagement; 