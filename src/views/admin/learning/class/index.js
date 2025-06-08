import React, { useState, useEffect, useCallback } from 'react';
import { Card, Input, Button, message, Empty, Select } from 'antd';
import { BsPlus, BsPersonLinesFill } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useClasses } from './hook';
import { debounce } from 'lodash';
import { useCreateClass, useUpdateClass, useDeleteClass } from './mutationHook';
import ClassTable from './components/ClassTable';
import ClassForm from './components/ClassForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import SpecializationFilter from './components/SpecializationFilter';
import BatchFilter from './components/BatchFilter';
import './class.scss';

const { Search } = Input;
const { Option } = Select;

const ClassDashboard = () => {
    const intl = useIntl();

    // State for pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    // State for search and filters
    const [searchText, setSearchText] = useState('');
    const [debouncedSearchText, setDebouncedSearchText] = useState('');
    const [sortBy, setSortBy] = useState('name_asc');
    const [specializationFilter, setSpecializationFilter] = useState(null);
    const [batchFilter, setBatchFilter] = useState(null);

    // State for class form
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingClass, setEditingClass] = useState(null);

    // State for delete confirmation
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [classToDelete, setClassToDelete] = useState(null);

    // Debounce search function
    const debouncedSearch = useCallback(
        debounce((value) => {
            setDebouncedSearchText(value);
            setPagination({ ...pagination, current: 1 });
        }, 500),
        [pagination]
    );

    // Update debounced value when searchText changes
    useEffect(() => {
        debouncedSearch(searchText);
    }, [searchText, debouncedSearch]);

    // Fetch classes with filters
    const { data: classesData, isLoading: isLoadingClasses } = useClasses({
        search: debouncedSearchText,
        sortBy,
        specialized_id: specializationFilter,
        batche_id: batchFilter
    });

    // Mutation hooks
    const { mutate: createClass, isLoading: isCreating } = useCreateClass();
    const { mutate: updateClass, isLoading: isUpdating } = useUpdateClass();
    const { mutate: deleteClass, isLoading: isDeleting } = useDeleteClass();

    // Handle table pagination and sorting change
    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);

        if (sorter.field && sorter.order) {
            let newSortBy;
            if (sorter.field === 'name') {
                newSortBy = sorter.order === 'ascend' ? 'name_asc' : 'name_desc';
            } else if (sorter.field === 'createdAt') {
                newSortBy = sorter.order === 'ascend' ? 'oldest' : 'newest';
            }

            if (newSortBy) {
                setSortBy(newSortBy);
            }
        }
    };

    // Handle search
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // Handle sort change
    const handleSortChange = (value) => {
        setSortBy(value);
    };

    // Handle specialization filter change
    const handleSpecializationFilterChange = (value) => {
        setSpecializationFilter(value);
        setPagination({ ...pagination, current: 1 });
    };

    // Handle batch filter change
    const handleBatchFilterChange = (value) => {
        setBatchFilter(value);
        setPagination({ ...pagination, current: 1 });
    };

    // Handle add new class
    const handleAddClass = () => {
        setEditingClass(null);
        setIsFormVisible(true);
    };

    // Handle edit class
    const handleEditClass = (classItem) => {
        setEditingClass(classItem);
        setIsFormVisible(true);
    };

    // Handle form submission
    const handleFormSubmit = (values) => {
        if (editingClass) {
            // Update existing class
            updateClass({
                documentId: editingClass.documentId,
                data: values
            }, {
                onSuccess: () => {
                    setIsFormVisible(false);
                    setEditingClass(null);
                },
                onError: (error) => {
                    console.error("Error when update class: ", error)
                }
            });
        } else {
            // Create new class
            createClass({ data: values }, {
                onSuccess: () => {
                    setIsFormVisible(false);
                },
                onError: (error) => {
                    console.error("Error when create class: ", error)
                }
            });
        }
    };

    // Handle delete class
    const handleDeleteClick = (classItem) => {
        setClassToDelete(classItem);
        setIsDeleteModalVisible(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        if (classToDelete) {
            deleteClass({ documentId: classToDelete.documentId }, {
                onSuccess: () => {
                    setIsDeleteModalVisible(false);
                    setClassToDelete(null);
                },
                onError: (error) => {
                    console.error("Error when delete class: ", error)

                }
            });
        }
    };

    return (
        <div className="class-dashboard min-h-screen p-4">
            <div className="mx-auto">
                <div className="class-header">
                    <h1 className="text-3xl font-bold text_first">
                        <FormattedMessage id="admin.class.dashboard_title" defaultMessage="Class Management" />
                    </h1>

                </div>

                <Card className="mb-6">
                    <div className="search-filter-container ">
                        <Search
                            placeholder={intl.formatMessage({
                                id: 'admin.class.search_placeholder',
                                defaultMessage: "Search classes..."
                            })}
                            allowClear
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onSearch={handleSearch}
                        />
                        <div className="filter-section">
                            <div className="filter-item">
                                <SpecializationFilter
                                    value={specializationFilter}
                                    onChange={handleSpecializationFilterChange}
                                />
                            </div>
                            <div className="filter-item">
                                <BatchFilter
                                    value={batchFilter}
                                    onChange={handleBatchFilterChange}
                                />
                            </div>
                            <div className="filter-item">
                                <Select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="name_asc">
                                        <FormattedMessage id="sort.name_asc" defaultMessage="Name (A-Z)" />
                                    </Option>
                                    <Option value="name_desc">
                                        <FormattedMessage id="sort.name_desc" defaultMessage="Name (Z-A)" />
                                    </Option>
                                    <Option value="newest">
                                        <FormattedMessage id="sort.newest" defaultMessage="Newest First" />
                                    </Option>
                                    <Option value="oldest">
                                        <FormattedMessage id="sort.oldest" defaultMessage="Oldest First" />
                                    </Option>
                                </Select>
                            </div>
                        </div>

                        <Button
                            type="primary"
                            className='ms-auto'
                            icon={<BsPlus />}
                            onClick={handleAddClass}
                        >
                            <FormattedMessage id="admin.class.add_title" defaultMessage="Add Class" />
                        </Button>

                    </div>

                    {classesData?.data?.length > 0 ? (
                        <ClassTable
                            data={classesData.data}
                            loading={isLoadingClasses}
                            pagination={{
                                ...pagination,
                                total: classesData.total || 0,
                                className: 'custom-pagination'
                            }}
                            onChange={handleTableChange}
                            onEdit={handleEditClass}
                            onDelete={handleDeleteClick}
                        />
                    ) : (
                        <div className="empty-state">
                            <BsPersonLinesFill className="empty-icon" />
                            <p className="empty-text">
                                <FormattedMessage
                                    id="class.empty"
                                    defaultMessage="No classes found. Create your first class to get started."
                                />
                            </p>
                            <Button type="primary" icon={<BsPlus />} onClick={handleAddClass}>
                                <FormattedMessage id="class.action.add" defaultMessage="Add Class" />
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            {/* Class Form Modal */}
            <ClassForm
                visible={isFormVisible}
                onClose={() => setIsFormVisible(false)}
                onSubmit={handleFormSubmit}
                initialValues={editingClass}
                isLoading={isCreating || isUpdating}
                isEdit={!!editingClass}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmation
                visible={isDeleteModalVisible}
                onClose={() => setIsDeleteModalVisible(false)}
                onConfirm={handleDeleteConfirm}
                classItem={classToDelete}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default ClassDashboard;