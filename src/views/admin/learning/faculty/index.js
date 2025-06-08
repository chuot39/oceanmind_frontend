import React, { useState } from 'react';
import { Card, Input, Button, message, Empty, Select } from 'antd';
import { BsPlus, BsBuilding } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFaculties } from './hook';
import { useCreateFaculty, useUpdateFaculty, useDeleteFaculty } from './mutationHook';
import FacultyTable from './components/FacultyTable';
import FacultyForm from './components/FacultyForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import './faculty.scss';

const FacultyDashboard = () => {
    const intl = useIntl();

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);

    // State for delete confirmation
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [facultyToDelete, setFacultyToDelete] = useState(null);

    // Fetch faculties with filters
    const { data: facultiesData, isLoading: isLoadingFaculties } = useFaculties();

    // Mutation hooks
    const { mutate: createFaculty, isLoading: isCreating } = useCreateFaculty();
    const { mutate: updateFaculty, isLoading: isUpdating } = useUpdateFaculty();
    const { mutate: deleteFaculty, isLoading: isDeleting } = useDeleteFaculty();

    // Handle add new faculty
    const handleAddFaculty = () => {
        setEditingFaculty(null);
        setIsFormVisible(true);
    };

    // Handle edit faculty
    const handleEditFaculty = (faculty) => {
        setEditingFaculty(faculty);
        setIsFormVisible(true);
    };

    // Handle form close - ensure we clear editing faculty
    const handleFormClose = () => {
        setIsFormVisible(false);
        setEditingFaculty(null);
    };

    // Handle form submission
    const handleFormSubmit = (values) => {
        if (editingFaculty) {
            // Update existing faculty
            updateFaculty({
                documentId: editingFaculty.documentId,
                data: values
            }, {
                onSuccess: () => {
                    handleFormClose();
                },
                onError: (error) => {
                    console.log('error', error);
                }
            });
        } else {
            // Create new faculty
            createFaculty({ data: values }, {
                onSuccess: () => {
                    handleFormClose();
                },
                onError: (error) => {
                    console.log('error', error);
                }
            });
        }
    };

    // Handle delete faculty
    const handleDeleteClick = (faculty) => {
        setFacultyToDelete(faculty);
        setIsDeleteModalVisible(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        if (facultyToDelete) {
            deleteFaculty({ documentId: facultyToDelete.documentId }, {
                onSuccess: () => {
                    setIsDeleteModalVisible(false);
                    setFacultyToDelete(null);
                },
                onError: (error) => {
                    console.log('error', error);
                }
            });
        }
    };

    return (
        <div className="faculty-dashboard min-h-screen p-4">
            <div className="mx-auto">
                <div className="faculty-header">
                    <h1 className="text-3xl font-bold text_first">
                        <FormattedMessage id="admin.faculty.title" defaultMessage="Faculty Management" />
                    </h1>

                </div>

                <Card className="mb-6">
                    <div className="search-filter-container flex justify-end">

                        {/* <div className="flex items-center gap-2">

                            <Search
                                placeholder={intl.formatMessage({
                                    id: 'admin.faculty.search_placeholder',
                                    defaultMessage: "Search faculties..."
                                })}
                                allowClear
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onSearch={handleSearch}
                            />
                            <Select
                                value={sortBy}
                                onChange={handleSortChange}
                                style={{ width: 180 }}
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

                        </div> */}
                        <Button
                            type="primary"
                            icon={<BsPlus />}
                            onClick={handleAddFaculty}
                        >
                            <FormattedMessage id="common.add" defaultMessage="Add Faculty" />
                        </Button>
                    </div>

                    {facultiesData?.data?.length > 0 ? (
                        <FacultyTable
                            data={facultiesData.data}
                            loading={isLoadingFaculties}
                            pagination={{
                                pageSize: 10,
                                total: facultiesData.total || 0,
                                className: 'custom-pagination'
                            }}
                            onEdit={handleEditFaculty}
                            onDelete={handleDeleteClick}
                        />
                    ) : (
                        <div className="empty-state">
                            <BsBuilding className="empty-icon" />
                            <p className="empty-text">
                                <FormattedMessage
                                    id="faculty.empty"
                                    defaultMessage="No faculties found. Create your first faculty to get started."
                                />
                            </p>
                            <Button type="primary" icon={<BsPlus />} onClick={handleAddFaculty}>
                                <FormattedMessage id="common.add" defaultMessage="Add Faculty" />
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            {/* Faculty Form Modal */}
            <FacultyForm
                visible={isFormVisible}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                initialValues={editingFaculty}
                isLoading={isCreating || isUpdating}
                isEdit={!!editingFaculty}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmation
                visible={isDeleteModalVisible}
                onClose={() => setIsDeleteModalVisible(false)}
                onConfirm={handleDeleteConfirm}
                faculty={facultyToDelete}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default FacultyDashboard;