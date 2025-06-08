export const getTaskStatus = (task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = task?.due_date ? new Date(task?.due_date) : null;
    if (dueDate) dueDate.setHours(0, 0, 0, 0);

    if (task?.task_completed_on !== null) {
        return 'completed';
    }

    if (task?.task_completed_on === null) {
        return 'inprogress';
    }

    if (task?.is_important) {
        return 'important';
    }

    if (dueDate && dueDate < today && !task?.task_completed_on) {
        return 'overdue';
    }

    if (dueDate && dueDate.getTime() === today.getTime()) {
        return 'due-today';
    }

    return 'my-tasks';
};
