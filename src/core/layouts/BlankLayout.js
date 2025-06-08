import classNames from "classnames";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const BlankLayout = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false);
    const { skin } = useSelector(state => state.app);
    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    console.log('call to blank', children);

    if (!isMounted) {
        return null;
    }

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
    );
};


export default BlankLayout;
