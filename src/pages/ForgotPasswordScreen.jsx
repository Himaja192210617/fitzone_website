import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, ShieldCheck } from 'lucide-react';
import api from '../api/api';

const ForgotPasswordScreen = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/forgot-password', { email });
            setStep(2);
            setMessage({ text: 'OTP sent to your email', type: 'success' });
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Email not found', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setStep(3);
    };

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            await api.post('/reset-password', { email, otp, password: newPassword });
            setMessage({ text: 'Password reset successful!', type: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setMessage({ text: err.response?.data?.message || 'Invalid OTP or expired', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-screen bg-f8 min-h-screen">
            <header className="page-header-simple px-16">
                <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')} className="back-btn">
                    <ArrowLeft size={24} color="#000" />
                </button>
                <h1 className="header-title-dark">Reset Password</h1>
            </header>

            <main className="p-24 flex flex-col items-center">
                <div className="spacer-20"></div>

                <div className="icon-circle-lg bg-green-light mb-24">
                    <span className="emoji-lg">🔐</span>
                </div>

                <h2 className="text-28 font-bold text-center mb-12">
                    {step === 1 ? 'Forgot Password?' : step === 2 ? 'Verify OTP' : 'New Password'}
                </h2>
                <p className="subtitle-14 text-center mb-32 max-w-sm">
                    {step === 1 ? 'Enter your registered email to receive a recovery OTP code.' :
                        step === 2 ? `Enter the 6-digit code sent to ${email}` :
                            'Create a new strong password for your account.'}
                </p>

                <div className="card-modern w-full max-w-md p-20 bg-white rounded-12 shadow-sm border-gray">
                    {message.text && (
                        <div className={`p-12 rounded-8 mb-16 text-12 text-center ${message.type === 'error' ? 'bg-red-light text-red' : 'bg-green-light text-green'}`}>
                            {message.text}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="flex flex-col gap-20">
                            <div className="input-group-modern">
                                <label>Email Address</label>
                                <div className="input-with-icon">
                                    <Mail className="input-icon" size={20} />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary h-56 rounded-12">
                                {loading ? 'Sending...' : 'Send OTP Code'}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="flex flex-col gap-20">
                            <div className="input-group-modern">
                                <label>Verification Code</label>
                                <div className="input-with-icon">
                                    <ShieldCheck className="input-icon" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="text-center tracking-widest font-bold text-20"
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary h-56 rounded-12">Continue</button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleReset} className="flex flex-col gap-20">
                            <div className="input-group-modern">
                                <label>New Password</label>
                                <div className="input-with-icon">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        placeholder="Min 6 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group-modern">
                                <label>Confirm New Password</label>
                                <div className="input-with-icon">
                                    <Lock className="input-icon" size={20} />
                                    <input
                                        type="password"
                                        placeholder="Repeat password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn btn-primary h-56 rounded-12">
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </main>

            <style jsx>{`
                @media (min-width: 1024px) {
                    .page-header-simple { display: none !important; }
                    .forgot-password-screen { display: flex; align-items: center; justify-content: center; background-color: #F1F5F9; }
                    main { 
                        background: white !important; 
                        padding: 48px !important; 
                        border-radius: 32px !important; 
                        box-shadow: 0 20px 50px rgba(0,0,0,0.05) !important;
                        width: 100% !important;
                        max-width: 500px !important;
                    }
                }
                .bg-red-light { background-color: #FFEBEE; }
                .bg-green-light { background-color: #E8F5E9; }
                .tracking-widest { letter-spacing: 0.5em; }
            `}</style>
        </div>
    );
};

export default ForgotPasswordScreen;
