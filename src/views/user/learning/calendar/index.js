import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import moment from 'moment';
import CalendarHeader from './components/CalendarHeader';
import CalendarSidebar from './components/CalendarSidebar';
import CalendarView from './components/CalendarView';
import EventDrawer from './components/EventDrawer';
import '../../../../core/scss/styles/pages/learning/calendar.scss';

const CalendarDashboard = () => {
    const [currentDate, setCurrentDate] = useState(moment(new Date()));
    const [view, setView] = useState('month');
    const [selectedFilters, setSelectedFilters] = useState(['view-all']);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Initialize calendar to current date when component mounts
    useEffect(() => {
        setCurrentDate(moment(new Date()));
    }, []);

    // Mock events data - replace with actual data from your API
    const events = [
        {
            id: 1,
            title: "Doctor's Appointment",
            startDate: '2025-02-17 12:00',
            endDate: '2025-02-17 13:00',
            label: 'personal',
            allDay: false
        },
        {
            id: 2,
            title: 'Family Trip',
            startDate: '2025-02-19',
            endDate: '2025-02-20',
            label: 'family',
            allDay: true
        }
        // Add more mock events
    ];

    const handleNavigate = (action) => {
        const newDate = moment(currentDate);
        if (action === 'PREV') {
            newDate.subtract(1, view);
        } else if (action === 'NEXT') {
            newDate.add(1, view);
        }
        setCurrentDate(newDate);
    };

    const handleViewChange = (newView) => {
        setView(newView);
    };

    const handleFilterChange = (filter, checked) => {
        if (filter === 'view-all') {
            setSelectedFilters(checked ? ['view-all'] : []);
        } else {
            setSelectedFilters(prev => {
                const newFilters = prev.filter(f => f !== 'view-all');
                if (checked) {
                    return [...newFilters, filter];
                }
                return newFilters.filter(f => f !== filter);
            });
        }
    };

    const handleAddEvent = () => {
        setSelectedEvent(null);
        setDrawerVisible(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setDrawerVisible(true);
    };

    const handleDrawerClose = () => {
        setDrawerVisible(false);
        setSelectedEvent(null);
    };

    const filteredEvents = events.filter(event =>
        selectedFilters.includes('view-all') || selectedFilters.includes(event.label)
    );

    return (
        <Card className="calendar-dashboard h-full">
            <div className="flex h-full">
                <div className="w-64 flex flex-col">
                    <CalendarSidebar
                        selectedDate={currentDate}
                        onSelect={setCurrentDate}
                        filters={selectedFilters}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                <div className="flex-1 ml-6">
                    <CalendarHeader
                        currentDate={currentDate}
                        onNavigate={handleNavigate}
                        view={view}
                        onViewChange={handleViewChange}
                        onAddEvent={handleAddEvent}
                    />

                    <CalendarView
                        events={filteredEvents}
                        view={view}
                        selectedDate={currentDate}
                        onSelectEvent={handleSelectEvent}
                        onSelectSlot={setCurrentDate}
                    />
                </div>
            </div>

            <EventDrawer
                visible={drawerVisible}
                onClose={handleDrawerClose}
                event={selectedEvent}
                mode={selectedEvent ? 'edit' : 'add'}
            />
        </Card>
    );
};

export default CalendarDashboard;