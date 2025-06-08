import React from 'react';
import { Input, Select, Button, Row, Col, Form } from 'antd';
import { BsSearch, BsXCircle } from 'react-icons/bs';
import { useAllCategories } from '../hook';

const { Option } = Select;

const SearchBox = ({ onSearch, initialValues = {} }) => {
    const [form] = Form.useForm();
    const { data: categories, isLoading } = useAllCategories();

    const handleReset = () => {
        form.resetFields();
        onSearch({});
    };

    const handleFinish = (values) => {
        onSearch(values);
    };

    return (
        <div className="search-box bg-white p-4 rounded-lg mb-4 shadow-sm">
            <Form
                form={form}
                initialValues={initialValues}
                onFinish={handleFinish}
                layout="vertical"
            >
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={8} lg={10}>
                        <Form.Item name="search" label="Search">
                            <Input
                                placeholder="Search FAQs..."
                                prefix={<BsSearch className="text-gray-400" />}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <Form.Item name="categoryId" label="Category">
                            <Select
                                placeholder="Select a category"
                                allowClear
                                loading={isLoading}
                            >
                                {categories?.map((category) => (
                                    <Option key={category.documentId} value={category.documentId}>
                                        {category.name_vi}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={6} className="flex items-end">
                        <Form.Item className="w-full">
                            <div className="flex gap-2">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="flex items-center"
                                >
                                    <BsSearch className="mr-1" /> Search
                                </Button>
                                <Button
                                    onClick={handleReset}
                                    className="flex items-center"
                                >
                                    <BsXCircle className="mr-1" /> Reset
                                </Button>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default SearchBox; 