import React, { useState } from 'react';
import { List, Button, Tag, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const RolesTab = ({ roles, setRoles }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);
    const [form] = Form.useForm();

    const availablePermissions = [
        { id: 'read', name: 'Đọc' },
        { id: 'write', name: 'Viết' },
        { id: 'delete', name: 'Xóa' },
        { id: 'manage_users', name: 'Quản lý người dùng' },
        { id: 'manage_roles', name: 'Quản lý vai trò' },
        { id: 'manage_content', name: 'Quản lý nội dung' },
        { id: 'write_own', name: 'Viết nội dung riêng' },
    ];

    const handleEdit = (role) => {
        setCurrentRole(role);
        form.setFieldsValue({
            name: role.name,
            description: role.description,
            permissions: role.permissions
        });
        setIsModalVisible(true);
    };

    const handleAdd = () => {
        setCurrentRole(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleDelete = (roleId) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa vai trò này?',
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => {
                const updatedRoles = roles.filter(role => role.id !== roleId);
                setRoles(updatedRoles);
                message.success('Xóa vai trò thành công');
            }
        });
    };

    const handleFormSubmit = (values) => {
        if (currentRole) {
            // Update existing role
            const updatedRoles = roles.map(role =>
                role.id === currentRole.id
                    ? { ...role, ...values }
                    : role
            );
            setRoles(updatedRoles);
            message.success('Cập nhật vai trò thành công');
        } else {
            // Add new role
            const newRole = {
                id: Math.max(...roles.map(r => r.id), 0) + 1,
                ...values
            };
            setRoles([...roles, newRole]);
            message.success('Thêm vai trò mới thành công');
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <div>
            <div className="mb-4 flex justify-between">
                <h3 className="text-xl font-medium">Quản lý vai trò</h3>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAdd}
                >
                    Thêm vai trò
                </Button>
            </div>

            <List
                itemLayout="horizontal"
                dataSource={roles}
                renderItem={role => (
                    <List.Item
                        actions={[
                            <Button
                                key="edit"
                                icon={<EditOutlined />}
                                onClick={() => handleEdit(role)}
                            >
                                Sửa
                            </Button>,
                            <Button
                                key="delete"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(role.id)}
                            >
                                Xóa
                            </Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={role.name}
                            description={
                                <div>
                                    <p>{role.description}</p>
                                    <div className="mt-2">
                                        {role.permissions?.map(permission => (
                                            <Tag key={permission}>{permission}</Tag>
                                        ))}
                                    </div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />

            <Modal
                title={currentRole ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
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
                        label="Tên vai trò"
                        rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="permissions"
                        label="Quyền"
                        rules={[{ required: true, message: 'Vui lòng chọn ít nhất một quyền!' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Chọn quyền"
                            style={{ width: '100%' }}
                        >
                            {availablePermissions.map(permission => (
                                <Option key={permission.id} value={permission.id}>
                                    {permission.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item className="text-right">
                        <Button style={{ marginRight: 8 }} onClick={() => setIsModalVisible(false)}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {currentRole ? 'Cập nhật' : 'Thêm mới'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RolesTab; 