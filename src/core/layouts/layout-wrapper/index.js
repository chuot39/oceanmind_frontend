import classNames from "classnames";
import { Fragment, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import useLayout from "../../../utils/hooks/useLayout";
import ChatMenu from "../../../views/apps/chat/ChatMenu";
import useSkin from "../../../utils/hooks/useSkin";


const LayoutWrapper = props => {
    const { layout, children, appLayout, wrapperClass, transition, routeMeta } = props;
    const dispatch = useDispatch();
    const store = useSelector(state => state.app);

    const { changeContentWidth, changeMenuCollapsedRedux, handleMenuHidden } = useLayout();

    const navbarStore = store.navbar
    const contentWidth = store?.layout?.contentWidth
    const location = useLocation();
    const currentPath = location.pathname;
    const { skin } = useSkin()

    const Tag = layout === 'HorizontalLayout' && !appLayout ? 'div' : Fragment

    const cleanUp = useCallback(() => {
        if (routeMeta) {
            if (routeMeta.contentWidth) {
                dispatch(changeContentWidth('full'));
            }
            if (routeMeta.menuCollapsed) {
                dispatch(changeMenuCollapsedRedux(!routeMeta.menuCollapsed));
            }
            if (routeMeta.menuHidden) {
                dispatch(handleMenuHidden(!routeMeta.menuHidden));
            }
        }
    }, [dispatch, changeContentWidth, changeMenuCollapsedRedux, handleMenuHidden, routeMeta]);


    // ** ComponentDidMount
    useEffect(() => {
        if (routeMeta) {
            if (routeMeta.contentWidth) {
                dispatch(changeContentWidth(routeMeta.contentWidth));
            }
            if (routeMeta.menuCollapsed) {
                dispatch(changeMenuCollapsedRedux(routeMeta.menuCollapsed));
            }
            if (routeMeta.menuHidden) {
                dispatch(handleMenuHidden(routeMeta.menuHidden));
            }
        }
        return () => cleanUp();
    }, [dispatch, changeContentWidth, changeMenuCollapsedRedux, handleMenuHidden, routeMeta, cleanUp]);

    return (
        <>
            {wrapperClass === 'chat-application' ? (<ChatMenu />) : null}

            <div className={classNames({
                [wrapperClass]: wrapperClass,
                'show-overlay': navbarStore?.query?.length,
                'app-content': !currentPath?.startsWith('/apps/view_profile/vcard'),
                'content': !currentPath?.startsWith('/apps/view_profile/vcard'),
                'dark-theme': skin === 'dark',
                'light-theme': skin === 'light',
            })}>

                {/* <div className='content-overlay'></div> */}
                {currentPath !== '/login' && currentPath !== '/register' && <div className='header-navbar-shadow' />}

                <div className={classNames({
                    'content-wrapper': !appLayout,
                    'content-area-wrapper': appLayout,
                    'container-xxl p-0': contentWidth === 'boxed',
                    [`animate__animated animate__${transition}`]: transition !== 'none' && transition?.length,
                    'm-0': currentPath?.startsWith('/apps/view_profile/vcard')
                })}
                >

                    <Tag
                        {...(layout === 'HorizontalLayout' && !appLayout ? { className: classNames({ 'content-body': !appLayout }) } : {})}
                    >
                        {children}
                    </Tag>
                </div>

            </div>
        </>
    )
}

export default LayoutWrapper;
