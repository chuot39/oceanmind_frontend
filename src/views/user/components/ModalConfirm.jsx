import { Modal } from "antd";

const ModalConfirm = ({ typeModal, objNeedConfirm, handleResolve, loading, intl }) => {
    // Tạo cấu hình modal dựa trên loại
    let modalConfig = {
        title: '',
        okText: 'OK',
        cancelText: 'Cancel',
        content: '',
        okButtonProps: { danger: true },
        confirmLoading: loading,
        onOk: () => { }
    };

    // Cấu hình dựa trên loại modal
    switch (typeModal) {
        case 'mark_complete':
            modalConfig.title = intl.formatMessage({ id: 'learning.learn_exercise.mark_complete_title', defaultMessage: 'Mark Complete' });
            modalConfig.content = intl.formatMessage({ id: 'learning.learn_exercise.mark_complete_content', defaultMessage: 'Are you sure you want to mark this project as complete?' });
            modalConfig.okText = intl.formatMessage({ id: 'learning.learn_exercise.yes_mark_complete', defaultMessage: 'Yes, Mark Complete' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'mark_complete' });
            break;
        case 'mark_uncompleted':
            modalConfig.title = intl.formatMessage({ id: 'learning.learn_exercise.mark_uncompleted_title', defaultMessage: 'Mark Uncompleted' });
            modalConfig.content = intl.formatMessage({ id: 'learning.learn_exercise.mark_uncompleted_content', defaultMessage: 'Are you sure you want to mark this project as uncompleted?' });
            modalConfig.okText = intl.formatMessage({ id: 'learning.learn_exercise.yes_mark_uncompleted', defaultMessage: 'Yes, Mark Uncompleted' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'mark_uncompleted' });
            break;
        case 'leave_project':
            modalConfig.title = intl.formatMessage({ id: 'learning.learn_exercise.leave_project_title', defaultMessage: 'Leave Project' });
            modalConfig.content = intl.formatMessage({ id: 'learning.learn_exercise.leave_project_content', defaultMessage: 'Are you sure you want to leave this project?' });
            modalConfig.okText = intl.formatMessage({ id: 'learning.learn_exercise.yes_leave_project', defaultMessage: 'Yes, Leave Project' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'leave_project' });
            break;
        case 'delete_document':
            modalConfig.title = intl.formatMessage({ id: 'learning.document.delete_document_title', defaultMessage: 'Delete Document' });
            modalConfig.content = intl.formatMessage({ id: 'learning.document.delete_document_content', defaultMessage: 'Are you sure you want to delete this document?' });
            modalConfig.okText = intl.formatMessage({ id: 'learning.document.yes_delete_document', defaultMessage: 'Yes, Delete Document' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'delete_document' });
            break;
        case 'delete_notification':
            modalConfig.title = intl.formatMessage({ id: 'admin.dashboard.notification.delete', defaultMessage: 'Delete Notification' });
            modalConfig.content = intl.formatMessage({ id: 'admin.dashboard.notification.delete_content', defaultMessage: 'Are you sure you want to delete this notification?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'delete_notification' });
            break;

        case 'restore_notification':
            modalConfig.title = intl.formatMessage({ id: 'admin.dashboard.notification.actions.restore', defaultMessage: 'Restore Notification' });
            modalConfig.content = intl.formatMessage({ id: 'admin.dashboard.notification.actions.restore_content', defaultMessage: 'Are you sure you want to restore this notification?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'restore_notification' });
            break;
        case 'permanent_delete_notification':
            modalConfig.title = intl.formatMessage({ id: 'admin.dashboard.notification.actions.permanent_delete', defaultMessage: 'Permanent Delete Notification' });
            modalConfig.content = intl.formatMessage({ id: 'admin.dashboard.notification.actions.permanent_delete_content', defaultMessage: 'Are you sure you want to delete this notification permanently?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'permanent_delete_notification' });
            break;

        case 'restore_task':
            modalConfig.title = intl.formatMessage({ id: 'learning.learning_progress.restore_task_title', defaultMessage: 'Restore Task' });
            modalConfig.content = intl.formatMessage({ id: 'learning.learning_progress.restore_task_content', defaultMessage: 'Are you sure you want to restore this task?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'restore_task' });
            break;
        case 'permanent_delete_task':
            modalConfig.title = intl.formatMessage({ id: 'learning.learning_progress.permanent_delete_task_title', defaultMessage: 'Permanent Delete Task' });
            modalConfig.content = intl.formatMessage({ id: 'learning.learning_progress.permanent_delete_task_content', defaultMessage: 'Are you sure you want to delete this task permanently?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'permanent_delete_task' });
            break;

        case 'delete_event':
            modalConfig.title = intl.formatMessage({ id: 'admin.dashboard.event.action.delete', defaultMessage: 'Delete' });
            modalConfig.content = intl.formatMessage({ id: 'admin.dashboard.event.action.delete_content', defaultMessage: 'Are you sure you want to delete this event?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'delete_event' });
            break;
        case 'restore_event':
            modalConfig.title = intl.formatMessage({ id: 'admin.dashboard.event.action.restore', defaultMessage: 'Restore' });
            modalConfig.content = intl.formatMessage({ id: 'admin.dashboard.event.action.restore_content', defaultMessage: 'Are you sure you want to restore this event?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'restore_event' });
            break;
        case 'permanent_delete_event':
            modalConfig.title = intl.formatMessage({ id: 'admin.dashboard.event.action.permanent_delete', defaultMessage: 'Permanent Delete' });
            modalConfig.content = intl.formatMessage({ id: 'admin.dashboard.event.action.permanent_delete_content', defaultMessage: 'Are you sure you want to delete this event permanently?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'permanent_delete_event' });
            break;

        case 'restore_report':
            modalConfig.title = intl.formatMessage({ id: 'admin.report.action.restore', defaultMessage: 'Restore' });
            modalConfig.content = intl.formatMessage({ id: 'admin.report.action.restore_content', defaultMessage: 'Are you sure you want to restore this report?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'restore_report' });
            break;

        case 'restore_faculty':
            modalConfig.title = intl.formatMessage({ id: 'admin.faculty.restore_title', defaultMessage: 'Restore' });
            modalConfig.content = intl.formatMessage({ id: 'admin.faculty.restore_content', defaultMessage: 'Are you sure you want to restore this faculty?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'restore_faculty' });
            break;

        case 'restore_specialization':
            modalConfig.title = intl.formatMessage({ id: 'admin.specialization.restore_title', defaultMessage: 'Restore' });
            modalConfig.content = intl.formatMessage({ id: 'admin.specialization.restore_content', defaultMessage: 'Are you sure you want to restore this specialization?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'restore_specialization' });
            break;

        case 'restore_batch':
            modalConfig.title = intl.formatMessage({ id: 'admin.batch.restore_title', defaultMessage: 'Restore' });
            modalConfig.content = intl.formatMessage({ id: 'admin.batch.restore_content', defaultMessage: 'Are you sure you want to restore this batch?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'restore_batch' });
            break;

        case 'restore_class':
            modalConfig.title = intl.formatMessage({ id: 'admin.class.restore_title', defaultMessage: 'Restore' });
            modalConfig.content = intl.formatMessage({ id: 'admin.class.restore_content', defaultMessage: 'Are you sure you want to restore this class?' });
            modalConfig.okText = intl.formatMessage({ id: 'common.yes', defaultMessage: 'Yes' });
            modalConfig.cancelText = intl.formatMessage({ id: 'common.cancel', defaultMessage: 'Cancel' });
            modalConfig.onOk = () => handleResolve({ objNeedConfirm, type: 'restore_class' });
            break;

        default:
            break;
    }

    // Hiển thị modal với Ant Design
    Modal.confirm(modalConfig);
};

export default ModalConfirm;
