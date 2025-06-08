import React, { useState } from 'react';
import { Card, Input, Button, message, Empty, Select } from 'antd';
import { BsPlus, BsCalendarRange } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useBatches } from './hook';
import { useCreateBatch, useUpdateBatch, useDeleteBatch } from './mutationHook';
import BatchTable from './components/BatchTable';
import BatchForm from './components/BatchForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import YearFilter from './components/YearFilter';
import './batch.scss';


const BatchDashboard = () => {
    const intl = useIntl();

    // State for batch form
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingBatch, setEditingBatch] = useState(null);

    // State for delete confirmation
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [batchToDelete, setBatchToDelete] = useState(null);

    // Fetch batches with filters
    const { data: batchesData, isLoading: isLoadingBatches } = useBatches();

    // Mutation hooks
    const { mutate: createBatch, isLoading: isCreating } = useCreateBatch();
    const { mutate: updateBatch, isLoading: isUpdating } = useUpdateBatch();
    const { mutate: deleteBatch, isLoading: isDeleting } = useDeleteBatch();

    // Handle add new batch
    const handleAddBatch = () => {
        setEditingBatch(null);
        setIsFormVisible(true);
    };

    // Handle edit batch
    const handleEditBatch = (batch) => {
        setEditingBatch(batch);
        setIsFormVisible(true);
    };

    // Handle form submission
    const handleFormSubmit = (values) => {
        console.log('values', values);
        if (editingBatch) {
            // Update existing batch
            updateBatch({
                documentId: editingBatch.documentId,
                data: values
            }, {
                onSuccess: () => {
                    setIsFormVisible(false);
                    setEditingBatch(null);
                },
                onError: (error) => {
                    console.error("Error when update batch: ", error)
                }
            });
        } else {
            // Create new batch
            createBatch({ data: values }, {
                onSuccess: () => {
                    setIsFormVisible(false);
                },
                onError: (error) => {
                    console.log('error', error);
                }
            });
        }
    };

    // Handle delete batch
    const handleDeleteClick = (batch) => {
        setBatchToDelete(batch);
        setIsDeleteModalVisible(true);
    };

    // Handle delete confirmation
    const handleDeleteConfirm = () => {
        if (batchToDelete) {
            deleteBatch({ documentId: batchToDelete.documentId }, {
                onSuccess: () => {
                    setIsDeleteModalVisible(false);
                    setBatchToDelete(null);
                },
                onError: (error) => {
                    console.error("Error when delete batch: ", error)
                }
            });
        }
    };

    return (
        <div className="batch-dashboard min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                <div className="batch-header">
                    <h1 className="text-3xl font-bold text_first">
                        <FormattedMessage id="admin.batch.title" defaultMessage="Batch Management" />
                    </h1>

                </div>

                <Card className="mb-6">
                    <div className="search-filter-container flex justify-end">
                        <Button
                            type="primary"
                            icon={<BsPlus />}
                            onClick={handleAddBatch}
                        >
                            <FormattedMessage id="admin.batch.action_add" defaultMessage="Add Batch" />
                        </Button>
                    </div>

                    {batchesData?.data?.length > 0 ? (
                        <BatchTable
                            data={batchesData.data}
                            loading={isLoadingBatches}
                            pagination={{
                                current: 1,
                                pageSize: 10,
                                total: batchesData.total || 0,
                                className: 'custom-pagination'
                            }}
                            onEdit={handleEditBatch}
                            onDelete={handleDeleteClick}
                        />
                    ) : (
                        <div className="empty-state">
                            <BsCalendarRange className="empty-icon" />
                            <p className="empty-text">
                                <FormattedMessage
                                    id="batch.empty"
                                    defaultMessage="No batches found. Create your first batch to get started."
                                />
                            </p>
                            <Button type="primary" icon={<BsPlus />} onClick={handleAddBatch}>
                                <FormattedMessage id="batch.action.add" defaultMessage="Add Batch" />
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            {/* Batch Form Modal */}
            <BatchForm
                visible={isFormVisible}
                onClose={() => setIsFormVisible(false)}
                onSubmit={handleFormSubmit}
                initialValues={editingBatch}
                isLoading={isCreating || isUpdating}
                isEdit={!!editingBatch}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmation
                visible={isDeleteModalVisible}
                onClose={() => setIsDeleteModalVisible(false)}
                onConfirm={handleDeleteConfirm}
                batch={batchToDelete}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default BatchDashboard;