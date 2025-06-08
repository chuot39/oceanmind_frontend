import React from 'react';
import { Calendar, Checkbox, Divider } from 'antd';
import { FormattedMessage } from 'react-intl';

const CalendarSidebar = ({
    selectedDate,
    onSelect,
    filters,
    onFilterChange
}) => {
    const filterGroups = [
        {
            key: 'view-all',
            label: <FormattedMessage id="calendar.view_all" defaultMessage="View All" />,
            color: 'gray'
        },
        {
            key: 'personal',
            label: <FormattedMessage id="calendar.personal" defaultMessage="Personal" />,
            color: 'red'
        },
        {
            key: 'business',
            label: <FormattedMessage id="calendar.business" defaultMessage="Business" />,
            color: 'blue'
        },
        {
            key: 'family',
            label: <FormattedMessage id="calendar.family" defaultMessage="Family" />,
            color: 'orange'
        },
        {
            key: 'holiday',
            label: <FormattedMessage id="calendar.holiday" defaultMessage="Holiday" />,
            color: 'green'
        },
        {
            key: 'etc',
            label: <FormattedMessage id="calendar.etc" defaultMessage="ETC" />,
            color: 'cyan'
        }
    ];

    return (
        <div className="calendar-sidebar">
            <div className="mini-calendar mb-6">
                <Calendar
                    fullscreen={false}
                    value={selectedDate}
                    onSelect={onSelect}
                />
            </div>

            <Divider className="my-4" />

            <div className="event-filters">
                <h3 className="text-lg font-medium mb-4">
                    <FormattedMessage id="calendar.event_filters" defaultMessage="Event Filters" />
                </h3>
                <div className="flex flex-col gap-3">
                    {filterGroups.map(filter => (
                        <Checkbox
                            key={filter.key}
                            checked={filters.includes(filter.key)}
                            onChange={e => onFilterChange(filter.key, e.target.checked)}
                            className="filter-checkbox"
                            style={{ color: filter.color }}
                        >
                            {filter.label}
                        </Checkbox>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CalendarSidebar; 