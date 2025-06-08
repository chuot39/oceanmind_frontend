import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Suspense, lazy } from 'react'
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import reduxStore from './redux/redux';
import { ThemeProvider } from './utils/context/ThemeColors';
import IntlProviderWrapper from './utils/context/IntlProviderWrapper';
import Loading from './components/loader/Loading';
import { ErrorBoundary } from 'react-error-boundary';

// Error Fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <pre className="text-red-500 mb-4">{error.message}</pre>
            <button
                onClick={resetErrorBoundary}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Try again
            </button>
        </div>
    );
};

// Configure QueryClient with optimized settings
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // Data remains fresh for 5 minutes
            cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
            refetchOnWindowFocus: false, // Prevent refetch on window focus
            retry: (failureCount, error) => {
                // Don't retry on 403 or 404 errors
                if (error?.response?.status === 403 || error?.response?.status === 404) {
                    return false;
                }
                return failureCount < 2;
            },
            suspense: false, // Disable suspense mode
            useErrorBoundary: (error) => {
                // Only show error boundary for server errors (500+)
                return error?.response?.status >= 500;
            },
            onError: async (error) => {
                if (error?.response?.status === 403) {
                    // try {
                    //     // Try to refresh token
                    //     const refreshToken = localStorage.getItem('refreshToken');
                    //     if (refreshToken) {
                    //         // Call your refresh token API
                    //         const response = await fetch('/api/refresh-token', {
                    //             method: 'POST',
                    //             headers: {
                    //                 'Content-Type': 'application/json',
                    //             },
                    //             body: JSON.stringify({ refreshToken }),
                    //         });

                    //         if (response.ok) {
                    //             const data = await response.json();
                    //             // Save new tokens
                    //             localStorage.setItem('accessToken', data.accessToken);
                    //             localStorage.setItem('refreshToken', data.refreshToken);
                    //             // Retry failed queries
                    //             queryClient.invalidateQueries();
                    //         } else {
                    //             // Redirect to login if refresh token fails
                    //             window.location.href = '/login';
                    //         }
                    //     } else {
                    //         window.location.href = '/login';
                    //     }
                    // } catch (refreshError) {
                    //     window.location.href = '/login';
                    // }

                    console.log('error: ', error);
                }
            }
        }
    }
});

// const queryClient = new QueryClient();

const LazyApp = lazy(() => import('./App'));

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Provider store={reduxStore}>
            <IntlProviderWrapper>
                <Suspense fallback={<div className="flex justify-center items-center h-[calc(100vh-150px)]"><Loading /></div>}>
                    {/* <AbilityContext.Provider value={ability}> */}
                    <ThemeProvider>
                        <QueryClientProvider client={queryClient}>
                            {/* <BrowserRouter basename={process.env.REACT_APP_ROUTER_BASE_NAME || ""}> */}
                            <LazyApp />
                            {/* <ToastContainer
                                position="top-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="light"
                                style={{ zIndex: 9999 }}
                                enableMultiContainer
                                containerId="main-toast-container"
                            /> */}
                            {/* </BrowserRouter> */}
                        </QueryClientProvider>
                    </ThemeProvider>
                    {/* </AbilityContext.Provider> */}
                </Suspense>
            </IntlProviderWrapper>
        </Provider>
    </ErrorBoundary>
)