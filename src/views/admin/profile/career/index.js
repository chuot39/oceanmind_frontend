import React, { useState, useEffect } from 'react';
import { Button, Card, Empty, message, Spin } from 'antd';
import { BsPlus, BsFileEarmarkText } from 'react-icons/bs';
import CareerTable from './components/CareerTable';
import CareerForm from './components/CareerForm';
import DeleteConfirmation from './components/DeleteConfirmation';
import CareerDetail from './components/CareerDetail';
import SearchBox from './components/SearchBox';
import { useCareers } from './hook';
import { useCreateCareer, useUpdateCareer, useDeleteCareer } from './mutationHook';
import './career.scss';

const CareerManagement = () => {
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
    const [selectedCareer, setSelectedCareer] = useState(null);
    const [searchInput, setSearchInput] = useState('');

    // Query hook for fetching careers
    const { data, isLoading, isFetching } = useCareers(filters);

    // Mutation hooks for CRUD operations
    const createCareer = useCreateCareer();
    const updateCareer = useUpdateCareer();
    const deleteCareer = useDeleteCareer();

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
    const handleAddCareer = (values) => {
        createCareer.mutate(values, {
            onSuccess: () => {
                message.success('Career added successfully');
                setIsAddModalVisible(false);
            },
            onError: (error) => {
                message.error('Failed to add career: ' + error.message);
            }
        });
    };

    const handleUpdateCareer = (values) => {
        updateCareer.mutate({
            id: selectedCareer.documentId,
            data: values
        }, {
            onSuccess: () => {
                message.success('Career updated successfully');
                setIsEditModalVisible(false);
                setSelectedCareer(null);
            },
            onError: (error) => {
                message.error('Failed to update career: ' + error.message);
            }
        });
    };

    const handleDeleteCareer = () => {
        deleteCareer.mutate(selectedCareer.documentId, {
            onSuccess: () => {
                message.success('Career deleted successfully');
                setIsDeleteModalVisible(false);
                setSelectedCareer(null);
            },
            onError: (error) => {
                message.error('Failed to delete career: ' + error.message);
            }
        });
    };

    const showEditModal = (career) => {
        setSelectedCareer(career);
        setIsEditModalVisible(true);
    };

    const showDeleteModal = (career) => {
        setSelectedCareer(career);
        setIsDeleteModalVisible(true);
    };

    const showDetailModal = (career) => {
        setSelectedCareer(career);
        setIsDetailModalVisible(true);
    };

    // Clear search input if filters are cleared outside
    useEffect(() => {
        if (!filters.name) {
            setSearchInput('');
        }
    }, [filters.name]);

    return (
        <div className="career-management min-h-screen p-4">
            <div className="max-w-7xl mx-auto">
                <div className="page-header">
                    <h1 className="text-3xl font-bold text-gray-900">Career Management</h1>
                    <p className="text-gray-500 mt-2">Manage career options in the system</p>
                </div>

                <Card>
                    <div className="page-toolbar">
                        <div className="left-actions">
                            <Button
                                type="primary"
                                icon={<BsPlus />}
                                onClick={() => setIsAddModalVisible(true)}
                            >
                                Add Career
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
                        <div className="empty-careers">
                            <BsFileEarmarkText className="empty-icon" />
                            <h3>No careers found</h3>
                            <p className="empty-text">
                                {filters.name
                                    ? 'Try adjusting your search to find what you are looking for.'
                                    : 'Get started by adding a new career.'}
                            </p>
                            <Button
                                type="primary"
                                icon={<BsPlus />}
                                onClick={() => setIsAddModalVisible(true)}
                            >
                                Add Career
                            </Button>
                        </div>
                    ) : (
                        <CareerTable
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

                {/* Add Career Modal */}
                <CareerForm
                    visible={isAddModalVisible}
                    onClose={() => setIsAddModalVisible(false)}
                    onSubmit={handleAddCareer}
                    isLoading={createCareer.isLoading}
                />

                {/* Edit Career Modal */}
                {selectedCareer && (
                    <CareerForm
                        visible={isEditModalVisible}
                        onClose={() => {
                            setIsEditModalVisible(false);
                            setSelectedCareer(null);
                        }}
                        initialValues={selectedCareer}
                        onSubmit={handleUpdateCareer}
                        isLoading={updateCareer.isLoading}
                        isEdit
                    />
                )}

                {/* Delete Confirmation Modal */}
                {selectedCareer && (
                    <DeleteConfirmation
                        visible={isDeleteModalVisible}
                        onClose={() => {
                            setIsDeleteModalVisible(false);
                            setSelectedCareer(null);
                        }}
                        onConfirm={handleDeleteCareer}
                        career={selectedCareer}
                        isLoading={deleteCareer.isLoading}
                    />
                )}

                {/* Career Detail Modal */}
                {selectedCareer && (
                    <CareerDetail
                        visible={isDetailModalVisible}
                        onClose={() => {
                            setIsDetailModalVisible(false);
                            setSelectedCareer(null);
                        }}
                        career={selectedCareer}
                        onEdit={showEditModal}
                        onDelete={showDeleteModal}
                    />
                )}
            </div>
        </div>
    );
};

export default CareerManagement;