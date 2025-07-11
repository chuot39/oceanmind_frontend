import React, { useState, useEffect } from 'react';
import { Button, Card, message, Spin } from 'antd';
import { BsPlus, BsFileEarmarkText } from 'react-icons/bs';
import SubjectCategoryTable from './components/SubjectCategoryTable';
import SubjectCategoryForm from './components/SubjectCategoryForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import CategoryDetail from './components/CategoryDetail';
import SearchBox from './components/SearchBox';
import { useSubjectCategories } from './hook';
import { useCreateSubjectCategory, useUpdateSubjectCategory, useDeleteSubjectCategory } from './mutationHook';
import './subject-category.scss';

const SubjectCategoryManagement = () => {
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
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    // Query hook for fetching categories
    const { data, isLoading, isFetching } = useSubjectCategories(filters);

    // Mutation hooks for CRUD operations
    const createCategory = useCreateSubjectCategory();
    const updateCategory = useUpdateSubjectCategory();
    const deleteCategory = useDeleteSubjectCategory();

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
    const handleAddCategory = (values) => {
        createCategory.mutate(values, {
            onSuccess: () => {
                message.success('Subject category added successfully');
                setIsAddModalVisible(false);
            },
            onError: (error) => {
                message.error('Failed to add subject category: ' + error.message);
            }
        });
    };

    const handleUpdateCategory = (values) => {
        updateCategory.mutate({
            id: selectedCategory.documentId,
            data: values
        }, {
            onSuccess: () => {
                message.success('Subject category updated successfully');
                setIsEditModalVisible(false);
                setSelectedCategory(null);
            },
            onError: (error) => {
                message.error('Failed to update subject category: ' + error.message);
            }
        });
    };

    const handleDeleteCategory = () => {
        deleteCategory.mutate(selectedCategory.documentId, {
            onSuccess: () => {
                message.success('Subject category deleted successfully');
                setIsDeleteModalVisible(false);
                setSelectedCategory(null);
            },
            onError: (error) => {
                message.error('Failed to delete subject category: ' + error.message);
            }
        });
    };

    const showEditModal = (category) => {
        setSelectedCategory(category);
        setIsEditModalVisible(true);
    };

    const showDeleteModal = (category) => {
        setSelectedCategory(category);
        setIsDeleteModalVisible(true);
    };

    const showDetailModal = (category) => {
        setSelectedCategory(category);
        setIsDetailModalVisible(true);
    };

    // Clear search input if filters are cleared outside
    useEffect(() => {
        if (!filters.name) {
            setSearchInput('');
        }
    }, [filters.name]);

    return (
        <div className="subject-category-management min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                <div className="page-header">
                    <h1 className="text-3xl font-bold text-gray-900">Subject Category Management</h1>
                    <p className="text-gray-500 mt-2">Manage subject categories in the system</p>
                </div>

                <Card>
                    <div className="page-toolbar">
                        <div className="left-actions">
                            <Button
                                type="primary"
                                icon={<BsPlus />}
                                onClick={() => setIsAddModalVisible(true)}
                            >
                                Add Category
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
                            <h3>No subject categories found</h3>
                            <p className="empty-text">
                                {filters.name
                                    ? 'Try adjusting your search to find what you are looking for.'
                                    : 'Get started by adding a new subject category.'}
                            </p>
                            <Button
                                type="primary"
                                icon={<BsPlus />}
                                onClick={() => setIsAddModalVisible(true)}
                            >
                                Add Category
                            </Button>
                        </div>
                    ) : (
                        <SubjectCategoryTable
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

                {/* Add Category Modal */}
                <SubjectCategoryForm
                    visible={isAddModalVisible}
                    onClose={() => setIsAddModalVisible(false)}
                    onSubmit={handleAddCategory}
                    isLoading={createCategory.isLoading}
                />

                {/* Edit Category Modal */}
                {selectedCategory && (
                    <SubjectCategoryForm
                        visible={isEditModalVisible}
                        onClose={() => {
                            setIsEditModalVisible(false);
                            setSelectedCategory(null);
                        }}
                        initialValues={selectedCategory}
                        onSubmit={handleUpdateCategory}
                        isLoading={updateCategory.isLoading}
                        isEdit
                    />
                )}

                {/* Delete Confirmation Modal */}
                {selectedCategory && (
                    <DeleteConfirmation
                        visible={isDeleteModalVisible}
                        onClose={() => {
                            setIsDeleteModalVisible(false);
                            setSelectedCategory(null);
                        }}
                        onConfirm={handleDeleteCategory}
                        category={selectedCategory}
                        isLoading={deleteCategory.isLoading}
                    />
                )}

                {/* Category Detail Modal */}
                {selectedCategory && (
                    <CategoryDetail
                        visible={isDetailModalVisible}
                        onClose={() => {
                            setIsDetailModalVisible(false);
                            setSelectedCategory(null);
                        }}
                        category={selectedCategory}
                        onEdit={showEditModal}
                        onDelete={showDeleteModal}
                    />
                )}
            </div>
        </div>
    );
};

export default SubjectCategoryManagement;