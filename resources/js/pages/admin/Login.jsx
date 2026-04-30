import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const success = await login(email, password);
        if (success) navigate('/admin');
        else setError('Invalid credentials. Please try again.');
        setLoading(false);
    };

    const inp = {
        width: '100%', padding: '13px 16px 13px 42px', borderRadius: 10, outline: 'none',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
        color: '#fff', fontSize: 14, fontWeight: 500, transition: 'all 0.2s',
        boxSizing: 'border-box',
    };

    return (
        <div style={{ minHeight: '100vh', background: 'radial-gradient(at 0% 100%, #1e1b4b 0%, #020617 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: "'Inter','Outfit',system-ui,sans-serif", overflow: 'hidden', position: 'relative' }}>
            {/* Aurora orbs */}
            <div style={{ position: 'fixed', top: '-15%', left: '-10%', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.2), rgba(255,107,61,0.08), transparent 70%)', pointerEvents: 'none', animation: 'spin 18s linear infinite' }} />
            <div style={{ position: 'fixed', bottom: '-15%', right: '-10%', width: '35vw', height: '35vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.12), transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg,#2563eb,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 28px rgba(37,99,235,0.4)' }}>
                        <svg style={{ width: 26, height: 26, color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 28, margin: '0 0 6px', letterSpacing: '-0.5px' }}>Admin Access</h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 500 }}>Sign in to manage your garments store</p>
                </div>

                {/* Card */}
                <div style={{ background: 'rgba(13,13,26,0.95)', borderRadius: 18, padding: 32, border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
                    {error && (
                        <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', color: '#f87171', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
                            ⚠ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <svg style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(255,255,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="admin@store.com" style={inp} autoFocus
                                    onFocus={e => { e.target.style.border = '1px solid rgba(37,99,235,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)'; }}
                                    onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <svg style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(255,255,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••" style={{ ...inp, paddingRight: 44 }}
                                    onFocus={e => { e.target.style.border = '1px solid rgba(37,99,235,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)'; }}
                                    onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', padding: 4 }}>
                                    <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showPass
                                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                                        }
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, background: 'linear-gradient(135deg,#2563eb,#60a5fa)', color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: '0.02em', boxShadow: '0 6px 20px rgba(37,99,235,0.35)', transition: 'all 0.2s', marginTop: 4 }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 28px rgba(37,99,235,0.5)'; }}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.35)'}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                    <svg style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                                        <path style={{ opacity: 0.75 }} fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : 'Sign In to Dashboard →'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 24, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    🔒 Secure Admin Access
                </p>
            </div>
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Login;
