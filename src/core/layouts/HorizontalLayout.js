import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const HorizontalLayout = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false);
    const { skin } = useSelector(state => state.app);
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, [])

    if (!isMounted) {
        return null;
    }
    console.log('call to horizontal');

    return (
        <div className={classNames('blank-layout', {

            'dark-layout': skin === 'dark'
        })}>
            <div className="app-content content">
                <div className="content-wrapper">
                    <div className="content-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HorizontalLayout;
