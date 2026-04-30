import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStarred, setFilterStarred] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Failed to fetch customers', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStar = async (id) => {
        try {
            const response = await axios.patch(`/api/customers/${id}/toggle-star`);
            setCustomers(customers.map(c => c.id === id ? { ...c, is_starred: response.data.is_starred } : c));
        } catch (error) {
            console.error('Failed to toggle star', error);
        }
    };

    const deleteCustomer = async (id) => {
        if (window.confirm('Delete this customer profile permanently?')) {
            try {
                await axios.delete(`/api/customers/${id}`);
                setCustomers(customers.filter(c => c.id !== id));
            } catch (error) {
                console.error('Failed to delete customer', error);
            }
        }
    };

    const filteredCustomers = customers.filter(c => {
        const matchesSearch = (c.name || '').toLowerCase().includes(search.toLowerCase()) || (c.phone || '').includes(search);
        const matchesStarred = filterStarred ? c.is_starred : true;
        return matchesSearch && matchesStarred;
    });

    const inputStyle = {
        width: '100%', padding: '14px 16px 14px 44px', borderRadius: 12, outline: 'none',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        color: '#fff', fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Customer Directory</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Manage your client base and loyalty status</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Search & Filter */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
                        <svg style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: 'rgba(255,255,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input style={inputStyle} placeholder="Search by client name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <button onClick={() => setFilterStarred(!filterStarred)}
                        style={{ background: filterStarred ? '#2563eb' : 'rgba(255,255,255,0.05)', color: '#fff', border: filterStarred ? 'none' : '1px solid rgba(255,255,255,0.1)', padding: '12px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {filterStarred ? '★ Starred Only' : '☆ Filter Starred'}
                    </button>
                </div>

                {/* Table Card */}
                <div style={{ background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    <th style={{ padding: '16px 20px', textAlign: 'left', width: 50, borderBottom: '1px solid rgba(255,255,255,0.05)' }}><span style={{fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.2)'}}>#</span></th>
                                    {['Identity', 'Logistics Info', 'Orders', 'Total Billing', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '16px 20px', textAlign: 'left', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Loading directory...</td></tr>
                                ) : filteredCustomers.length === 0 ? (
                                    <tr><td colSpan="6" style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>No customer profiles found.</td></tr>
                                ) : filteredCustomers.map((customer, i) => (
                                    <tr key={customer.id} style={{ borderBottom: i < filteredCustomers.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '16px 20px' }}>
                                            <button onClick={() => toggleStar(customer.id)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: customer.is_starred ? '#2563eb' : 'rgba(255,255,255,0.1)', transition: 'all 0.2s' }}>
                                                {customer.is_starred ? '★' : '☆'}
                                            </button>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>{customer.name?.[0]?.toUpperCase() || '?'}</div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{customer.name}</div>
                                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, marginTop: 2 }}>{customer.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500 }}>{customer.district}, {customer.thana}</div>
                                            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>{customer.area}</div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 800, background: 'rgba(37,99,235,0.1)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.2)' }}>
                                                {customer.orders_count || 0} Orders
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ fontWeight: 800, color: '#fff', fontSize: 15 }}>৳{parseFloat(customer.orders_sum_total_amount || 0).toLocaleString()}</div>
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                <button onClick={() => deleteCustomer(customer.id)} style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Customers;
