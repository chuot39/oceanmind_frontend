import React, { useState, useEffect, useCallback } from 'react';
import { Card, Input, Button, Tag, Space } from 'antd';
import { BsFilter, BsPlus, BsX } from 'react-icons/bs';
import { FormattedMessage, useIntl } from 'react-intl';
import EventTable from './components/EventTable';
import FilterDrawer from './components/FilterDrawer';
import EventForm from './components/EventForm';
import EventDetail from './components/EventDetail';
import StatCards from './components/StatCards';
import './event.scss';
import { useEvents } from './hook';
import { debounce } from 'lodash';

const { Search } = Input;

const EventDashboard = () => {
    const intl = useIntl();

    // State for pagination
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    // State for filters
    const [searchText, setSearchText] = useState('');
    const [debouncedSearchText, setDebouncedSearchText] = useState('');
    const [filterValues, setFilterValues] = useState({});
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    // State for event form
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // State for event detail
    const [isDetailVisible, setIsDetailVisible] = useState(false);
    const [detailEvent, setDetailEvent] = useState(null);

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

    // Fetch events with filters
    const { data: eventsData, isLoading: isLoadingEvents, fetchNextPage, hasNextPage, isFetchingNextPage, refetch: refetchEvents } = useEvents({
        search: debouncedSearchText,
        ...filterValues,
    });

    // Format events data for table
    const events = React.useMemo(() => {
        if (!eventsData) return [];
        return eventsData?.pages?.flatMap(page => page?.data || []);
    }, [eventsData]);

    // Handle table pagination change
    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);

        // Load more data when reaching the end
        if (pagination.current * pagination.pageSize >= events.length && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    // Handle search
    const handleSearch = (value) => {
        setSearchText(value);
    };

    // Handle search input change
    const handleSearchInputChange = (e) => {
        setSearchText(e.target.value);
    };

    // Handle filter apply
    const handleFilter = (values) => {
        console.log('values', values);
        setFilterValues(values);
        setPagination({ ...pagination, current: 1 });
    };

    // Handle edit event
    const handleEdit = (event) => {
        setSelectedEvent(event);
        setIsEditMode(true);
        setIsFormVisible(true);
    };

    // Handle view event details
    const handleView = (event) => {
        setDetailEvent(event);
        setIsDetailVisible(true);
    };

    // Handle create new event
    const handleCreate = () => {
        setSelectedEvent(null);
        setIsEditMode(false);
        setIsFormVisible(true);
    };

    // Handle form close
    const handleFormClose = () => {
        setIsFormVisible(false);
        setSelectedEvent(null);
    };

    // Handle detail close
    const handleDetailClose = () => {
        setIsDetailVisible(false);
        setDetailEvent(null);
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
        setDebouncedSearchText('');
    };

    // Get filter tags for display
    const getFilterTags = () => {
        const tags = [];

        // Date range filter tag
        if (filterValues.dateRange && filterValues.dateRange.length === 2) {
            tags.push({
                key: 'dateRange',
                label: `${intl.formatMessage({ id: 'event.filter.date_range', defaultMessage: 'Date Range' })}: ${filterValues.dateRange[0].format('DD/MM/YYYY')} - ${filterValues.dateRange[1].format('DD/MM/YYYY')}`,
                value: filterValues.dateRange,
                filterKey: 'dateRange'
            });
        }

        // Status filter tag
        if (filterValues.status) {
            let statusLabel = '';

            switch (filterValues.status) {
                case 'upcoming':
                    statusLabel = intl.formatMessage({ id: 'event.status.upcoming', defaultMessage: 'Upcoming' });
                    break;
                case 'ongoing':
                    statusLabel = intl.formatMessage({ id: 'event.status.ongoing', defaultMessage: 'Ongoing' });
                    break;
                case 'past':
                    statusLabel = intl.formatMessage({ id: 'event.status.past', defaultMessage: 'Past' });
                    break;
                default:
                    statusLabel = filterValues.status;
            }

            tags.push({
                key: 'status',
                label: `${intl.formatMessage({ id: 'event.filter.status', defaultMessage: 'Status' })}: ${statusLabel}`,
                value: filterValues.status,
                filterKey: 'status'
            });
        }

        // Sort by filter tag
        if (filterValues.sortBy) {
            let sortLabel = '';

            switch (filterValues.sortBy) {
                case 'date_desc':
                    sortLabel = intl.formatMessage({ id: 'event.sort.date_desc', defaultMessage: 'Date (Newest First)' });
                    break;
                case 'date_asc':
                    sortLabel = intl.formatMessage({ id: 'event.sort.date_asc', defaultMessage: 'Date (Oldest First)' });
                    break;
                case 'name':
                    sortLabel = intl.formatMessage({ id: 'event.sort.name', defaultMessage: 'Name (A-Z)' });
                    break;
                default:
                    sortLabel = filterValues.sortBy;
            }

            tags.push({
                key: 'sortBy',
                label: `${intl.formatMessage({ id: 'event.filter.sort_by', defaultMessage: 'Sort By' })}: ${sortLabel}`,
                value: filterValues.sortBy,
                filterKey: 'sortBy'
            });
        }

        return tags;
    };

    const filterTags = getFilterTags();

    return (
        <div className="event-dashboard min-h-screen p-4">
            <div className=" mx-auto">
                <h1 className="text-3xl font-bold text_first mb-4">
                    <FormattedMessage id="event.dashboard.title" defaultMessage="Event Dashboard" />
                </h1>

                {/* Statistics Cards */}
                <StatCards events={events} isLoading={isLoadingEvents} />

                <Card className="mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-[200px] max-w-md">
                            <Search
                                placeholder={intl.formatMessage({
                                    id: 'event.search.placeholder',
                                    defaultMessage: "Search events..."
                                })}
                                allowClear
                                value={searchText}
                                onChange={handleSearchInputChange}
                                onSearch={handleSearch}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                icon={<BsFilter />}
                                onClick={() => setIsFilterVisible(true)}
                            >
                                <FormattedMessage id="event.action.filter" defaultMessage="Filter" />
                            </Button>
                            <Button
                                type="primary"
                                icon={<BsPlus />}
                                onClick={handleCreate}
                            >
                                <FormattedMessage id="event.action.create" defaultMessage="Create Event" />
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

                    {/* Events Table */}
                    <EventTable
                        data={events}
                        loading={isLoadingEvents}
                        pagination={{
                            ...pagination,
                            total: events?.length,
                            showSizeChanger: true,
                            pageSizeOptions: [10, 20, 50, 100],
                        }}
                        onChange={handleTableChange}
                        onEdit={handleEdit}
                        onView={handleView}
                        refetchEvents={refetchEvents}
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

            {/* Event Form Drawer */}
            <EventForm
                visible={isFormVisible}
                onClose={handleFormClose}
                initialValues={selectedEvent}
                isEdit={isEditMode}
            />

            {/* Event Detail Drawer */}
            <EventDetail
                visible={isDetailVisible}
                onClose={handleDetailClose}
                event={detailEvent}
            />
        </div>
    );
};

export default EventDashboard;