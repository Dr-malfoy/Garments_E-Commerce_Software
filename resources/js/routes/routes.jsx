import React from 'react';
import App from '../pages/App';
import Products from '../pages/Products';
import Checkout from '../pages/Checkout';
import TrackOrder from '../pages/TrackOrder';
import Contact from '../pages/Contact';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminLogin from '../pages/admin/Login';
import AdminCategories from '../pages/admin/Categories';
import AdminProducts from '../pages/admin/Products';
import AdminOrders from '../pages/admin/Orders';
import AdminSettings from '../pages/admin/Settings';
import AdminCustomers from '../pages/admin/Customers';
import AdminInventory from '../pages/admin/Inventory';
import AdminReports from '../pages/admin/Reports';
import AdminWebsite from '../pages/admin/WebsiteSettings';
import AdminPricing from '../pages/admin/Pricing';
import LogisticSettings from '../pages/admin/LogisticSettings';

// Pathao Courier Pages
import PathaoSettings from '../pages/admin/Pathao/Settings';
import PathaoStores from '../pages/admin/Pathao/Stores';
import PathaoOrders from '../pages/admin/Pathao/Orders';

// Auth Pages (to be created/updated)
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

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
