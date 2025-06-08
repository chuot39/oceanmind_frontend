export const getRoleTagColor = (role) => {
    const colors = {
        leader: 'bg-purple-100 text-purple-600',
        developer: 'bg-blue-100 text-blue-600',
        designer: 'bg-pink-100 text-pink-600',
        tester: 'bg-orange-100 text-orange-600',
        member: 'bg-yellow-100 text-yellow-600',
        default: 'bg-gray-100 text-gray-600'
    };
    return colors[role?.toLowerCase()] || colors.default;
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'completed':
            return 'success';
        case 'in_progress':
            return 'processing';
        default:
            return 'default';
    }
};

export const getPriorityTagColor = (tag) => {
    switch (tag) {
        case 'Team':
            return 'purple';
        case 'High':
            return 'red';
        case 'Medium':
            return 'orange';
        case 'Low':
            return 'green';
        case 'Update':
            return 'blue';
        default:
            return 'default';
    };
};

export const getNoticeTypeColor = (type) => {
    switch (type) {
        case 'success':
            return 'success';
        case 'warning':
            return 'warning';
        case 'error':
            return 'error';
        case 'info':
            return 'info';
        case 'primary':
            return 'primary';
        case 'secondary':
            return 'secondary';
        case 'tertiary':
            return 'tertiary';
        case 'quaternary':
            return 'quaternary';

        case 'New Task':
            return 'purple';
        case 'Upcoming Task':
            return 'blue';
        case 'Message':
            return 'pink';
        case 'Event':
            return 'green';
        case 'Overdue Task':
            return 'red';
        case 'Post':
            return 'orange';
        case 'System':
            return 'gray';
        case 'Notification':
            return 'purple';

        default:
            return 'default';

    }
};

export const getLevelColor = (level) => {
    if (level < 1) return 'red';
    if (level < 2) return 'orange';
    if (level < 3) return 'yellow';
    if (level < 4) return 'blue';
    if (level < 5) return 'green';
    return 'green';
};

