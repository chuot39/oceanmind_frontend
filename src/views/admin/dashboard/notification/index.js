import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Tag, Divider, Space } from 'antd';
import { BsFilter, BsPlus, BsX } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNotifications } from './hook';
import NotificationTable from './components/NotificationTable';
import FilterDrawer from './components/FilterDrawer';
import NotificationForm from './components/NotificationForm';
import NotificationDetail from './components/NotificationDetail';
import StatCards from './components/StatCards';

const { Search } = Input;

const NotificationDashboard = () => {
    const intl = useIntl();


    // State for pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });

    // State for filters
    const [searchText, setSearchText] = useState('');
    const [filterValues, setFilterValues] = useState({});
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // State for notification form
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // State for notification detail
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [detailNotification, setDetailNotification] = useState(null);

    const { data: notificationsData, isLoading: isLoadingNotifications, fetchNextPage, hasNextPage, isFetchingNextPage, refetch: refetchNotifications } = useNotifications({
        search: searchText,
        ...filterValues,
        limit: pagination.pageSize,
        page: pagination.current,
    })

    const notifications = notificationsData?.pages.flatMap(page => page.data) || []

    // Handle table pagination change
    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination);
    };


    // Handle filter apply
    const handleFilter = (values) => {
        setFilterValues(values);
        setPagination({ ...pagination, current: 1 });
    };

    // Handle edit notification
    const handleEdit = (notification) => {
        setSelectedNotification(notification);
        setIsEditMode(true);
        setIsFormVisible(true);
    };

    // Handle view notification details
    const handleView = (notification) => {
        setDetailNotification(notification);
        setIsDetailVisible(true);
    };

    // Handle create new notification
    const handleCreate = () => {
        setSelectedNotification(null);
        setIsEditMode(false);
        setIsFormVisible(true);
    };

    // Handle form close
    const handleFormClose = () => {
        setIsFormVisible(false);
        setSelectedNotification(null);
    };

    // Handle detail close
    const handleDetailClose = () => {
        setIsDetailVisible(false);
        setDetailNotification(null);
    };


    // Handle removing individual filter
    const handleRemoveFilter = (filterKey, value) => {
        const updatedFilters = { ...filterValues };

        if (Array.isArray(updatedFilters[filterKey])) {
            updatedFilters[filterKey] = updatedFilters[filterKey].filter(item => item !== value);
            if (updatedFilters[filterKey].length === 0) {
                delete updatedFilters[filterKey];
            }
        } else {
            delete updatedFilters[filterKey];
        }

        setFilterValues(updatedFilters);
    };

    // Handle clearing all filters
    const handleClearAllFilters = () => {
        setFilterValues({});
        setSearchText('');
    };

    // Get filter tags for display
    const getFilterTags = () => {
        const tags = [];

        // Notice type filter tags
        if (filterValues.noticeType && filterValues.noticeType.length > 0) {
            filterValues.noticeType.forEach(typeId => {
                tags.push({
                    key: `type-${typeId}`,
                    label: `${intl.formatMessage({ id: 'notification.filter.type', defaultMessage: 'Type' })}: ${typeId}`,
                    value: typeId,
                    filterKey: 'noticeType'
                });
            });
        }

        // Target audience filter tag
        if (filterValues.isGlobal !== undefined) {
            const targetLabel = filterValues.isGlobal
                ? intl.formatMessage({ id: 'notification.global', defaultMessage: 'Global' })
                : intl.formatMessage({ id: 'notification.specific', defaultMessage: 'Specific Users' });

            tags.push({
                key: 'isGlobal',
                label: `${intl.formatMessage({ id: 'notification.filter.target', defaultMessage: 'Target' })}: ${targetLabel}`,
                value: filterValues.isGlobal,
                filterKey: 'isGlobal'
            });
        }

        // Date range filter tag
        if (filterValues.dateRange && filterValues.dateRange.length === 2) {
            tags.push({
                key: 'dateRange',
                label: `${intl.formatMessage({ id: 'notification.filter.date_range', defaultMessage: 'Date Range' })}: ${filterValues.dateRange[0].format('DD/MM/YYYY')} - ${filterValues.dateRange[1].format('DD/MM/YYYY')}`,
                value: filterValues.dateRange,
                filterKey: 'dateRange'
            });
        }

        // Status filter tag
        if (filterValues.status !== undefined) {
            const statusLabel = filterValues.status
                ? intl.formatMessage({ id: 'notification.status.deleted', defaultMessage: 'Soft Deleted' })
                : intl.formatMessage({ id: 'notification.status.active', defaultMessage: 'Active' });

            tags.push({
                key: 'status',
                label: `${intl.formatMessage({ id: 'notification.filter.status', defaultMessage: 'Status' })}: ${statusLabel}`,
                value: filterValues.status,
                filterKey: 'status'
            });
        }

        return tags;
    };

    const filterTags = getFilterTags();

    return (
        <div className="notification-dashboard min-h-screen p-4">
            <div className=" mx-auto">
                <h1 className="text-3xl text_first font-bold mb-4">
                    <FormattedMessage id="admin.dashboard.notification.dashboard_title" defaultMessage="Notification Dashboard" />
                </h1>

                {/* Statistics Cards */}
                <StatCards />

                <Card className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        {/* <div className="flex-1 min-w-[200px] max-w-md">
                            <Search
                                placeholder={intl.formatMessage({
                                    id: 'admin.dashboard.notification.search.placeholder',
                                    defaultMessage: "Search notifications..."
                                })}
                                allowClear
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onSearch={handleSearch}
                            />
                        </div> */}
                        <div className="flex gap-2">
                            {/* <Button
                                icon={<BsFilter />}
                                onClick={() => setIsFilterVisible(true)}
                            >
                                <FormattedMessage id="admin.dashboard.notification.filter" defaultMessage="Filter" />
                            </Button> */}
                            <Button
                                type="primary"
                                icon={<BsPlus />}
                                onClick={handleCreate}
                            >
                                <FormattedMessage id="admin.dashboard.notification.create_notification" defaultMessage="Create Notification" />
                            </Button>
                        </div>
                    </div>

                    {/* Filter tags display */}
                    {filterTags.length > 0 && (
                        <div className="mb-4 filter-tags-container">
                            <Space size={[0, 8]} wrap>
                                {filterTags.map(tag => (
                                    <Tag
                                        key={tag.key}
                                        closable
                                        onClose={() => handleRemoveFilter(tag.filterKey, tag.value)}
                                        color="blue"
                                    >
                                        {tag.label}
                                    </Tag>
                                ))}
                                {filterTags.length > 0 && (
                                    <Button
                                        size="small"
                                        type="primary"
                                        onClick={handleClearAllFilters}
                                        className="clear-all-btn"
                                    >
                                        <FormattedMessage id="common.clear_all" defaultMessage="Clear All" />
                                    </Button>
                                )}
                            </Space>
                        </div>
                    )}

                    {/* Notifications Table */}
                    <NotificationTable
                        data={notifications || []}
                        loading={isLoadingNotifications || isFetchingNextPage}
                        refetchNotifications={refetchNotifications}
                        pagination={{
                            ...pagination,
                            total: notificationsData?.pages[0]?.pagination?.total || 0,
                            showSizeChanger: true,
                            pageSizeOptions: [5, 10, 20, 50, 100],
                            className: 'custom-pagination',
                        }}
                        onChange={handleTableChange}
                        onEdit={handleEdit}
                        onView={handleView}
                        onLoadMore={fetchNextPage}
                        hasMore={hasNextPage}
                    />
                </Card>
            </div>

            {/* Filter Drawer */}
            <FilterDrawer
                visible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                onApply={handleFilter}
                currentFilters={filterValues}
            />

            {/* Notification Form Drawer */}
            <NotificationForm
                visible={isFormVisible}
                onClose={handleFormClose}
                initialValues={selectedNotification}
                isEdit={isEditMode}
            />

            {/* Notification Detail Drawer */}
            <NotificationDetail
                visible={isDetailVisible}
                onClose={handleDetailClose}
                notification={detailNotification}
            />
        </div>
    );
};

export default NotificationDashboard;