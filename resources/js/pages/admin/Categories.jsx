import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [name, setName] = useState('');
    const [search, setSearch] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setSelectedCategory(category);
            setName(category.name);
        } else {
            setSelectedCategory(null);
            setName('');
        }
        setIsModalOpen(true);
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedCategory) {
                await axios.put(`/api/categories/${selectedCategory.id}`, { name });
            } else {
                await axios.post('/api/categories', { name });
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Failed to save category', error);
            if (error.response?.status === 422) {
                setErrorMsg('This category already exists or the name is invalid.');
            } else if (error.response?.status === 429) {
                setErrorMsg('Too many requests. Please wait a moment.');
            } else {
                setErrorMsg('Failed to save. Please check your connection.');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this category?')) {
            try {
                await axios.delete(`/api/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error('Failed to delete category', error);
            }
        }
    };

    const filteredCategories = categories.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const inputStyle = {
        width: '100%', padding: '14px 18px', borderRadius: 14, outline: 'none',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        color: '#fff', fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Product Classifications</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Manage your store's taxonomy and category structure</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                
                {/* Search & Action Bar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
                        <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(255,255,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input 
                            style={{ ...inputStyle, paddingLeft: 46 }} 
                            placeholder="Search categories..." 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <button onClick={() => handleOpenModal()} 
                        style={{ background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 14, fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 10px 25px rgba(37,99,235,0.35)', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                        <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                        Create Category
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={{ padding: 100, textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Synchronizing Taxonomy...
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div style={{ padding: 80, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 24 }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>📂</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontWeight: 600 }}>No categories matching your search.</div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                        {filteredCategories.map(category => (
                            <div key={category.id} 
                                style={{ background: 'rgba(13,13,26,0.8)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 28, position: 'relative', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', cursor: 'default' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(13,13,26,0.95)';
                                    e.currentTarget.style.border = '1px solid rgba(37,99,235,0.3)';
                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'rgba(13,13,26,0.8)';
                                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Decorative Glow */}
                                <div style={{ position: 'absolute', top: -40, right: -40, width: 100, height: 100, background: 'radial-gradient(circle, rgba(37,99,235,0.15), transparent 70%)', borderRadius: '50%' }} />

                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                        <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => handleOpenModal(category)} style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                        >
                                            <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(category.id)} style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.1)', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#2563eb'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.background = 'rgba(37,99,235,0.05)'; }}
                                        >
                                            <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ color: '#fff', fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{category.name}</div>
                                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        #{category.id.toString().padStart(3, '0')} Classification
                                    </div>
                                </div>
                                
                                <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 600 }}>Active Status</span>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px rgba(34,197,94,0.5)' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(16px)' }} onClick={() => setIsModalOpen(false)} />
                        <div style={{ position: 'relative', width: '100%', maxWidth: 440, background: 'rgba(13,13,26,0.98)', borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 120px rgba(0,0,0,0.9)', overflow: 'hidden' }}>
                            <div style={{ padding: '32px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h2 style={{ margin: 0, color: '#fff', fontSize: 24, fontWeight: 900 }}>{selectedCategory ? 'Refine Label' : 'New Classification'}</h2>
                                    <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 500 }}>{selectedCategory ? 'Update existing category data' : 'Define a new product group'}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 12, width: 40, height: 40, cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} style={{ padding: 40 }}>
                                <div style={{ marginBottom: 32 }}>
                                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 12, letterSpacing: '0.1em' }}>Category Designation</label>
                                    <input 
                                        style={{ ...inputStyle, background: 'rgba(255,255,255,0.02)', border: errorMsg ? '1px solid rgba(245,48,3,0.4)' : '1px solid rgba(255,255,255,0.08)' }} 
                                        value={name} 
                                        onChange={e => { setName(e.target.value); setErrorMsg(''); }} 
                                        placeholder="e.g. Winter Essentials" 
                                        required 
                                        autoFocus 
                                        onFocus={e => e.target.style.border = '1px solid rgba(37,99,235,0.4)'}
                                        onBlur={e => e.target.style.border = errorMsg ? '1px solid rgba(245,48,3,0.4)' : '1px solid rgba(255,255,255,0.08)'}
                                    />
                                    {errorMsg && <div style={{ color: '#f87171', fontSize: 12, marginTop: 8, fontWeight: 600 }}>⚠ {errorMsg}</div>}
                                </div>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <button type="submit" style={{ flex: 2, background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', border: 'none', padding: 16, borderRadius: 16, fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: '0 10px 30px rgba(37,99,235,0.3)' }}>
                                        {selectedCategory ? 'Apply Changes' : 'Confirm Entry'}
                                    </button>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
