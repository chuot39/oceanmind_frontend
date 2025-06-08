import React from 'react';
import { Button, Radio } from 'antd';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';

const CalendarHeader = ({
    currentDate,
    onNavigate,
    view,
    onViewChange,
    onAddEvent
}) => {
    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
                <Button
                    type="primary"
                    onClick={onAddEvent}
                    className="add-event-btn"
                >
                    + <FormattedMessage id="calendar.add_event" defaultMessage="Add Event" />
                </Button>

                <div className="flex items-center gap-2">
                    <Button
                        icon={<BsChevronLeft />}
                        onClick={() => onNavigate('PREV')}
                    />
                    <span className="text-lg font-medium">
                        {currentDate.format('MMMM YYYY')}
                    </span>
                    <Button
                        icon={<BsChevronRight />}
                        onClick={() => onNavigate('NEXT')}
                    />
                </div>
            </div>

            <Radio.Group
                value={view}
                onChange={e => onViewChange(e.target.value)}
                className="calendar-view-switch"
            >
                <Radio.Button value="month">
                    <FormattedMessage id="calendar.month" defaultMessage="Month" />
                </Radio.Button>
                <Radio.Button value="week">
                    <FormattedMessage id="calendar.week" defaultMessage="Week" />
                </Radio.Button>
                <Radio.Button value="day">
                    <FormattedMessage id="calendar.day" defaultMessage="Day" />
                </Radio.Button>
                <Radio.Button value="list">
                    <FormattedMessage id="calendar.list" defaultMessage="List" />
                </Radio.Button>
            </Radio.Group>
        </div>
    );
};

export default CalendarHeader; 