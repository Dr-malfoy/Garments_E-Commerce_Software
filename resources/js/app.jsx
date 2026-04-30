import './bootstrap';
import '../css/app.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import App from './pages/App';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import AdminCategories from './pages/admin/Categories';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminSettings from './pages/admin/Settings';
import AdminCustomers from './pages/admin/Customers';
import AdminInventory from './pages/admin/Inventory';
import AdminReports from './pages/admin/Reports';
import AdminWebsite from './pages/admin/WebsiteSettings';
import AdminPricing from './pages/admin/Pricing';
import TrackOrder from './pages/TrackOrder';
import Contact from './pages/Contact';
import AdminLayout from './layouts/AdminLayout';

import { ThemeProvider } from './context/ThemeContext';

const ProtectedRoute = ({ children }) => {
    const { token, loading } = useAuth();
    
    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (!token) return <Navigate to="/admin/login" />;
    
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
                        <Routes>
                            <Route path="/" element={<App />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/track-order" element={<TrackOrder />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin" element={
                                <ProtectedRoute>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }>
                                <Route index element={<AdminDashboard />} />
                                <Route path="dashboard" element={<AdminDashboard />} />
                                <Route path="categories" element={<AdminCategories />} />
                                <Route path="products" element={<AdminProducts />} />
                                <Route path="orders" element={<AdminOrders />} />
                                <Route path="pricing" element={<AdminPricing />} />
                                <Route path="settings" element={<AdminSettings />} />
                                <Route path="customers" element={<AdminCustomers />} />
                                <Route path="inventory" element={<AdminInventory />} />
                                <Route path="reports" element={<AdminReports />} />
                                <Route path="website" element={<AdminWebsite />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </ThemeProvider>
            </AuthProvider>
        </React.StrictMode>
    );
}
