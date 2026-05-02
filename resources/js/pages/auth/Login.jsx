import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        
        const result = await login(email, password);
        
        if (result.success) {
            // Redirect to admin if they are admin, otherwise home
            // We can fetch user again or check the response
            // For now, let's just go to the intended destination or home
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } else {
            setError(result.message);
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
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18]">Welcome Back</h1>
                        <p className="text-black/40 text-sm font-bold uppercase tracking-widest mt-2">Enter your details to access</p>
                    </div>

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

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b1b18]">Password</label>
                                <Link to="/forgot-password" name="forgot-password-link" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f53003] hover:underline">Forgot?</Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-black/5 border-none rounded-2xl focus:ring-2 focus:ring-[#f53003]/20 transition-all font-bold text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-[#1b1b18] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f53003] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Signing In...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-black/5 text-center">
                        <p className="text-black/40 text-[10px] font-black uppercase tracking-widest">
                            Don't have an account?{' '}
                            <Link to="/register" name="register-link" className="text-[#f53003] hover:underline ml-1">Create One</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
