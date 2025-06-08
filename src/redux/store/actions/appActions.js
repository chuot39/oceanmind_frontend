import actionTypes from './actionTypes';

export const appStartUpComplete = () => ({
    type: actionTypes.APP_START_UP_COMPLETE
});

export const setContentOfConfirmModal = (contentOfConfirmModal) => ({
    type: actionTypes.SET_CONTENT_OF_CONFIRM_MODAL,
    contentOfConfirmModal: contentOfConfirmModal
});

export const changeLanguageApp = (languageInput) => ({
    type: actionTypes.CHANGE_LANGUAGE,
    language: languageInput
});

export const changeSkin = (skinInput) => ({
    type: actionTypes.CHANGE_SKIN,
    skin: skinInput
});

export const changeLayout = (layoutInput) => ({
    type: actionTypes.CHANGE_LAYOUT,
    layout: layoutInput
});

export const changeMenuCollapsed = (menuCollapsedInput) => ({
    type: actionTypes.CHANGE_MENU_COLLAPSED,
    menuCollapsed: menuCollapsedInput
});

export const changeTransition = (transitionInput) => ({
    type: actionTypes.CHANGE_TRANSITION,
    transition: transitionInput
});

export const changeContentWidth = (contentWidthInput) => ({
    type: actionTypes.HANDLE_CONTENT_WIDTH,
    contentWidth: contentWidthInput
});

