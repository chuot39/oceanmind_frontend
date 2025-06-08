import React, { useState } from 'react';
import { Card, Button, message, Breadcrumb } from 'antd';
import { BsPlus, BsHouseDoor } from 'react-icons/bs';
import { useGuides, useGuide } from './hook';
import { useCreateGuide, useUpdateGuide, useDeleteGuide } from './mutationHook';
import SearchBox from './components/SearchBox';
import GuideTable from './components/GuideTable';
import GuideForm from './components/GuideForm';
import GuideDetail from './components/GuideDetail';
import DeleteConfirmation from './components/DeleteConfirmation';
import './guide.scss';

const GuideManagement = () => {
    // States for filtering and pagination
    const [filters, setFilters] = useState({
        pagination: { current: 1, pageSize: 10 },
    });

    // States for modals
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedGuide, setSelectedGuide] = useState(null);

    // Query and mutations
    const { data, isLoading, refetch } = useGuides(filters);
    const { data: guideDetail, isLoading: detailLoading } = useGuide(
        selectedGuide?.documentId
    );
    const createGuide = useCreateGuide();
    const updateGuide = useUpdateGuide();
    const deleteGuide = useDeleteGuide();

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

    const handleCreateGuide = async (values) => {
        try {
            await createGuide.mutateAsync(values);
            setCreateModalVisible(false);
            message.success('Guide created successfully');
            refetch();
        } catch (error) {
            message.error('Failed to create guide');
            console.error(error);
        }
    };

    const handleUpdateGuide = async (values) => {
        try {
            await updateGuide.mutateAsync({
                id: selectedGuide.documentId,
                data: values,
            });
            setEditModalVisible(false);
            message.success('Guide updated successfully');
            refetch();
        } catch (error) {
            message.error('Failed to update guide');
            console.error(error);
        }
    };

    const handleDeleteGuide = async () => {
        try {
            await deleteGuide.mutateAsync(selectedGuide.documentId);
            setDeleteModalVisible(false);
            message.success('Guide deleted successfully');
            refetch();
        } catch (error) {
            message.error('Failed to delete guide');
            console.error(error);
        }
    };

    const handleView = (guide) => {
        setSelectedGuide(guide);
        setDetailModalVisible(true);
    };

    const handleEdit = (guide) => {
        setSelectedGuide(guide);
        setEditModalVisible(true);
    };

    const handleDelete = (guide) => {
        setSelectedGuide(guide);
        setDeleteModalVisible(true);
    };

    return (
        <div className="guide-management p-4">
            <div className="max-w-7xl mx-auto">
                <Breadcrumb className="mb-4">
                    <Breadcrumb.Item href="/admin/dashboard">
                        <BsHouseDoor /> Dashboard
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/admin/support">Support</Breadcrumb.Item>
                    <Breadcrumb.Item>Guide Management</Breadcrumb.Item>
                </Breadcrumb>

                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Guide Management</h1>
                    <Button
                        type="primary"
                        icon={<BsPlus />}
                        onClick={() => setCreateModalVisible(true)}
                    >
                        Add New Guide
                    </Button>
                </div>

                <SearchBox onSearch={handleSearch} initialValues={filters} />

                <Card className="shadow-sm">
                    <GuideTable
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

                {/* Create Guide Modal */}
                <GuideForm
                    visible={createModalVisible}
                    onCancel={() => setCreateModalVisible(false)}
                    onFinish={handleCreateGuide}
                    loading={createGuide.isLoading}
                    title="Create New Guide"
                />

                {/* Edit Guide Modal */}
                <GuideForm
                    visible={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    onFinish={handleUpdateGuide}
                    initialValues={selectedGuide}
                    loading={updateGuide.isLoading}
                    title="Edit Guide"
                />

                {/* Guide Detail Modal */}
                <GuideDetail
                    visible={detailModalVisible}
                    onClose={() => setDetailModalVisible(false)}
                    guide={guideDetail}
                    loading={detailLoading}
                />

                {/* Delete Confirmation Modal */}
                <DeleteConfirmation
                    visible={deleteModalVisible}
                    onCancel={() => setDeleteModalVisible(false)}
                    onConfirm={handleDeleteGuide}
                    loading={deleteGuide.isLoading}
                    item={selectedGuide}
                />
            </div>
        </div>
    );
};

export default GuideManagement;