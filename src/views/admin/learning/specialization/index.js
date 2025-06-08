import React, { useState } from 'react';
import { Card, Input, Button, Empty, Select } from 'antd';
import { BsPlus, BsBookHalf } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSpecializations } from './hook';
import { useCreateSpecialization, useUpdateSpecialization, useDeleteSpecialization } from './mutationHook';
import SpecializationTable from './components/SpecializationTable';
import SpecializationForm from './components/SpecializationForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import './specialization.scss';

const SpecializationDashboard = () => {
    const intl = useIntl();

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingSpecialization, setEditingSpecialization] = useState(null);

    // State for delete confirmation
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [specializationToDelete, setSpecializationToDelete] = useState(null);

    // Fetch specializations with filters
    const { data: specializationsData, isLoading: isLoadingSpecializations } = useSpecializations();

    // Mutation hooks
    const { mutate: createSpecialization, isLoading: isCreating } = useCreateSpecialization();
    const { mutate: updateSpecialization, isLoading: isUpdating } = useUpdateSpecialization();
    const { mutate: deleteSpecialization, isLoading: isDeleting } = useDeleteSpecialization();

    // Handle add new specialization
    const handleAddSpecialization = () => {
        setEditingSpecialization(null);
        setIsFormVisible(true);
    };

    // Handle edit specialization
    const handleEditSpecialization = (specialization) => {
        setEditingSpecialization(specialization);
        setIsFormVisible(true);
    };

    // Handle form close - ensure we clear editing specialization
    const handleFormClose = () => {
        setIsFormVisible(false);
        setEditingSpecialization(null);
    };

    // Handle form submission
    const handleFormSubmit = (values) => {
        if (editingSpecialization) {
            // Update existing specialization
            updateSpecialization({
                documentId: editingSpecialization.documentId,
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
            // Create new specialization
            createSpecialization({ data: values }, {
                onSuccess: () => {
                    handleFormClose();
                },
                onError: (error) => {
                    console.log('error', error);
                }
            });
        }
    };

    // Handle delete specialization
    const handleDeleteClick = (specialization) => {
        setSpecializationToDelete(specialization);
        setIsDeleteModalVisible(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        if (specializationToDelete) {
            deleteSpecialization({ documentId: specializationToDelete.documentId }, {
                onSuccess: () => {
                    setIsDeleteModalVisible(false);
                    setSpecializationToDelete(null);
                },
                onError: (error) => {
                    console.log('error', error);
                }
            });
        }
    };

    return (
        <div className="specialization-dashboard min-h-screen p-4">
            <div className="mx-auto">
                <div className="specialization-header">
                    <h1 className="text-3xl font-bold text_first">
                        <FormattedMessage id="admin.specialization.title" defaultMessage="Specialization Management" />
                    </h1>

                </div>

                <Card className="mb-6">
                    <div className="search-filter-container flex justify-end">
                        <Button
                            type="primary"
                            icon={<BsPlus />}
                            onClick={handleAddSpecialization}
                        >
                            <FormattedMessage id="admin.specialization.action_add" defaultMessage="Add Specialization" />
                        </Button>
                    </div>

                    {specializationsData?.data?.length > 0 ? (
                        <SpecializationTable
                            data={specializationsData.data}
                            loading={isLoadingSpecializations}
                            pagination={{
                                pageSize: 10,
                                total: specializationsData.total || 0,
                                className: 'custom-pagination'
                            }}
                            onEdit={handleEditSpecialization}
                            onDelete={handleDeleteClick}
                        />
                    ) : (
                        <div className="empty-state">
                            <BsBookHalf className="empty-icon" />
                            <p className="mb-4 text_secondary">
                                <FormattedMessage
                                    id="admin.specialization.empty"
                                    defaultMessage="No specializations found. Create your first specialization to get started."
                                />
                            </p>
                            <Button type="primary" icon={<BsPlus />} onClick={handleAddSpecialization}>
                                <FormattedMessage id="admin.specialization.action_add" defaultMessage="Add Specialization" />
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            {/* Specialization Form Modal */}
            <SpecializationForm
                visible={isFormVisible}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                initialValues={editingSpecialization}
                isLoading={isCreating || isUpdating}
                isEdit={!!editingSpecialization}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmation
                visible={isDeleteModalVisible}
                onClose={() => setIsDeleteModalVisible(false)}
                onConfirm={handleDeleteConfirm}
                specialization={specializationToDelete}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default SpecializationDashboard;