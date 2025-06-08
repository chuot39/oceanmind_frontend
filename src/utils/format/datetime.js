import moment from 'moment';

export const formatDate = (date) => {
    if (!date) return '';
    return moment(date).format('DD/MM/YYYY');
};

export const formatDateTime = (date) => {
    if (!date) return '';
    return moment(date).format('DD/MM/YYYY HH:mm');
};


export const formatTime = (date) => {
    if (!date) return '';
    return moment(date).format('HH:mm');
};


export const getRelativeTime = (date) => {
    if (!date) return '';
    return moment(date).fromNow();
}; 