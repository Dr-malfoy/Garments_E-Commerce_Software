import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PathaoSettings = () => {
    const [config, setConfig] = useState({
        client_id: '',
        client_secret: '',
        secret_token: '',
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-[#1b1b18]">Pathao <span className="text-[#f53003]">Courier</span></h1>
                    <p className="text-black/40 font-bold uppercase tracking-widest text-[10px] mt-1">Logistic Integration & Configuration</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Configuration Card */}
                <div className="bg-white rounded-[32px] p-8 premium-shadow border border-black/5">
                    <h3 className="text-xl font-black text-[#1b1b18] mb-6">API Credentials</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Client ID</label>
                            <input 
                                type="text" 
                                readOnly 
                                value={config.client_id}
                                className="w-full px-6 py-4 bg-black/5 rounded-2xl font-bold text-sm border-none focus:ring-0" 
                                placeholder="Defined in .env"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Client Secret</label>
                            <input 
                                type="password" 
                                readOnly 
                                value="••••••••••••••••"
                                className="w-full px-6 py-4 bg-black/5 rounded-2xl font-bold text-sm border-none focus:ring-0" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-4">Secret Unique Token</label>
                            <input 
                                type="text" 
                                readOnly 
                                value={config.secret_token}
                                className="w-full px-6 py-4 bg-[#f53003]/5 text-[#f53003] rounded-2xl font-bold text-sm border-none focus:ring-0" 
                                placeholder="Run 'php artisan set:pathao-courier' to generate"
                            />
                        </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                        <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-2">Setup Instructions</h4>
                        <ol className="text-[11px] text-blue-800/70 font-bold space-y-2 ml-4 list-decimal">
                            <li>Obtain Merchant API credentials from Pathao Merchant Portal.</li>
                            <li>Update <code>PATHAO_CLIENT_ID</code> and <code>PATHAO_CLIENT_SECRET</code> in your <code>.env</code> file.</li>
                            <li>Run <code>php artisan set:pathao-courier</code> in your terminal.</li>
                            <li>Follow the prompts to authorize and receive your <code>Secret Unique Token</code>.</li>
                            <li>Add the token to <code>PATHAO_SECRET_TOKEN</code> in <code>.env</code>.</li>
                        </ol>
                    </div>
                </div>

                {/* Status & Info Card */}
                <div className="bg-[#1b1b18] text-white rounded-[32px] p-8 premium-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#f53003]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                    
                    <h3 className="text-xl font-black mb-8 relative z-10">Integration Status</h3>
                    
                    <div className="space-y-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${config.secret_token ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/40'}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">API Connection</p>
                                <h4 className="text-lg font-black">{config.secret_token ? 'Connected' : 'Not Configured'}</h4>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white/40">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Webhook Endpoint</p>
                                <h4 className="text-sm font-bold opacity-60 break-all">{window.location.origin}/api/pathao/webhook</h4>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/10 mt-8">
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Quick Actions</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Test Connection</button>
                                <button className="py-4 bg-[#f53003] hover:bg-[#f53003]/80 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Sync Cities</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PathaoSettings;
