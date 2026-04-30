import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WebsiteSettings = () => {
    const [activeTab, setActiveTab] = useState('new-arrival');
    const [settings, setSettings] = useState({
        hero_title: '',
        hero_desc: '',
        hero_image: null
    });
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // New Banner Form
    const [bannerForm, setBannerForm] = useState({ title: '', image: null, link: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [settingsRes, bannersRes] = await Promise.all([
                axios.get('/api/settings').catch(() => ({ data: {} })),
                axios.get('/api/banners').catch(() => ({ data: [] }))
            ]);
            setSettings(settingsRes.data || {});
            setBanners(bannersRes.data || []);
        } catch (error) {
            console.error('Failed to fetch website settings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append('hero_title', settings.hero_title || '');
            data.append('hero_desc', settings.hero_desc || '');
            if (settings.hero_image instanceof File) {
                data.append('hero_image', settings.hero_image);
            }
            
            await axios.post('/api/settings', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Hero section updated!');
        } catch (error) {
            alert('Failed to update settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleBannerSubmit = async (e) => {
        e.preventDefault();
        if (!bannerForm.image) return alert('Please select an image.');
        setSaving(true);
        try {
            const data = new FormData();
            data.append('title', bannerForm.title);
            data.append('image', bannerForm.image);
            data.append('link', bannerForm.link);
            
            await axios.post('/api/banners', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setBannerForm({ title: '', image: null, link: '' });
            fetchData();
        } catch (error) {
            alert('Failed to add banner.');
        } finally {
            setSaving(false);
        }
    };

    const deleteBanner = async (id) => {
        if (!confirm('Remove this offer banner?')) return;
        try {
            await axios.delete(`/api/banners/${id}`);
            setBanners(banners.filter(b => b.id !== id));
        } catch (error) {
            alert('Failed to delete banner.');
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px 16px', borderRadius: 10, outline: 'none',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
        color: '#fff', fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Website Management</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Control your storefront's dynamic content and promotions</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <button onClick={() => setActiveTab('new-arrival')}
                        style={{ padding: '0 0 16px', background: 'none', border: 'none', color: activeTab === 'new-arrival' ? '#2563eb' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}>
                        1. Hero Section
                        {activeTab === 'new-arrival' && <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 2, background: '#2563eb' }} />}
                    </button>
                    <button onClick={() => setActiveTab('offers')}
                        style={{ padding: '0 0 16px', background: 'none', border: 'none', color: activeTab === 'offers' ? '#2563eb' : 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}>
                        2. Offer Banners
                        {activeTab === 'offers' && <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 2, background: '#2563eb' }} />}
                    </button>
                </div>

                {activeTab === 'new-arrival' ? (
                    <div style={{ background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 32, maxWidth: 800 }}>
                        <form onSubmit={handleSettingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Hero Title</label>
                                        <input style={inputStyle} value={settings.hero_title || ''} onChange={e => setSettings({...settings, hero_title: e.target.value})} placeholder="e.g. New Summer Collection" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Hero Description</label>
                                        <textarea style={{ ...inputStyle, minHeight: 120, resize: 'none' }} value={settings.hero_desc || ''} onChange={e => setSettings({...settings, hero_desc: e.target.value})} placeholder="Write a catchy description for the hero section..." />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Background Banner</label>
                                    <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 12, height: 220, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                                        {settings.hero_image ? (
                                            <>
                                                <img src={settings.hero_image instanceof File ? URL.createObjectURL(settings.hero_image) : `/storage/${settings.hero_image}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button type="button" onClick={() => setSettings({...settings, hero_image: null})} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </>
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: 20 }}>
                                                <input type="file" onChange={e => setSettings({...settings, hero_image: e.target.files[0]})} style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }} />
                                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 8 }}>Recommended: 1920x800px</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" disabled={saving} style={{ background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', alignSelf: 'flex-start', boxShadow: '0 8px 20px rgba(37,99,235,0.3)', opacity: saving ? 0.7 : 1 }}>
                                {saving ? 'Saving...' : 'Save Hero Changes'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        {/* Banner Form */}
                        <div style={{ background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 32 }}>
                            <h3 style={{ margin: '0 0 24px', color: '#fff', fontSize: 18, fontWeight: 800 }}>Add Promotion Banner</h3>
                            <form onSubmit={handleBannerSubmit} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.5fr', gap: 16, alignItems: 'end' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Banner Label</label>
                                    <input style={inputStyle} value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} placeholder="e.g. 50% Off Banner" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Target Link</label>
                                    <input style={inputStyle} value={bannerForm.link} onChange={e => setBannerForm({...bannerForm, link: e.target.value})} placeholder="/collections/sale" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Image File</label>
                                    <input type="file" onChange={e => setBannerForm({...bannerForm, image: e.target.files[0]})} style={{ ...inputStyle, padding: 8 }} />
                                </div>
                                <button type="submit" disabled={saving} style={{ background: '#fff', color: '#000', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                                    {saving ? '...' : 'Add'}
                                </button>
                            </form>
                        </div>

                        {/* Banner Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                            {banners.map(banner => (
                                <div key={banner.id} style={{ background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
                                    <img src={`/storage/${banner.image}`} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                                    <div style={{ padding: 16 }}>
                                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{banner.title || 'Untitled'}</div>
                                        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 600, marginTop: 4 }}>{banner.link || 'Static Banner'}</div>
                                    </div>
                                    <button onClick={() => deleteBanner(banner.id)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(37,99,235,0.9)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                                        <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebsiteSettings;
