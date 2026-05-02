import React, { lazy } from 'react';

// Public Pages
const App = lazy(() => import('../pages/App'));
const Products = lazy(() => import('../pages/Products'));
const Checkout = lazy(() => import('../pages/Checkout'));
const TrackOrder = lazy(() => import('../pages/TrackOrder'));
const Contact = lazy(() => import('../pages/Contact'));

// Admin Pages
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminCategories = lazy(() => import('../pages/admin/Categories'));
const AdminProducts = lazy(() => import('../pages/admin/Products'));
const AdminOrders = lazy(() => import('../pages/admin/Orders'));
const AdminSettings = lazy(() => import('../pages/admin/Settings'));
const AdminCustomers = lazy(() => import('../pages/admin/Customers'));
const AdminInventory = lazy(() => import('../pages/admin/Inventory'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));
const AdminWebsite = lazy(() => import('../pages/admin/WebsiteSettings'));
const AdminPricing = lazy(() => import('../pages/admin/Pricing'));
const LogisticSettings = lazy(() => import('../pages/admin/LogisticSettings'));

// Pathao Courier Pages
const PathaoSettings = lazy(() => import('../pages/admin/Pathao/Settings'));
const PathaoStores = lazy(() => import('../pages/admin/Pathao/Stores'));
const PathaoOrders = lazy(() => import('../pages/admin/Pathao/Orders'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));

export const publicRoutes = [
    { path: '/', element: <App /> },
    { path: '/products', element: <Products /> },
    { path: '/track-order', element: <TrackOrder /> },
    { path: '/contact', element: <Contact /> },
    { path: '/checkout', element: <Checkout /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
];

export const adminRoutes = [
    { path: '', element: <AdminDashboard /> },
    { path: 'dashboard', element: <AdminDashboard /> },
    { path: 'categories', element: <AdminCategories /> },
    { path: 'products', element: <AdminProducts /> },
    { path: 'orders', element: <AdminOrders /> },
    { path: 'pricing', element: <AdminPricing /> },
    { path: 'settings', element: <AdminSettings /> },
    { path: 'customers', element: <AdminCustomers /> },
    { path: 'inventory', element: <AdminInventory /> },
    { path: 'reports', element: <AdminReports /> },
    { path: 'website', element: <AdminWebsite /> },
    { path: 'logistic-settings', element: <LogisticSettings /> },
    
    // Pathao Routes
    { path: 'pathao/settings', element: <PathaoSettings /> },
    { path: 'pathao/stores', element: <PathaoStores /> },
    { path: 'pathao/orders', element: <PathaoOrders /> },
];

