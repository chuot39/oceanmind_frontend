import React, { useState } from 'react';
import { Card, Button, message, Breadcrumb } from 'antd';
import { BsPlus, BsHouseDoor } from 'react-icons/bs';
import { useFaqs, useFaq } from './hook';
import { useCreateFaq, useUpdateFaq, useDeleteFaq } from './mutationHook';
import SearchBox from './components/SearchBox';
import FaqTable from './components/FaqTable';
import FaqForm from './components/FaqForm';
import FaqDetail from './components/FaqDetail';
import DeleteConfirmation from './components/DeleteConfirmation';
import './faq.scss';

const FaqManagement = () => {
    // States for filtering and pagination
    const [filters, setFilters] = useState({
        pagination: { current: 1, pageSize: 10 },
    });

    // States for modals
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);

    // Query and mutations
    const { data, isLoading, refetch } = useFaqs(filters);
    const { data: faqDetail, isLoading: detailLoading } = useFaq(
        selectedFaq?.documentId
    );
    const createFaq = useCreateFaq();
    const updateFaq = useUpdateFaq();
    const deleteFaq = useDeleteFaq();

    // Handlers
    const handleSearch = (searchFilters) => {
        setFilters({
            ...filters,
            ...searchFilters,
            pagination: { current: 1, pageSize: filters.pagination?.pageSize || 10 },
        });
    };

    const handleTableChange = (pagination, _, sorter) => {
        setFilters({
            ...filters,
            pagination,
            sorter: sorter.field
                ? { field: sorter.field, order: sorter.order }
                : undefined,
        });
    };

    const handleCreateFaq = async (values) => {
        try {
            await createFaq.mutateAsync(values);
            setCreateModalVisible(false);
            message.success('FAQ created successfully');
            refetch();
        } catch (error) {
            message.error('Failed to create FAQ');
            console.error(error);
        }
    };

    const handleUpdateFaq = async (values) => {
        try {
            await updateFaq.mutateAsync({
                id: selectedFaq.documentId,
                data: values,
            });
            setEditModalVisible(false);
            message.success('FAQ updated successfully');
            refetch();
        } catch (error) {
            message.error('Failed to update FAQ');
            console.error(error);
        }
    };

    const handleDeleteFaq = async () => {
        try {
            await deleteFaq.mutateAsync(selectedFaq.documentId);
            setDeleteModalVisible(false);
            message.success('FAQ deleted successfully');
            refetch();
        } catch (error) {
            message.error('Failed to delete FAQ');
            console.error(error);
        }
    };

    const handleView = (faq) => {
        setSelectedFaq(faq);
        setDetailModalVisible(true);
    };

    const handleEdit = (faq) => {
        setSelectedFaq(faq);
        setEditModalVisible(true);
    };

    const handleDelete = (faq) => {
        setSelectedFaq(faq);
        setDeleteModalVisible(true);
    };

    return (
        <div className="faq-management p-4">
            <div className="max-w-7xl mx-auto">
                <Breadcrumb className="mb-4">
                    <Breadcrumb.Item href="/admin/dashboard">
                        <BsHouseDoor /> Dashboard
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/support">Support</Breadcrumb.Item>
                    <Breadcrumb.Item>FAQ Management</Breadcrumb.Item>
                </Breadcrumb>

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">FAQ Management</h1>
                    <Button
                        type="primary"
                        icon={<BsPlus />}
                        onClick={() => setCreateModalVisible(true)}
                    >
                        Add New FAQ
                    </Button>
                </div>

                <SearchBox onSearch={handleSearch} initialValues={filters} />

                <Card className="shadow-sm">
                    <FaqTable
                        data={data?.data || []}
                        loading={isLoading}
                        pagination={{
                            ...filters.pagination,
                            total: data?.pagination?.total || 0,
                        }}
                        onChange={handleTableChange}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </Card>

                {/* Create FAQ Modal */}
                <FaqForm
                    visible={createModalVisible}
                    onCancel={() => setCreateModalVisible(false)}
                    onFinish={handleCreateFaq}
                    loading={createFaq.isLoading}
                    title="Create New FAQ"
                />

                {/* Edit FAQ Modal */}
                <FaqForm
                    visible={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    onFinish={handleUpdateFaq}
                    initialValues={selectedFaq}
                    loading={updateFaq.isLoading}
                    title="Edit FAQ"
                />

                {/* FAQ Detail Modal */}
                <FaqDetail
                    visible={detailModalVisible}
                    onClose={() => setDetailModalVisible(false)}
                    faq={faqDetail}
                    loading={detailLoading}
                />

                {/* Delete Confirmation Modal */}
                <DeleteConfirmation
                    visible={deleteModalVisible}
                    onCancel={() => setDeleteModalVisible(false)}
                    onConfirm={handleDeleteFaq}
                    loading={deleteFaq.isLoading}
                    item={selectedFaq}
                />
            </div>
        </div>
    );
};

export default FaqManagement;