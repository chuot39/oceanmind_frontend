import { useDispatch, useSelector } from "react-redux";
import { changeLayout, changeMenuCollapsed, changeTransition, changeContentWidth } from "../../redux/store/actions/appActions";

const useLayout = () => {
    const dispatch = useDispatch();

    const layout = useSelector(state => state.app.layout);
    const menuCollapsed = useSelector(state => state.app.menuCollapsed);
    const contentWidth = useSelector(state => state.app.contentWidth);
    const transition = useSelector(state => state.app.transition);
    const appLayout = useSelector(state => state.app.appLayout);

    const changeLayoutRedux = (layout) => {
        dispatch(changeLayout(layout))
    }

    const changeMenuCollapsedRedux = (menuCollapsed) => {
        dispatch(changeMenuCollapsed(menuCollapsed))
    }

    const changeContentWidthRedux = (contentWidth) => {
        dispatch(changeContentWidth(contentWidth))
    }

    const changeTransitionRedux = (transition) => {
        dispatch(changeTransition(transition))
    }

    return { layout, menuCollapsed, contentWidth, transition, appLayout, changeLayoutRedux, changeMenuCollapsedRedux, changeContentWidthRedux, changeTransitionRedux };
}

export default useLayout;
