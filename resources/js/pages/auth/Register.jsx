import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        const result = await register(formData);
        
        if (result.success) {
            navigate('/');
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
                        <h1 className="text-3xl font-black tracking-tight text-[#1b1b18]">Join Us</h1>
                        <p className="text-black/40 text-sm font-bold uppercase tracking-widest mt-2">Create your premium account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-[#f53003]/5 border border-[#f53003]/20 rounded-2xl text-[#f53003] text-xs font-bold text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b1b18] ml-4">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-black/5 border-none rounded-2xl focus:ring-2 focus:ring-[#f53003]/20 transition-all font-bold text-sm"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b1b18] ml-4">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-black/5 border-none rounded-2xl focus:ring-2 focus:ring-[#f53003]/20 transition-all font-bold text-sm"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b1b18] ml-4">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-black/5 border-none rounded-2xl focus:ring-2 focus:ring-[#f53003]/20 transition-all font-bold text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1b1b18] ml-4">Confirm Password</label>
                            <input
                                type="password"
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-black/5 border-none rounded-2xl focus:ring-2 focus:ring-[#f53003]/20 transition-all font-bold text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-[#1b1b18] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-[#f53003] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-black/5 text-center">
                        <p className="text-black/40 text-[10px] font-black uppercase tracking-widest">
                            Already have an account?{' '}
                            <Link to="/login" name="login-link" className="text-[#f53003] hover:underline ml-1">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
