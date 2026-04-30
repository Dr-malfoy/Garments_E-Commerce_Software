import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/storefront/Header';
import Footer from '../components/storefront/Footer';

const Contact = () => {
    const [settings, setSettings] = useState({});
    const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get('/api/public/settings').then(res => setSettings(res.data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('/api/public/feedback', formData);
            setStatus({ type: 'success', message: 'Thank you! Your feedback has been received.' });
            setFormData({ name: '', contact: '', message: '' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen elegant-gradient-bg">
            <Header settings={settings} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 page-transition">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                    {/* Left: Contact Info */}
                    <div className="space-y-16 animate-fade-in">
                        <div className="space-y-6">
                            <div className="inline-block px-4 py-2 bg-black/5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-[#1b1b18]">
                                Contact Us
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-[#1b1b18]">
                                Let's Start a <br/> <span className="text-gradient">Conversation.</span>
                            </h1>
                            <p className="text-[#706f6c] text-xl font-bold max-w-md leading-relaxed">
                                Our team is ready to assist you with any inquiries or custom requests. Experience premium service.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-12 pt-8 border-t border-black/5">
                            <div className="space-y-4 group">
                                <div className="w-14 h-14 bg-[#1b1b18] rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <h4 className="text-lg font-black text-[#1b1b18]">Atelier</h4>
                                <p className="text-sm font-bold text-[#706f6c] leading-relaxed">123 Fashion Ave, <br/> Dhaka, Bangladesh</p>
                            </div>

                            <div className="space-y-4 group">
                                <div className="w-14 h-14 bg-[#1b1b18] rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <h4 className="text-lg font-black text-[#1b1b18]">Electronic Mail</h4>
                                <p className="text-sm font-bold text-[#706f6c] leading-relaxed">{settings.contact_email || 'hello@garments.com'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Feedback Form */}
                    <div className="glass p-12 md:p-16 rounded-[48px] premium-shadow animate-float">
                        <h3 className="text-3xl font-black tracking-tight mb-10 text-[#1b1b18]">Inquiry Form</h3>
                        
                        {status.message && (
                            <div className={`p-6 mb-10 rounded-2xl text-sm font-black uppercase tracking-widest ${status.type === 'success' ? 'bg-[#f53003] text-white' : 'bg-red-500 text-white'}`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">Identity</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-8 py-6 bg-white border-2 border-black/5 rounded-[24px] focus:border-[#1b1b18] outline-none text-sm font-bold transition-all shadow-sm" 
                                    placeholder="Full name"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">Reach</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.contact}
                                    onChange={e => setFormData({...formData, contact: e.target.value})}
                                    className="w-full px-8 py-6 bg-white border-2 border-black/5 rounded-[24px] focus:border-[#1b1b18] outline-none text-sm font-bold transition-all shadow-sm" 
                                    placeholder="Email or Phone"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] ml-2">Message</label>
                                <textarea 
                                    required 
                                    rows="4"
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    className="w-full px-8 py-6 bg-white border-2 border-black/5 rounded-[24px] focus:border-[#1b1b18] outline-none text-sm font-bold transition-all shadow-sm resize-none" 
                                    placeholder="How can we help?"
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full py-7 bg-[#1b1b18] text-white font-black text-xs uppercase tracking-[0.3em] rounded-[24px] hover:bg-[#f53003] transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-2xl"
                            >
                                {submitting ? 'Transmitting...' : 'Deliver Inquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer settings={settings} />
        </div>
    );
};

export default Contact;
