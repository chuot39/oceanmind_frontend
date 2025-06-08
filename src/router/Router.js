import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as AppRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Routers } from './routers';
import BlankLayout from '../core/layouts/BlankLayout';
import VerticalLayout from '../core/layouts/VerticalLayout';
import HorizontalLayout from '../core/layouts/HorizontalLayout';
import LayoutWrapper from '../core/layouts/layout-wrapper';
import useLayout from '../utils/hooks/useLayout';
import { useAuth } from '../utils/hooks/useAuth';
import Error from '../views/pages/misc/Error';
import Maintenance from '../views/pages/misc/Maintenance';
import NotAuthorized from '../views/pages/misc/NotAuthorized';
import DisConnect from '../views/pages/misc/DisConnect';
import Hamster from '@/components/loader/Hamster/Hamster';

const isUnderMaintenance = import.meta.env.VITE_MAINTENANCE === 'true' || false;

const Router = () => {
  const { layout, transition, changeTransitionRedux } = useLayout();
  const { isLoggedIn } = useAuth();
  const DefaultLayout = layout === 'horizontal' ? HorizontalLayout : VerticalLayout;
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [hasServerError, setHasServerError] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Kiểm tra lỗi server Strapi
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/users', {
          method: 'HEAD',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          setHasServerError(true);
        } else {
          setHasServerError(false);
        }
      } catch (error) {
        setHasServerError(true);
      }
    };

    // Kiểm tra server mỗi 30 giây
    // const serverCheckInterval = setInterval(checkServer, 300000);
    // checkServer(); // Kiểm tra ngay lập tức khi component mount

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      // clearInterval(serverCheckInterval);
    };
  }, []);

  // Render NotAuthorized khi mất mạng hoặc lỗi server
  if (isOffline) {
    return (
      <AppRouter basename={import.meta.env.VITE_BASENAME || "/"}>
        <Routes>
          <Route path="*" element={<BlankLayout><DisConnect /></BlankLayout>} />
        </Routes>
      </AppRouter>
    );
  }

  if (hasServerError) {
    return (
      <AppRouter basename={import.meta.env.VITE_BASENAME || "/"}>
        <Routes>
          <Route path="*" element={<BlankLayout><Error /></BlankLayout>} />
        </Routes>
      </AppRouter>
    );
  }



  // Nếu đang bảo trì, render component Maintenance
  if (isUnderMaintenance) {
    return (
      <AppRouter basename={import.meta.env.VITE_BASENAME || "/"}>
        <Routes>
          <Route path="*" element={<BlankLayout><Maintenance /></BlankLayout>} />
        </Routes>
      </AppRouter>
    );
  }

  const renderRoute = (route, index) => {
    const Layout = route.layout === 'BlankLayout' ? BlankLayout : DefaultLayout;
    const Component = route.component;
    return (
      <Route
        key={index}
        path={route.path}
        element={
          <LayoutWrapper
            layout={DefaultLayout}
            transition={transition}
            setTransition={changeTransitionRedux}
            {...(route.appLayout
              ? {
                appLayout: route.appLayout
              }
              : {})}
            {...(route.meta
              ? {
                routeMeta: route.meta
              }
              : {})}
            {...(route.className
              ? {
                wrapperClass: route.className
              }
              : {})}
          >
            <Layout>
              <Suspense fallback={<div className='flex justify-center items-center h-[80vh] '> <Hamster /> </div>}>
                {(((!isLoggedIn && route.meta?.authRoute) || (route.meta?.requiresAuth && !isLoggedIn)) && route.meta?.roles?.[0] === 'user') && <Navigate to="/login" />}
                {(((!isLoggedIn && route.meta?.authRoute) || (route.meta?.requiresAuth && !isLoggedIn)) && route.meta?.roles?.[0] === 'admin') && <Navigate to="/admin/login" />}
                <Component />
              </Suspense>
            </Layout>
          </LayoutWrapper>
        }
      />
    );
  };

  return (
    <AppRouter basename={import.meta.env.VITE_BASENAME || "/"}>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard/overview" /> : <Navigate to="/login" />} />
        {Routers.map(renderRoute)}
        <Route path="/maintenance" element={<BlankLayout><Maintenance /></BlankLayout>} />
        <Route path="*" element={<BlankLayout><Error /></BlankLayout>} />
      </Routes>
    </AppRouter>
  );
};

export default Router;