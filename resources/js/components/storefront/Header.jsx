import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ settings }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Products' },
        { to: '/track-order', label: 'Track Order' },
        { to: '/contact', label: 'Contact' }
    ];

    return (
        <>
            <header className={`sticky top-0 z-[100] transition-all duration-300 ${scrolled ? 'glass premium-shadow py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo & Name */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-11 h-11 bg-[#1b1b18] rounded-xl flex items-center justify-center overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
                                {settings.app_logo ? (
                                    <img src={`/storage/${settings.app_logo}`} alt="logo" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white font-black text-xl italic">{settings.app_name?.[0] || 'G'}</span>
                                )}
                            </div>
                            <span className="text-2xl font-black tracking-tight text-[#1b1b18] uppercase hidden sm:block">
                                {settings.app_name || 'Garments'}
                            </span>
                        </Link>

                        {/* Desktop Navigation Menu */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map(link => (
                                <Link 
                                    key={link.to} 
                                    to={link.to} 
                                    className={`px-6 py-2 text-sm font-extrabold uppercase tracking-widest transition-all rounded-full ${location.pathname === link.to ? 'bg-[#1b1b18] text-white' : 'text-[#706f6c] hover:text-[#1b1b18] hover:bg-black/5'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-3">
                            <Link to="/admin/login" className="hidden sm:flex px-6 py-2.5 bg-[#1b1b18] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#f53003] transition-all shadow-xl shadow-black/10">
                                Portal
                            </Link>
                            
                            {/* Mobile Toggle */}
                            <button 
                                onClick={() => setIsMenuOpen(true)}
                                className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl bg-black/5 hover:bg-black/10 transition-all"
                            >
                                <svg className="w-6 h-6 text-[#1b1b18]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8h16M4 16h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar / Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[200] lg:hidden">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)} />
                    
                    {/* Content */}
                    <aside className="absolute right-0 top-0 bottom-0 w-[300px] bg-white animate-slide-in-right flex flex-col p-8">
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-black/30">Navigation</span>
                            <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <nav className="flex flex-col gap-6">
                            {navLinks.map(link => (
                                <Link 
                                    key={link.to} 
                                    to={link.to} 
                                    className={`text-3xl font-black uppercase tracking-tighter transition-all ${location.pathname === link.to ? 'text-[#f53003]' : 'text-[#1b1b18] hover:translate-x-2'}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto pt-12 border-t border-black/5">
                            <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-6 leading-relaxed">
                                Experience premium craftsmanship and modern aesthetics.
                            </p>
                            <Link to="/admin/login" className="flex items-center justify-center w-full py-5 bg-[#1b1b18] text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-black/20">
                                Admin Portal
                            </Link>
                        </div>
                    </aside>
                </div>
            )}
        </>
    );
};

export default Header;
