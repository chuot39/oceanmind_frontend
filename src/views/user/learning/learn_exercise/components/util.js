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


export const getTaskStatus = (task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = task?.due_date ? new Date(task?.due_date) : null;
    if (dueDate) dueDate.setHours(0, 0, 0, 0);

    if (task?.task_completed_on !== null) {
        return 'completed';
    }

    if (task?.is_important) {
        return 'important';
    }

    if (task?.task_completed_on === null) {
        return 'in_progress';
    }

    if (dueDate && dueDate < today && !task?.task_completed_on) {
        return 'overdue';
    }

    if (dueDate && dueDate.getTime() === today.getTime()) {
        return 'due-today';
    }

    return 'my-tasks';
};

export const getProjectStatus = (project) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = project?.due_date ? new Date(project?.due_date) : null;
    if (dueDate) dueDate.setHours(0, 0, 0, 0);

    if (project?.project_completed_on !== null) {
        return 'completed';
    }

    if (project?.project_completed_on === null) {
        return 'in_progress';
    }

    if (dueDate && dueDate < today && !project?.project_completed_on) {
        return 'overdue';
    }

    if (dueDate && dueDate.getTime() === today.getTime()) {
        return 'due-today';
    }

    return 'my-tasks';
};

export const getCategoryColor = (category) => {
    switch (category) {
        case 'Group':
            return 'cyan';
        case 'All':
            return 'purple';
        case 'High':
            return 'magenta';
        case 'Medium':
            return 'yellow';
        case 'Low':
            return 'green';
        case 'Update':
            return 'lime';
        default:
            return 'default';
    }
};
