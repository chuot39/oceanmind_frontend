import React, { useState, useEffect } from 'react';
import { Button, Card, message, Spin } from 'antd';
import { BsPlus, BsFileEarmarkText } from 'react-icons/bs';
import NoticeTypeTable from './components/NoticeTypeTable';
import NoticeTypeForm from './components/NoticeTypeForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import CategoryDetail from './components/CategoryDetail';
import SearchBox from './components/SearchBox';
import { useNoticeTypes } from './hook';
import { useCreateNoticeType, useUpdateNoticeType, useDeleteNoticeType } from './mutationHook';
import './notice-type.scss';

const NoticeTypeManagement = () => {
    // State for filters and pagination
    const [filters, setFilters] = useState({
        name: '',
        pagination: {
            current: 1,
            pageSize: 10
        }
    });

    // State for modals
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [selectedNoticeType, setSelectedNoticeType] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    // Query hook for fetching notice types
    const { data, isLoading, isFetching } = useNoticeTypes(filters);

    // Mutation hooks for CRUD operations
    const createNoticeType = useCreateNoticeType();
    const updateNoticeType = useUpdateNoticeType();
    const deleteNoticeType = useDeleteNoticeType();

    // Update filters when search input changes
    const handleSearch = () => {
        setFilters(prev => ({
            ...prev,
            name: searchInput,
            pagination: {
                ...prev.pagination,
                current: 1 // Reset to first page on new search
            }
        }));
    };

    // Handle table pagination and sorting
    const handleTableChange = (pagination, _, sorter) => {
        setFilters(prev => ({
            ...prev,
            pagination: {
                current: pagination.current,
                pageSize: pagination.pageSize
            },
            sorter: sorter.field && sorter.order ? {
                field: sorter.field,
                order: sorter.order
            } : undefined
        }));
    };

    // CRUD operations
    const handleAddNoticeType = (values) => {
        createNoticeType.mutate(values, {
            onSuccess: () => {
                message.success('Notice type added successfully');
                setIsAddModalVisible(false);
            },
            onError: (error) => {
                message.error('Failed to add notice type: ' + error.message);
            }
        });
    };

    const handleUpdateNoticeType = (values) => {
        updateNoticeType.mutate({
            id: selectedNoticeType.documentId,
            data: values
        }, {
            onSuccess: () => {
                message.success('Notice type updated successfully');
                setIsEditModalVisible(false);
                setSelectedNoticeType(null);
            },
            onError: (error) => {
                message.error('Failed to update notice type: ' + error.message);
            }
        });
    };

    const handleDeleteNoticeType = () => {
        deleteNoticeType.mutate(selectedNoticeType.documentId, {
            onSuccess: () => {
                message.success('Notice type deleted successfully');
                setIsDeleteModalVisible(false);
                setSelectedNoticeType(null);
            },
            onError: (error) => {
                message.error('Failed to delete notice type: ' + error.message);
            }
        });
    };

    const showEditModal = (noticeType) => {
        setSelectedNoticeType(noticeType);
        setIsEditModalVisible(true);
    };

    const showDeleteModal = (noticeType) => {
        setSelectedNoticeType(noticeType);
        setIsDeleteModalVisible(true);
    };

    const showDetailModal = (noticeType) => {
        setSelectedNoticeType(noticeType);
        setIsDetailModalVisible(true);
    };

    // Clear search input if filters are cleared outside
    useEffect(() => {
        if (!filters.name) {
            setSearchInput('');
        }
    }, [filters.name]);

    return (
        <div className="notice-type-management min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                <div className="page-header">
                    <h1 className="text-3xl font-bold text-gray-900">Notice Type Management</h1>
                    <p className="text-gray-500 mt-2">Manage notification types in the system</p>
                </div>

                <Card>
                    <div className="page-toolbar">
                        <div className="left-actions">
                            <Button
                                type="primary"
                                icon={<BsPlus />}
                                onClick={() => setIsAddModalVisible(true)}
                            >
                                Add Notice Type
                            </Button>
                        </div>
                        <div className="right-actions">
                            <SearchBox
                                value={searchInput}
                                onChange={setSearchInput}
                                onSearch={handleSearch}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">
                            <Spin size="large" />
                        </div>
                    ) : data?.data?.length === 0 ? (
                        <div className="empty-categories">
                            <BsFileEarmarkText className="empty-icon" />
                            <h3>No notice types found</h3>
                            <p className="empty-text">
                                {filters.name
                                    ? 'Try adjusting your search to find what you are looking for.'
                                    : 'Get started by adding a new notice type.'}
                            </p>
                            <Button
                                type="primary"
                                icon={<BsPlus />}
                                onClick={() => setIsAddModalVisible(true)}
                            >
                                Add Notice Type
                            </Button>
                        </div>
                    ) : (
                        <NoticeTypeTable
                            data={data?.data || []}
                            loading={isFetching}
                            pagination={{
                                ...data?.pagination,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} items`
                            }}
                            onChange={handleTableChange}
                            onView={showDetailModal}
                            onEdit={showEditModal}
                            onDelete={showDeleteModal}
                        />
                    )}
                </Card>

                {/* Add Notice Type Modal */}
                <NoticeTypeForm
                    visible={isAddModalVisible}
                    onClose={() => setIsAddModalVisible(false)}
                    onSubmit={handleAddNoticeType}
                    isLoading={createNoticeType.isLoading}
                />

                {/* Edit Notice Type Modal */}
                {selectedNoticeType && (
                    <NoticeTypeForm
                        visible={isEditModalVisible}
                        onClose={() => {
                            setIsEditModalVisible(false);
                            setSelectedNoticeType(null);
                        }}
                        initialValues={selectedNoticeType}
                        onSubmit={handleUpdateNoticeType}
                        isLoading={updateNoticeType.isLoading}
                        isEdit
                    />
                )}

                {/* Delete Confirmation Modal */}
                {selectedNoticeType && (
                    <DeleteConfirmation
                        visible={isDeleteModalVisible}
                        onClose={() => {
                            setIsDeleteModalVisible(false);
                            setSelectedNoticeType(null);
                        }}
                        onConfirm={handleDeleteNoticeType}
                        noticeType={selectedNoticeType}
                        isLoading={deleteNoticeType.isLoading}
                    />
                )}

                {/* Notice Type Detail Modal */}
                {selectedNoticeType && (
                    <CategoryDetail
                        visible={isDetailModalVisible}
                        onClose={() => {
                            setIsDetailModalVisible(false);
                            setSelectedNoticeType(null);
                        }}
                        category={selectedNoticeType}
                        onEdit={showEditModal}
                        onDelete={showDeleteModal}
                    />
                )}
            </div>
        </div>
    );
};

export default NoticeTypeManagement;