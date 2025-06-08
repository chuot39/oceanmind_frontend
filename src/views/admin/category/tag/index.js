import React, { useState, useEffect } from 'react';
import { Button, Card, message, Spin } from 'antd';
import { BsPlus, BsFileEarmarkText } from 'react-icons/bs';
import TagTable from './components/TagTable';
import TagForm from './components/TagForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import TagDetail from './components/TagDetail';
import SearchBox from './components/SearchBox';
import { useTags } from './hook';
import { useCreateTag, useUpdateTag, useDeleteTag } from './mutationHook';
import './tag.scss';

const TagManagement = () => {
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
    const [selectedTag, setSelectedTag] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    // Query hook for fetching tags
    const { data, isLoading, isFetching } = useTags(filters);

    // Mutation hooks for CRUD operations
    const createTag = useCreateTag();
    const updateTag = useUpdateTag();
    const deleteTag = useDeleteTag();

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
    const handleAddTag = (values) => {
        createTag.mutate(values, {
            onSuccess: () => {
                message.success('Tag added successfully');
                setIsAddModalVisible(false);
            },
            onError: (error) => {
                message.error('Failed to add tag: ' + error.message);
            }
        });
    };

    const handleUpdateTag = (values) => {
        updateTag.mutate({
            id: selectedTag.documentId,
            data: values
        }, {
            onSuccess: () => {
                message.success('Tag updated successfully');
                setIsEditModalVisible(false);
                setSelectedTag(null);
            },
            onError: (error) => {
                message.error('Failed to update tag: ' + error.message);
            }
        });
    };

    const handleDeleteTag = () => {
        deleteTag.mutate(selectedTag.documentId, {
            onSuccess: () => {
                message.success('Tag deleted successfully');
                setIsDeleteModalVisible(false);
                setSelectedTag(null);
            },
            onError: (error) => {
                message.error('Failed to delete tag: ' + error.message);
            }
        });
    };

    const showEditModal = (tag) => {
        setSelectedTag(tag);
        setIsEditModalVisible(true);
    };

    const showDeleteModal = (tag) => {
        setSelectedTag(tag);
        setIsDeleteModalVisible(true);
    };

    const showDetailModal = (tag) => {
        setSelectedTag(tag);
        setIsDetailModalVisible(true);
    };

    // Clear search input if filters are cleared outside
    useEffect(() => {
        if (!filters.name) {
            setSearchInput('');
        }
    }, [filters.name]);

    return (
        <div className="tag-management min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                <div className="page-header">
                    <h1 className="text-3xl font-bold text-gray-900">Tag Management</h1>
                    <p className="text-gray-500 mt-2">Manage post tags in the system</p>
                </div>

                <Card>
                    <div className="page-toolbar">
                        <div className="left-actions">
                            <Button
                                type="primary"
                                icon={<BsPlus />}
                                onClick={() => setIsAddModalVisible(true)}
                            >
                                Add Tag
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
                        <div className="empty-tags">
                            <BsFileEarmarkText className="empty-icon" />
                            <h3>No tags found</h3>
                            <p className="empty-text">
                                {filters.name
                                    ? 'Try adjusting your search to find what you are looking for.'
                                    : 'Get started by adding a new tag.'}
                            </p>
                            <Button
                                type="primary"
                                icon={<BsPlus />}
                                onClick={() => setIsAddModalVisible(true)}
                            >
                                Add Tag
                            </Button>
                        </div>
                    ) : (
                        <TagTable
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

                {/* Add Tag Modal */}
                <TagForm
                    visible={isAddModalVisible}
                    onClose={() => setIsAddModalVisible(false)}
                    onSubmit={handleAddTag}
                    isLoading={createTag.isLoading}
                />

                {/* Edit Tag Modal */}
                {selectedTag && (
                    <TagForm
                        visible={isEditModalVisible}
                        onClose={() => {
                            setIsEditModalVisible(false);
                            setSelectedTag(null);
                        }}
                        initialValues={selectedTag}
                        onSubmit={handleUpdateTag}
                        isLoading={updateTag.isLoading}
                        isEdit
                    />
                )}

                {/* Delete Confirmation Modal */}
                {selectedTag && (
                    <DeleteConfirmation
                        visible={isDeleteModalVisible}
                        onClose={() => {
                            setIsDeleteModalVisible(false);
                            setSelectedTag(null);
                        }}
                        onConfirm={handleDeleteTag}
                        tag={selectedTag}
                        isLoading={deleteTag.isLoading}
                    />
                )}

                {/* Tag Detail Modal */}
                {selectedTag && (
                    <TagDetail
                        visible={isDetailModalVisible}
                        onClose={() => {
                            setIsDetailModalVisible(false);
                            setSelectedTag(null);
                        }}
                        tag={selectedTag}
                        onEdit={showEditModal}
                        onDelete={showDeleteModal}
                    />
                )}
            </div>
        </div>
    );
};

export default TagManagement;