import { Tag } from "antd";
import { BsCheckCircle, BsClock, BsExclamationCircle } from "react-icons/bs";
import { FormattedMessage } from "react-intl";

export const getNotificationContent = (status, friendId, userId) => {
    let title, content, link, is_global, notification_created_by, notice_type_label;
    switch (status) {
        case 'pending':
            title = 'Friend Request';
            content = 'You have a new friend request';
            link = `/user/${friendId}`;
            is_global = false;
            notice_type_label = 'Notification';
            notification_created_by = userId;
            break;
        case 'accepted':
            title = 'Friend Request';
            content = 'Your friend request has been accepted';
            link = `/user/${friendId}`;
            is_global = false;
            notice_type_label = 'Notification';
            notification_created_by = userId;
            break;
        case 'rejected':
            title = 'Friend Request';
            content = 'Your friend request has been rejected';
            link = `/user/${friendId}`;
            is_global = false;
            notice_type_label = 'Notification';
            notification_created_by = userId;
            break;
        default:
            title = '';
            content = '';
    }
    return { title, content, link, is_global, notice_type_label, notification_created_by }
}

export const getNotificationLink = (type) => {
    switch (type) {
        case 'New Task':
            return '/learning/task';
        case 'Upcoming Task':
            return '/learning/task';
        case 'Overdue Task':
            return '/learning/task';
        case 'Message':
            return '/social/chat';
        case 'Event':
            return '/dashboard/event';
        case 'Post':
            return '/social/discus';
        case 'System':
            return '/support/update';
        case 'Notification':
            return '/dashboard/notification';

        default:
            return '/dashboard/overview';

    }
}

export const getStatusTag = (status, size = 18) => {
    switch (status) {
        case 'pending':
            return (
                <Tag color="orange" className="flex items-center gap-1">
                    <BsClock size={size} />
                    <FormattedMessage id="admin.report.post.stats.pending" defaultMessage="Pending" />
                </Tag>
            );
        case 'denied':
            return (
                <Tag color="purple" className="flex items-center gap-1">
                    <BsExclamationCircle size={size} />
                    <FormattedMessage id="admin.report.post.stats.denied" defaultMessage="Denied" />
                </Tag>
            );
        case 'resolved':
            return (
                <Tag color="green" className="flex items-center gap-1">
                    <BsCheckCircle size={size} />
                    <FormattedMessage id="admin.report.post.stats.resolved" defaultMessage="Resolved" />
                </Tag>
            );
        default:
            return (
                <Tag color="default">
                    {status}
                </Tag>
            );
    }
};