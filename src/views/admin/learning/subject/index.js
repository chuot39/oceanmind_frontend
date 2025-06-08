import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Input, Button, message, Empty, Select } from 'antd';
import { BsPlus, BsBook } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSubjects } from './hook';
import { debounce } from 'lodash';
import { useCreateSubject, useUpdateSubject, useDeleteSubject, useAddSpecializedSubject, useRemoveSpecializedSubject, useAddPreviousSubject, useRemovePreviousSubject, useAddPrerequisiteSubject, useRemovePrerequisiteSubject } from './mutationHook';
import SubjectTable from './components/SubjectTable';
import SubjectForm from './components/SubjectForm';
import SubjectDetail from './components/SubjectDetail';
import DeleteConfirmation from './components/DeleteConfirmation';
import './subject.scss';

const { Search } = Input;
const { Option } = Select;

// Wrap the entire component in React.memo to prevent unnecessary renders
const SubjectDashboard = React.memo(() => {
    const intl = useIntl();

    // State for pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

    // State for filters
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState('name_asc');
    const [specializationFilter, setSpecializationFilter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState(null);

    // State for subject form
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // State for subject detail
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [viewingSubjectId, setViewingSubjectId] = useState(null);

    // State for delete confirmation
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState(null);

    // State for tracking removals in progress
    const [removingSpecialization, setRemovingSpecialization] = useState(null);
    const [removingPreviousSubject, setRemovingPreviousSubject] = useState(null);
    const [removingPrerequisiteSubject, setRemovingPrerequisiteSubject] = useState(null);

    // Create query parameters
    const queryParams = useMemo(() => ({
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText,
        sortBy,
        specialized_id: specializationFilter,
        category_id: categoryFilter,
    }), [pagination.current, pagination.pageSize, searchText, sortBy, specializationFilter, categoryFilter]);

    // Query subjects with pagination
    const { data: subjectsData, isLoading: isLoadingSubjects, refetch: refetchSubjects } = useSubjects(queryParams);

    // Extract data from the response
    const subjects = subjectsData?.data || [];
    const totalSubjects = subjectsData?.pagination?.total || 0;

    // Handle table pagination change
    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination);
    };

    // Handle specialization filter change
    const handleSpecializationFilterChange = useCallback((value) => {
        setSpecializationFilter(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    }, []);

    // Handle category filter change
    const handleCategoryFilterChange = useCallback((value) => {
        setCategoryFilter(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    }, []);

    // Handle search
    const handleSearch = useCallback((value) => {
        setSearchText(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    }, []);

    // Handle sort change
    const handleSortChange = useCallback((value) => {
        setSortBy(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    }, []);

    // Handle edit subject
    const handleEdit = (subject) => {
        setSelectedSubject(subject);
        setIsEditMode(true);
        setIsFormVisible(true);
    };

    // Handle view subject details
    const handleView = (subject) => {
        setViewingSubjectId(subject.documentId);
        setIsDetailVisible(true);
    };

    // Handle create new subject
    const handleCreate = () => {
        setSelectedSubject(null);
        setIsEditMode(false);
        setIsFormVisible(true);
    };

    // Handle form close
    const handleFormClose = () => {
        setIsFormVisible(false);
        setSelectedSubject(null);
    };

    // Handle detail close
    const handleDetailClose = () => {
        setIsDetailVisible(false);
        setViewingSubjectId(null);
    };

    // Handle delete subject
    const handleDeleteClick = (subject) => {
        setSubjectToDelete(subject);
        setIsDeleteModalVisible(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        if (subjectToDelete) {
            deleteSubject(subjectToDelete.documentId, {
                onSuccess: () => {
                    message.success(intl.formatMessage({
                        id: 'subject.delete.success',
                        defaultMessage: 'Subject deleted successfully'
                    }));
                    setIsDeleteModalVisible(false);
                    setSubjectToDelete(null);
                    refetchSubjects();

                    // Close detail view if the deleted subject was being viewed
                    if (viewingSubjectId === subjectToDelete.documentId) {
                        setIsDetailVisible(false);
                        setViewingSubjectId(null);
                    }
                },
                onError: (error) => {
                    message.error(error.message || intl.formatMessage({
                        id: 'subject.delete.error',
                        defaultMessage: 'Failed to delete subject'
                    }));
                }
            });
        }
    };

    // Handle form submission
    const handleFormSubmit = (data) => {
        if (isEditMode && selectedSubject) {
            // Update existing subject
            updateSubject({
                id: selectedSubject.documentId,
                data
            }, {
                onSuccess: () => {
                    message.success(intl.formatMessage({
                        id: 'subject.update.success',
                        defaultMessage: 'Subject updated successfully'
                    }));
                    setIsFormVisible(false);
                    setSelectedSubject(null);
                    refetchSubjects();
                },
                onError: (error) => {
                    message.error(error.message || intl.formatMessage({
                        id: 'subject.update.error',
                        defaultMessage: 'Failed to update subject'
                    }));
                }
            });
        } else {
            // Create new subject
            createSubject(data, {
                onSuccess: () => {
                    message.success(intl.formatMessage({
                        id: 'subject.create.success',
                        defaultMessage: 'Subject created successfully'
                    }));
                    setIsFormVisible(false);
                    refetchSubjects();
                },
                onError: (error) => {
                    message.error(error.message || intl.formatMessage({
                        id: 'subject.create.error',
                        defaultMessage: 'Failed to create subject'
                    }));
                }
            });
        }
    };

    // Handle add specialization
    const handleAddSpecialization = (data) => {
        addSpecializedSubject(data, {
            onSuccess: () => {
                message.success(intl.formatMessage({
                    id: 'subject.add_specialization.success',
                    defaultMessage: 'Subject added to specialization successfully'
                }));
                refetchSubjects();
            },
            onError: (error) => {
                message.error(error.message || intl.formatMessage({
                    id: 'subject.add_specialization.error',
                    defaultMessage: 'Failed to add subject to specialization'
                }));
            }
        });
    };

    // Handle remove specialization
    const handleRemoveSpecialization = (id) => {
        setRemovingSpecialization(id);
        removeSpecializedSubject(id, {
            onSuccess: () => {
                message.success(intl.formatMessage({
                    id: 'subject.remove_specialization.success',
                    defaultMessage: 'Subject removed from specialization successfully'
                }));
                setRemovingSpecialization(null);
                refetchSubjects();
            },
            onError: (error) => {
                message.error(error.message || intl.formatMessage({
                    id: 'subject.remove_specialization.error',
                    defaultMessage: 'Failed to remove subject from specialization'
                }));
                setRemovingSpecialization(null);
            }
        });
    };

    // Handle add previous subject
    const handleAddPreviousSubject = (data) => {
        addPreviousSubject(data, {
            onSuccess: () => {
                message.success(intl.formatMessage({
                    id: 'subject.add_previous.success',
                    defaultMessage: 'Previous subject added successfully'
                }));
                refetchSubjects();
            },
            onError: (error) => {
                message.error(error.message || intl.formatMessage({
                    id: 'subject.add_previous.error',
                    defaultMessage: 'Failed to add previous subject'
                }));
            }
        });
    };

    // Handle remove previous subject
    const handleRemovePreviousSubject = (id) => {
        setRemovingPreviousSubject(id);
        removePreviousSubject(id, {
            onSuccess: () => {
                message.success(intl.formatMessage({
                    id: 'subject.remove_previous.success',
                    defaultMessage: 'Previous subject removed successfully'
                }));
                setRemovingPreviousSubject(null);
                refetchSubjects();
            },
            onError: (error) => {
                message.error(error.message || intl.formatMessage({
                    id: 'subject.remove_previous.error',
                    defaultMessage: 'Failed to remove previous subject'
                }));
                setRemovingPreviousSubject(null);
            }
        });
    };

    // Handle add prerequisite subject
    const handleAddPrerequisiteSubject = (data) => {
        addPrerequisiteSubject(data, {
            onSuccess: () => {
                refetchSubjects();
            },
            onError: (error) => {
                console.log('error', error);
            }
        });
    };

    // Handle remove prerequisite subject
    const handleRemovePrerequisiteSubject = (id) => {
        setRemovingPrerequisiteSubject(id);
        removePrerequisiteSubject(id, {
            onSuccess: () => {

                setRemovingPrerequisiteSubject(null);
                refetchSubjects();
            },
            onError: (error) => {
                console.log('error', error);
                setRemovingPrerequisiteSubject(null);
            }
        });
    };

    // Mutation hooks
    const { mutate: createSubject, isLoading: isCreating } = useCreateSubject();
    const { mutate: updateSubject, isLoading: isUpdating } = useUpdateSubject();
    const { mutate: deleteSubject, isLoading: isDeleting } = useDeleteSubject();

    // Relationship mutation hooks
    const { mutate: addSpecializedSubject } = useAddSpecializedSubject();
    const { mutate: removeSpecializedSubject } = useRemoveSpecializedSubject();
    const { mutate: addPreviousSubject } = useAddPreviousSubject();
    const { mutate: removePreviousSubject } = useRemovePreviousSubject();
    const { mutate: addPrerequisiteSubject } = useAddPrerequisiteSubject();
    const { mutate: removePrerequisiteSubject } = useRemovePrerequisiteSubject();

    return (
        <div className="subject-dashboard min-h-screen p-4">
            <div className=" mx-auto">
                <div className="subject-header">
                    <h1 className="text-3xl font-bold text_first">
                        <FormattedMessage id="admin.subject.dashboard_title" defaultMessage="Subject Management" />
                    </h1>

                </div>

                <Card className="mb-6">
                    <div className="search-filter-container flex justify-between">
                        <div className='flex justify-between w-1/2'>

                            <Search
                                placeholder={intl.formatMessage({
                                    id: 'admin.subject.search_placeholder',
                                    defaultMessage: "Search subjects..."
                                })}
                                allowClear
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onSearch={handleSearch}
                            />

                            <div className="ms-4 min-w-48">
                                <Select
                                    value={sortBy}
                                    onChange={handleSortChange}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="code_asc">
                                        <FormattedMessage id="sort.code_asc" defaultMessage="Code (A-Z)" />
                                    </Option>
                                    <Option value="code_desc">
                                        <FormattedMessage id="sort.code_desc" defaultMessage="Code (Z-A)" />
                                    </Option>
                                    <Option value="name_asc">
                                        <FormattedMessage id="sort.name_asc" defaultMessage="Name (A-Z)" />
                                    </Option>
                                    <Option value="name_desc">
                                        <FormattedMessage id="sort.name_desc" defaultMessage="Name (Z-A)" />
                                    </Option>
                                    <Option value="credits_asc">
                                        <FormattedMessage id="sort.credits_asc" defaultMessage="Credits (Low to High)" />
                                    </Option>
                                    <Option value="credits_desc">
                                        <FormattedMessage id="sort.credits_desc" defaultMessage="Credits (High to Low)" />
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

                        <div className='flex justify-end float-end'>
                            <Button
                                type="primary"
                                icon={<BsPlus />}
                                onClick={handleCreate}
                            >
                                <FormattedMessage id="admin.subject.add_title" defaultMessage="Add Subject" />
                            </Button>
                        </div>
                    </div>

                    {/* Subjects Table */}
                    {subjects?.length > 0 ? (
                        <SubjectTable
                            data={subjects}
                            loading={isLoadingSubjects}
                            pagination={{
                                ...pagination,
                                total: totalSubjects,
                                showSizeChanger: true,
                                pageSizeOptions: [5, 10, 20, 50, 100],
                                className: 'custom-pagination',
                            }}
                            onChange={handleTableChange}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    ) : (
                        <div className="empty-state">
                            <BsBook className="empty-icon" />
                            <p className="empty-text">
                                <FormattedMessage
                                    id="admin.subject.empty"
                                    defaultMessage="No subjects found. Create your first subject to get started."
                                />
                            </p>
                            <Button type="primary" icon={<BsPlus />} onClick={handleCreate}>
                                <FormattedMessage id="admin.subject.add_title" defaultMessage="Add Subject" />
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            {/* Subject Form Modal */}
            <SubjectForm
                visible={isFormVisible}
                onClose={handleFormClose}
                initialValues={selectedSubject}
                isLoading={isCreating || isUpdating}
                isEdit={isEditMode}
                onSubmit={handleFormSubmit}
            />

            {/* Subject Detail Modal */}
            <SubjectDetail
                visible={isDetailVisible}
                onClose={handleDetailClose}
                subjectId={viewingSubjectId}
                onEdit={handleEdit}
                onAddSpecialization={handleAddSpecialization}
                onRemoveSpecialization={handleRemoveSpecialization}
                onAddPreviousSubject={handleAddPreviousSubject}
                onRemovePreviousSubject={handleRemovePreviousSubject}
                onAddPrerequisiteSubject={handleAddPrerequisiteSubject}
                onRemovePrerequisiteSubject={handleRemovePrerequisiteSubject}
                isRemovingSpecialization={removingSpecialization}
                isRemovingPreviousSubject={removingPreviousSubject}
                isRemovingPrerequisiteSubject={removingPrerequisiteSubject}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmation
                visible={isDeleteModalVisible}
                onClose={() => setIsDeleteModalVisible(false)}
                onConfirm={handleDeleteConfirm}
                subject={subjectToDelete}
                isLoading={isDeleting}
            />
        </div>
    );
});

// Export a wrapper component to isolate any potential parent re-renders
export default function SubjectDashboardWrapper() {
    return <SubjectDashboard />;
}