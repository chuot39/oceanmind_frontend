import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Tag, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const GenderTab = () => {
    const [genders, setGenders] = useState([
        { id: 1, name: 'Nam', code: 'male', color: 'blue' },
        { id: 2, name: 'Nữ', code: 'female', color: 'pink' },
        { id: 3, name: 'Khác', code: 'other', color: 'purple' }
    ]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentGender, setCurrentGender] = useState(null);
    const [form] = Form.useForm();

    const handleEdit = (gender) => {
        setCurrentGender(gender);
        form.setFieldsValue(gender);
        setIsModalVisible(true);
    };

    const handleAdd = () => {
        setCurrentGender(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleDelete = (genderId) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa giới tính này?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                const updatedGenders = genders.filter(gender => gender.id !== genderId);
                setGenders(updatedGenders);
                message.success('Xóa giới tính thành công');
            }
        });
    };

    const handleFormSubmit = (values) => {
        if (currentGender) {
            // Update existing gender
            const updatedGenders = genders.map(gender =>
                gender.id === currentGender.id
                    ? { ...gender, ...values }
                    : gender
            );
            setGenders(updatedGenders);
            message.success('Cập nhật giới tính thành công');
        } else {
            // Add new gender
            const newGender = {
                id: Math.max(...genders.map(g => g.id), 0) + 1,
                ...values
            };
            setGenders([...genders, newGender]);
            message.success('Thêm giới tính mới thành công');
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const columns = [
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mã',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Màu',
            dataIndex: 'color',
            key: 'color',
            render: (color, record) => (
                <Tag color={color}>{record.name}</Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Xóa
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <div>
            <div className="mb-4 flex justify-between">
                <h3 className="text-xl font-medium">Quản lý giới tính</h3>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm giới tính
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={genders}
                rowKey="id"
            />

            <Modal
                title={currentGender ? 'Chỉnh sửa giới tính' : 'Thêm giới tính mới'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Tên giới tính"
                        rules={[{ required: true, message: 'Vui lòng nhập tên giới tính!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="code"
                        label="Mã"
                        rules={[{ required: true, message: 'Vui lòng nhập mã giới tính!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="color"
                        label="Màu"
                        rules={[{ required: true, message: 'Vui lòng nhập màu!' }]}
                    >
                        <Input placeholder="blue, red, green, pink, purple, etc." />
                    </Form.Item>

                    <Form.Item className="text-right">
                        <Button style={{ marginRight: 8 }} onClick={() => setIsModalVisible(false)}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {currentGender ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default GenderTab; 