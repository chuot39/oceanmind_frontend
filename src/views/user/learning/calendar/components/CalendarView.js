import React from 'react';
import { Calendar as AntCalendar, Badge } from 'antd';
import moment from 'moment';

const CalendarView = ({
    events,
    view,
    selectedDate,
    onSelectEvent,
    onSelectSlot
}) => {
    const getEventColor = (label) => {
        const colors = {
            personal: '#ff4d4f',
            business: '#1890ff',
            family: '#ffa940',
            holiday: '#52c41a',
            etc: '#13c2c2'
        };
        return colors[label] || '#d9d9d9';
    };

    const dateCellRender = (date) => {
        const dayEvents = events.filter(event =>
            moment(event.startDate).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
        );

        return (
            <ul className="events">
                {dayEvents.slice(0, 3).map((event) => (
                    <li key={event.id} onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(event);
                    }}>
                        <Badge
                            color={getEventColor(event.label)}
                            text={event.title}
                            className="event-badge"
                        />
                    </li>
                ))}
                {dayEvents.length > 3 && (
                    <li className="more-events">
                        +{dayEvents.length - 3} more
                    </li>
                )}
            </ul>
        );
    };

    const monthCellRender = (date) => {
        const monthEvents = events.filter(event =>
            moment(event.startDate).format('YYYY-MM') === date.format('YYYY-MM')
        );

        return monthEvents.length > 0 ? (
            <div className="month-cell">
                <Badge count={monthEvents.length} />
            </div>
        ) : null;
    };

    return (
        <div className="calendar-view">
            <AntCalendar
                mode={view}
                value={selectedDate}
                dateCellRender={dateCellRender}
                monthCellRender={monthCellRender}
                onSelect={onSelectSlot}
                fullscreen
            />
        </div>
    );
};

export default CalendarView; 