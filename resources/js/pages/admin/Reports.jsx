import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('/api/reports');
            setReports(response.data);
        } catch (error) {
            console.error('Failed to fetch reports', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Remove this feedback entry?')) return;
        try {
            await axios.delete(`/api/reports/${id}`);
            setReports(reports.filter(r => r.id !== id));
        } catch (error) {
            alert('Failed to delete report.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0 }}>Feedback Reports</h1>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Analyze customer feedback and contact inquiries</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                
                {/* Table Card */}
                <div style={{ background: 'rgba(13,13,26,0.95)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                    {['Date', 'Sender Info', 'Message Content', 'Action'].map(h => (
                                        <th key={h} style={{ padding: '16px 24px', textAlign: 'left', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="4" style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>Retrieving feedback ledger...</td></tr>
                                ) : reports.length === 0 ? (
                                    <tr><td colSpan="4" style={{ padding: 48, textAlign: 'center', color: 'rgba(255,255,255,0.2)' }}>No feedback reports currently available.</td></tr>
                                ) : reports.map((report, i) => (
                                    <tr key={report.id} style={{ borderBottom: i < reports.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{new Date(report.created_at).toLocaleDateString()}</div>
                                            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, marginTop: 4 }}>{new Date(report.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{report.name}</div>
                                            <div style={{ color: '#2563eb', fontSize: 11, fontWeight: 600, marginTop: 4 }}>{report.contact}</div>
                                        </td>
                                        <td style={{ padding: '20px 24px', maxWidth: 400 }}>
                                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6, fontWeight: 500 }}>
                                                {report.message}
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleDelete(report.id)} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                                                    onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; }}
                                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,99,235,0.08)'; e.currentTarget.style.color = '#2563eb'; }}
                                                >
                                                    <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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

export default Reports;
