import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({});
    const [logoFile, setLogoFile] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    const [profileForm, setProfileForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const [profileMsg, setProfileMsg] = useState('');
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'employee' });
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchSettings();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (currentUser) {
            setProfileForm(prev => ({ ...prev, name: currentUser.name, email: currentUser.email }));
        }
    }, [currentUser]);

    const fetchSettings = async () => {
        try {
            const res = await axios.get('/api/settings');
            setSettings(res.data);
        } catch (err) {
            console.error('Failed to fetch settings', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    const saveSettings = async (e, textKeys) => {
        e.preventDefault();
        setLoading(true);
        setSaveMsg('');
        const fd = new FormData();
        textKeys.forEach(key => fd.append(key, settings[key] ?? ''));
        if (logoFile) fd.append('app_logo', logoFile);

        try {
            const res = await axios.post('/api/settings', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setSettings(res.data.settings ?? res.data);
            setLogoFile(null);
            setSaveMsg('✓ Configuration Updated');
        } catch (err) {
            setSaveMsg('✗ Save Failed');
        } finally {
            setLoading(false);
            setTimeout(() => setSaveMsg(''), 4000);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setProfileMsg('');
        try {
            await axios.post('/api/settings/profile', profileForm);
            setProfileMsg('✓ Profile Secured');
            setProfileForm(prev => ({ ...prev, password: '', password_confirmation: '' }));
        } catch (err) {
            setProfileMsg('✗ Update Error');
        } finally {
            setLoading(false);
            setTimeout(() => setProfileMsg(''), 4000);
        }
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) await axios.put(`/api/users/${editingUser.id}`, userForm);
            else await axios.post('/api/users', userForm);
            setIsUserModalOpen(false);
            setUserForm({ name: '', email: '', password: '', role: 'employee' });
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving user');
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Revoke access for this user?')) return;
        try {
            await axios.delete(`/api/users/${id}`);
            fetchUsers();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const inputStyle = {
        width: '100%', padding: '12px 16px', borderRadius: 10, outline: 'none',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
        color: '#fff', fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
    };

    const tabStyle = (id) => ({
        width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
        borderRadius: 12, border: 'none', cursor: 'pointer', textAlign: 'left',
        background: activeTab === id ? 'rgba(37,99,235,0.1)' : 'transparent',
        color: activeTab === id ? '#2563eb' : 'rgba(255,255,255,0.4)',
        fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
    });

    const tabs = [
        { id: 'general', label: 'Identity', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
        { id: 'courier', label: 'Logistics', icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' },
        { id: 'website', label: 'Web Store', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
        { id: 'profile', label: 'Admin Auth', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
        { id: 'roles', label: 'Team Access', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>System Infrastructure</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Fine-tune your garments software and manage team permissions</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', lgDirection: 'row', gap: 32 }}>
                
                {/* Sidebar & Content Container */}
                <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                    
                    {/* Tab Sidebar */}
                    <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={tabStyle(tab.id)}>
                                <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} /></svg>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Card */}
                    <div style={{ flex: 1, minWidth: 320, background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 24, padding: 40, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                        
                        {activeTab === 'general' && (
                            <form onSubmit={e => saveSettings(e, ['app_name'])} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Software Identity</h3>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>App Name</label>
                                    <input style={inputStyle} value={settings.app_name || ''} onChange={e => setSettings({...settings, app_name: e.target.value})} placeholder="e.g. Garments Elite" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Brand Logo</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                                        <div style={{ width: 64, height: 64, borderRadius: 12, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {logoFile ? <img src={URL.createObjectURL(logoFile)} style={{width: '100%', height: '100%', objectFit: 'contain'}} /> : settings.app_logo ? <img src={`/storage/${settings.app_logo}`} style={{width: '100%', height: '100%', objectFit: 'contain'}} /> : <span style={{fontSize: 24, fontWeight: 900}}>{settings.app_name?.[0] || 'G'}</span>}
                                        </div>
                                        <div>
                                            <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} style={{fontSize: 11, color: 'rgba(255,255,255,0.4)'}} />
                                            <p style={{fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 4}}>Transparent PNG preferred</p>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, alignSelf: 'flex-start', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>Save Changes</button>
                            </form>
                        )}

                        {activeTab === 'courier' && (
                            <form onSubmit={e => saveSettings(e, ['pathao_api_key', 'steadfast_api_key', 'karry_api_key'])} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Courier Gateway API</h3>
                                {['pathao', 'steadfast', 'karry'].map(key => (
                                    <div key={key}>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>{key} API KEY</label>
                                        <input style={inputStyle} value={settings[`${key}_api_key`] || ''} onChange={e => setSettings({...settings, [`${key}_api_key`]: e.target.value})} placeholder={`Enter your ${key} secret key`} />
                                    </div>
                                ))}
                                <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, alignSelf: 'flex-start', cursor: 'pointer' }}>Update API Keys</button>
                            </form>
                        )}

                        {activeTab === 'website' && (
                            <form onSubmit={e => saveSettings(e, ['hero_title', 'hero_desc', 'contact_email'])} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Public Interface Prefs</h3>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Support Email</label>
                                    <input style={inputStyle} value={settings.contact_email || ''} onChange={e => setSettings({...settings, contact_email: e.target.value})} placeholder="support@garments.com" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Home Hero Header</label>
                                    <input style={inputStyle} value={settings.hero_title || ''} onChange={e => setSettings({...settings, hero_title: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Hero Subtext</label>
                                    <textarea style={{ ...inputStyle, minHeight: 100, resize: 'none' }} value={settings.hero_desc || ''} onChange={e => setSettings({...settings, hero_desc: e.target.value})} />
                                </div>
                                <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, alignSelf: 'flex-start', cursor: 'pointer' }}>Save Settings</button>
                            </form>
                        )}

                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Admin Security</h3>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Current Login Name</label>
                                    <input style={inputStyle} value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>New Password (Secure)</label>
                                    <input type="password" style={inputStyle} value={profileForm.password} onChange={e => setProfileForm({...profileForm, password: e.target.value})} placeholder="••••••••" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Confirm New Password</label>
                                    <input type="password" style={inputStyle} value={profileForm.password_confirmation} onChange={e => setProfileForm({...profileForm, password_confirmation: e.target.value})} placeholder="••••••••" />
                                </div>
                                <button type="submit" disabled={loading} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, alignSelf: 'flex-start', cursor: 'pointer' }}>Update Admin Vault</button>
                            </form>
                        )}

                        {activeTab === 'roles' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Team Management</h3>
                                    <button onClick={() => { setEditingUser(null); setUserForm({ name: '', email: '', password: '', role: 'employee' }); setIsUserModalOpen(true); }}
                                        style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>+ Add Team Member</button>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {users.map(u => (
                                        <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 20, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14 }}>{u.name[0]}</div>
                                                <div>
                                                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{u.name}</div>
                                                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{u.email}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                                <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>{u.role}</span>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button onClick={() => { setEditingUser(u); setUserForm({ name: u.name, email: u.email, password: '', role: u.role }); setIsUserModalOpen(true); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>Edit</button>
                                                    <button onClick={() => deleteUser(u.id)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {saveMsg && (
                            <div style={{ position: 'fixed', bottom: 40, right: 40, background: '#fff', color: '#000', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 13, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', animation: 'fadeIn 0.3s' }}>
                                {saveMsg}
                            </div>
                        )}
                        {profileMsg && (
                            <div style={{ position: 'fixed', bottom: 40, right: 40, background: '#2563eb', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 13, boxShadow: '0 20px 40px rgba(37,99,235,0.4)', animation: 'fadeIn 0.3s' }}>
                                {profileMsg}
                            </div>
                        )}
                    </div>
                </div>

                {/* User Modal */}
                {isUserModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }} onClick={() => setIsUserModalOpen(false)} />
                        <div style={{ position: 'relative', width: '100%', maxWidth: 400, background: '#0d0d1a', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', padding: 32 }}>
                            <h3 style={{ margin: '0 0 24px', color: '#fff', fontWeight: 900 }}>{editingUser ? 'Edit Access' : 'Grant Access'}</h3>
                            <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Name</label>
                                    <input style={inputStyle} value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Email</label>
                                    <input style={inputStyle} type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Role</label>
                                    <select style={inputStyle} value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                                        <option value="admin" style={{background: '#0d0d1a'}}>Admin</option>
                                        <option value="manager" style={{background: '#0d0d1a'}}>Manager</option>
                                        <option value="employee" style={{background: '#0d0d1a'}}>Employee</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Password</label>
                                    <input type="password" style={inputStyle} value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} required={!editingUser} />
                                </div>
                                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                                    <button type="submit" style={{ flex: 1, background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', border: 'none', padding: 14, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Save Member</button>
                                    <button type="button" onClick={() => setIsUserModalOpen(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', padding: 14, borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
