import React from 'react';
import { Modal, Form, Input, Select, Space, Button } from 'antd';

const { Option } = Select;

const UserForm = ({
    visible,
    onCancel,
    onFinish,
    roles,
    editingUser,
    loading
}) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (visible) {
            if (editingUser) {
                form.setFieldsValue(editingUser);
            } else {
                form.resetFields();
            }
        }
    }, [visible, editingUser, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onFinish(values);
        } catch (error) {
            console.error('Form validation failed:', error);
        }
    };

    return (
        <Modal
            title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            visible={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="username"
                    label="Tên đăng nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="fullname"
                    label="Họ tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                {!editingUser && (
                    <Form.Item
                        name="password"
                        label="Mật khẩu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu!' },
                            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                )}

                <Form.Item
                    name="role"
                    label="Vai trò"
                    rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                >
                    <Select>
                        {roles?.map(role => (
                            <Option key={role.id} value={role.name.toLowerCase()}>
                                {role.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Trạng thái"
                    rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                    <Select>
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Không hoạt động</Option>
                        <Option value="blocked">Đã khóa</Option>
                    </Select>
                </Form.Item>

                <Form.Item className="text-right">
                    <Space>
                        <Button onClick={onCancel}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {editingUser ? 'Cập nhật' : 'Tạo mới'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserForm; 