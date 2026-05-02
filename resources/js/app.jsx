import './bootstrap';
import '../css/app.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminLayout from './layouts/AdminLayout';
import { publicRoutes, adminRoutes } from './routes/routes';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, token, loading } = useAuth();
    
    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-black/5 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#f53003] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1b1b18] animate-pulse">Checking Access...</p>
            </div>
        </div>
    );

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

const rootElement = document.getElementById('app');
if (rootElement) {
    if (!window.reactRoot) {
        window.reactRoot = ReactDOM.createRoot(rootElement);
    }
    window.reactRoot.render(
        <React.StrictMode>
            <AuthProvider>
                <ThemeProvider>
                    <BrowserRouter>
                        <React.Suspense fallback={
                            <div className="h-screen w-full flex items-center justify-center bg-white">
                                <div className="flex flex-col items-center gap-6">
                                    <div className="relative w-16 h-16">
                                        <div className="absolute inset-0 border-4 border-black/5 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-[#f53003] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                </div>
                            </div>
                        }>
                            <Routes>
                                {/* Public Routes */}
                                {publicRoutes.map((route, index) => (
                                    <Route key={index} path={route.path} element={route.element} />
                                ))}

                                {/* Admin Protected Routes */}
                                <Route path="/admin" element={
                                    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                                        <AdminLayout />
                                    </ProtectedRoute>
                                }>
                                    {adminRoutes.map((route, index) => (
                                        <Route key={index} index={route.path === ''} path={route.path} element={route.element} />
                                    ))}
                                </Route>

                                {/* Catch-all Redirect */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </React.Suspense>
                    </BrowserRouter>
                </ThemeProvider>
            </AuthProvider>
        </React.StrictMode>
    );
}
