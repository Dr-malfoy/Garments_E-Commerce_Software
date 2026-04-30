import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
    { to: '/admin/products', label: 'Products', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /> },
    { to: '/admin/categories', label: 'Categories', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /> },
    { to: '/admin/inventory', label: 'Inventory', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /> },
    { to: '/admin/orders', label: 'Orders', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> },
    { to: '/admin/pricing', label: 'Pricing', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { to: '/admin/customers', label: 'Customers', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
    { to: '/admin/reports', label: 'Reports', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { to: '/admin/website', label: 'Website', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /> },
    { to: '/admin/settings', label: 'Settings', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /> },
];

const Sidebar = ({ collapsed, setCollapsed, location, settings, isDarkMode }) => {
    const isActive = (to, exact) =>
        exact ? location.pathname === to : location.pathname.startsWith(to) && to !== '/admin'
            ? true : location.pathname === to;

    return (
        <aside style={{
            width: collapsed ? 80 : 260, height: '100vh', position: 'fixed', left: 0, top: 0,
            background: 'var(--admin-sidebar-bg)', 
            backdropFilter: 'var(--admin-glass-blur)',
            borderRight: '1px solid var(--admin-border)',
            display: 'flex', flexDirection: 'column', transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), background 0.3s', zIndex: 110
        }} className="desktop-sidebar">
            <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {settings.app_logo ? <img src={`/storage/${settings.app_logo}`} style={{ width: '70%', height: '70%' }} /> : <span style={{ color: '#fff', fontWeight: 900 }}>G</span>}
                </div>
                {!collapsed && <span style={{ color: 'var(--admin-text-bright)', fontWeight: 900, fontSize: 18, letterSpacing: '-0.5px' }}>{settings.app_name || 'GarmentsPro'}</span>}
            </div>

            <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
                {NAV.map(item => {
                    const active = isActive(item.to, item.exact);
                    return (
                        <Link key={item.to} to={item.to} style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12,
                            textDecoration: 'none', transition: 'all 0.2s',
                            background: active ? 'rgba(37,99,235,0.1)' : 'transparent',
                            color: active ? '#2563eb' : 'var(--admin-text-muted)',
                            justifyContent: collapsed ? 'center' : 'flex-start'
                        }}>
                            <svg style={{ width: 18, height: 18, flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                            {!collapsed && <span style={{ fontSize: 14, fontWeight: 700 }}>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div style={{ padding: 12, borderTop: '1px solid var(--admin-border)' }}>
                <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'var(--admin-input-bg)', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ width: 18, height: 18, transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>
        </aside>
    );
};

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [settings, setSettings] = useState({});
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebar, setMobileSidebar] = useState(false);
    const [lang, setLang] = useState('EN');

    useEffect(() => {
        axios.get('/api/settings').then(r => setSettings(r.data)).catch(() => {});
    }, []);

    useEffect(() => { setMobileSidebar(false); }, [location.pathname]);

    const handleLogout = async () => { await logout(); navigate('/admin/login'); };

    const breadcrumbs = () => {
        const paths = location.pathname.split('/').filter(x => x);
        const textColor = isDarkMode ? 'rgba(255,255,255,0.3)' : 'rgba(30,41,59,0.4)';
        const activeTextColor = isDarkMode ? '#fff' : '#1e293b';

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: textColor, fontSize: 12, fontWeight: 600 }}>
                <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#2563eb'} onMouseLeave={e => e.target.style.color = 'inherit'}>Dashboard</Link>
                {paths.slice(1).map((path, idx) => (
                    <React.Fragment key={idx}>
                        <span>→</span>
                        <span style={{ color: idx === paths.slice(1).length - 1 ? activeTextColor : 'inherit', textTransform: 'capitalize' }}>
                            {path.replace('-', ' ')}
                        </span>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const bgGradient = isDarkMode 
        ? 'radial-gradient(at 0% 100%, #1e1b4b 0%, #020617 100%)' 
        : 'linear-gradient(135deg, #ffffff 0%, #fef9e7 50%, #fdf5e6 100%)';

    const headerBg = isDarkMode ? 'rgba(2,6,23,0.3)' : 'rgba(255,255,255,0.7)';
    const textColor = isDarkMode ? '#e2e8f0' : '#1e293b';
    const borderColor = isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    return (
        <div className={!isDarkMode ? 'admin-theme-light' : 'admin-theme-dark'} style={{ 
            minHeight: '100vh', 
            background: 'var(--admin-bg)', 
            color: 'var(--admin-text)', 
            fontFamily: "'Inter','Outfit',system-ui,sans-serif", 
            display: 'flex', 
            transition: 'background 0.5s ease, color 0.3s' 
        }}>
            
            <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} location={location} settings={settings} isDarkMode={isDarkMode} />

            <div style={{ flex: 1, marginLeft: sidebarCollapsed ? 80 : 260, transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)', minWidth: 0 }}>
                <header style={{
                    height: 72, background: 'var(--admin-header-bg)', backdropFilter: 'var(--admin-glass-blur)',
                    borderBottom: '1px solid var(--admin-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0 32px', position: 'sticky', top: 0, zIndex: 100,
                    transition: 'background 0.3s'
                }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: 400 }} className="header-search">
                        <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'var(--admin-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input placeholder="Search records..." style={{ 
                            width: '100%', padding: '10px 12px 10px 42px', borderRadius: 10, 
                            background: 'var(--admin-input-bg)', border: '1px solid var(--admin-border)', 
                            color: 'var(--admin-text-bright)', fontSize: 13, outline: 'none' 
                        }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <button onClick={() => setLang(lang === 'EN' ? 'BN' : 'EN')} style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-muted)', fontWeight: 800, cursor: 'pointer', fontSize: 12 }}>{lang}</button>
                        <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer', transition: 'transform 0.3s' }} className="hover:scale-110">
                            {isDarkMode ? <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> : <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                        </button>
                        <div style={{ position: 'relative', cursor: 'pointer', color: 'var(--admin-text-muted)' }}>
                            <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            <span style={{ position: 'absolute', top: 0, right: 0, width: 6, height: 6, background: '#ef4444', borderRadius: '50%' }} />
                        </div>
                        <div onClick={handleLogout} style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                            {user?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <button onClick={() => setMobileSidebar(true)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }} className="mobile-only">
                            <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                </header>

                <div style={{ padding: '16px 32px', background: 'var(--admin-table-header)', borderBottom: '1px solid var(--admin-border)' }}>
                    {breadcrumbs()}
                </div>

                <main key={location.key} style={{ 
                    padding: '32px', maxWidth: 1600,
                    animation: 'fadeInUp 0.4s ease-out forwards'
                }}>
                    <Outlet />
                </main>
            </div>

            {mobileSidebar && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }} onClick={() => setMobileSidebar(false)}>
                    <aside style={{ width: 280, height: '100%', background: 'var(--admin-card-bg)', borderRight: '1px solid var(--admin-border)', padding: 24, display: 'flex', flexDirection: 'column', gap: 8, transition: 'background 0.3s' }} onClick={e => e.stopPropagation()}>
                        <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900 }}>G</div>
                            <span style={{ color: 'var(--admin-text-bright)', fontWeight: 900, fontSize: 18 }}>Navigation</span>
                        </div>
                        {NAV.map(item => {
                            const active = isActive(item.to, item.exact);
                            return (
                                <Link key={item.to} to={item.to} style={{
                                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12,
                                    textDecoration: 'none', fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
                                    background: active ? 'rgba(37,99,235,0.1)' : 'transparent',
                                    color: active ? '#2563eb' : 'var(--admin-text-muted)',
                                }}>
                                    <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </aside>
                </div>
            )}

            <style>{`
                .mobile-only { display: none; }
                @media (max-width: 1024px) {
                    .desktop-sidebar { display: none; }
                    .admin-main-content { margin-left: 0 !important; }
                    .mobile-only { display: block; }
                    .header-search { display: none; }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                ::-webkit-scrollbar { width: 4px; height: 4px; }
                ::-webkit-scrollbar-thumb { background: rgba(37,99,235,0.2); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default AdminLayout;
