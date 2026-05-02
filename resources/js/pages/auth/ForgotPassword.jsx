import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatus('');
        setIsSubmitting(true);

        try {
            // Note: This requires Laravel's built-in password reset functionality to be configured
            const response = await axios.post('/api/forgot-password', { email });
            setStatus(response.data.message || 'Reset link sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center elegant-gradient-bg p-6">
            <div className="w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-10 premium-shadow border border-white/20">
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-block mb-6">
                            <span className="text-2xl font-black uppercase tracking-[0.3em] text-[#1b1b18]">GarmentsPro</span>
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18]">Reset Password</h1>
                        <p className="text-black/40 text-sm font-bold uppercase tracking-widest mt-2">We'll send you recovery instructions</p>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-600 text-xs font-bold text-center">
                            {status}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-[#f53003]/5 border border-[#f53003]/20 rounded-2xl text-[#f53003] text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b1b18] ml-4">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 bg-black/5 border-none rounded-2xl focus:ring-2 focus:ring-[#f53003]/20 transition-all font-bold text-sm"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-[#1b1b18] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f53003] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Sending...
                                </span>
                            ) : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-black/5 text-center">
                        <p className="text-black/40 text-[10px] font-black uppercase tracking-widest">
                            Remember your password?{' '}
                            <Link to="/login" name="back-to-login" className="text-[#f53003] hover:underline ml-1">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
