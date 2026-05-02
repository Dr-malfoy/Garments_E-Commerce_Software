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
        <div className="p-8 space-y-12 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-[var(--admin-text-bright)]">Product <span className="text-[#2563eb]">Classifications.</span></h1>
                    <p className="text-[var(--admin-text-muted)] font-bold uppercase tracking-widest text-[10px] mt-1">Manage your store's taxonomy and category structure</p>
                </div>
                <button onClick={() => handleOpenModal()} 
                    className="px-8 py-4 bg-[#2563eb] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#f53003] transition-all shadow-xl shadow-[#2563eb]/20 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    New Category
                </button>
            </div>
            
            <div className="space-y-8">
                {/* Search Bar */}
                <div className="relative max-w-xl group">
                    <svg className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--admin-text-muted)] group-focus-within:text-[#2563eb] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        className="w-full pl-16 pr-8 py-5 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-3xl font-bold border border-[var(--admin-border)] focus:ring-2 focus:ring-[#2563eb]/20 focus:border-[#2563eb] transition-all outline-none" 
                        placeholder="Search classifications..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="p-24 text-center text-[var(--admin-text-muted)] text-[10px] uppercase font-black tracking-[0.4em] animate-pulse">Synchronizing Taxonomy...</div>
                ) : filteredCategories.length === 0 ? (
                    <div className="p-24 text-center bg-[var(--admin-card-bg)] border-2 border-dashed border-[var(--admin-border)] rounded-[48px]">
                        <div className="w-20 h-20 bg-[var(--admin-input-bg)] rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-[var(--admin-text-muted)]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                        </div>
                        <p className="text-[var(--admin-text-muted)] text-[10px] font-black uppercase tracking-widest">No classifications found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredCategories.map(category => (
                            <div key={category.id} 
                                className="group relative bg-[var(--admin-card-bg)] p-8 rounded-[40px] premium-shadow border border-[var(--admin-border)] hover:border-[#2563eb]/30 transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--admin-input-bg)] group-hover:bg-[#2563eb]/5 rounded-full -translate-y-1/2 translate-x-1/2 transition-colors"></div>
                                
                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-[#2563eb]/10 border border-[#2563eb]/20 flex items-center justify-center text-[#2563eb]">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleOpenModal(category)} className="w-10 h-10 rounded-xl bg-[var(--admin-input-bg)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:bg-[#2563eb] hover:text-white transition-all flex items-center justify-center">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(category.id)} className="w-10 h-10 rounded-xl bg-[var(--admin-input-bg)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:bg-[#ef4444] hover:text-white transition-all flex items-center justify-center">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black text-[var(--admin-text-bright)] mb-1">{category.name}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)]">#{category.id.toString().padStart(3, '0')} Classification</p>
                                </div>
                                
                                <div className="mt-8 pt-6 border-t border-[var(--admin-border)] flex items-center justify-between relative z-10">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[var(--admin-text-muted)]">Active Channel</span>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="bg-[var(--admin-card-bg)] w-full max-w-md rounded-[48px] p-12 premium-shadow my-auto animate-slide-up relative border border-[var(--admin-border)]">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center rounded-full bg-[var(--admin-input-bg)] hover:bg-[#f53003] text-[var(--admin-text-muted)] hover:text-white transition-all">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <div className="mb-12">
                            <h2 className="text-3xl font-black tracking-tight text-[var(--admin-text-bright)]">{selectedCategory ? 'Refine Label' : 'New Creation'}</h2>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] mt-1">{selectedCategory ? 'Update existing category data' : 'Define a new product group'}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--admin-text-muted)] ml-4">Category Designation</label>
                                <input 
                                    className={`w-full px-8 py-5 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-3xl font-bold border-none focus:ring-2 transition-all ${errorMsg ? 'ring-2 ring-red-500/50' : 'focus:ring-[#2563eb]/20'}`} 
                                    value={name} 
                                    onChange={e => { setName(e.target.value); setErrorMsg(''); }} 
                                    placeholder="e.g. Winter Essentials" 
                                    required 
                                />
                                {errorMsg && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest ml-4 mt-2">{errorMsg}</div>}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-[2] py-6 bg-[#2563eb] text-white rounded-[32px] font-black text-xs uppercase tracking-[0.4em] hover:bg-[#f53003] transition-all shadow-2xl shadow-[#2563eb]/20">
                                    {selectedCategory ? 'Apply Changes' : 'Confirm Entry'}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-6 bg-[var(--admin-input-bg)] text-[var(--admin-text-bright)] rounded-[32px] font-black text-xs uppercase tracking-[0.4em] border border-[var(--admin-border)] hover:bg-[var(--admin-border)] transition-all">
                                    Discard
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
