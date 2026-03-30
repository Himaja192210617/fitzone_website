import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import api from '../api/api';

const RegisterScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        age: '',
        gender: '',
        password: '',
        confirmPassword: '',
        role: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const roleOptions = [
        { label: "Gym User", value: "gym_user" },
        { label: "Gym Administrator", value: "gym_administrator" }
    ];


    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            const msg = "Passwords do not match";
            alert(msg);
            setError(msg);
            return;
        }

        // Name validation: should not contain numbers
        if (/\d/.test(formData.name)) {
            const msg = "Name should not contain numbers";
            alert(msg);
            setError(msg);
            return;
        }

        // Age validation: not more than 125
        if (parseInt(formData.age) > 125) {
            const msg = "Age cannot be more than 125";
            alert(msg);
            setError(msg);
            return;
        }

        // Email validation: should not start with a number
        if (/^\d/.test(formData.email)) {
            const msg = "Email address should not start with a number";
            alert(msg);
            setError(msg);
            return;
        }

        // Mobile validation: should start with 6, 7, 8, or 9 and be 10 digits
        if (!/^[6-9]/.test(formData.mobile)) {
            const msg = "Mobile number must start with 6, 7, 8, or 9";
            alert(msg);
            setError(msg);
            return;
        }
        if (!/^\d{10}$/.test(formData.mobile)) {
            const msg = "Mobile number must be exactly 10 digits";
            alert(msg);
            setError(msg);
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.post('/register', {
                name: formData.name,
                age: parseInt(formData.age),
                gender: formData.gender,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
                role: formData.role
            });
            navigate('/login');
        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            alert(msg);
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container">
            {/* Top Bar */}
            <header className="register-header">
                <button onClick={() => navigate('/login')} className="back-btn-glass">
                    <ArrowLeft size={20} color="#1BB85B" />
                </button>
                <span className="register-header-text">Join FitZone</span>
                <div style={{ width: 44 }}></div>
            </header>

            <div className="register-scroll-viewport">
                <div className="spacer-32"></div>

                <div className="text-center px-24">
                    <h1 className="register-hero-title">Create Account</h1>
                    <p className="register-hero-subtitle">Start your fitness journey today</p>
                </div>

                <div className="spacer-32"></div>

                <form onSubmit={handleRegister} className="register-form-premium">
                    <div className="input-group-modern">
                        <label className="label-modern">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            className="input-modern"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="spacer-20"></div>

                    <div className="row-group-modern">
                        <div className="input-group-modern flex-1">
                            <label className="label-modern">Age</label>
                            <input
                                name="age"
                                type="number"
                                className="input-modern"
                                placeholder="24"
                                value={formData.age}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="input-group-modern flex-1">
                            <label className="label-modern">Gender</label>
                            <div className="select-wrapper-modern">
                                <select
                                    name="gender"
                                    className="input-modern select-modern"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <ChevronDown className="select-arrow-modern" size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="spacer-20"></div>

                    <div className="input-group-modern">
                        <label className="label-modern">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            className="input-modern"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="spacer-20"></div>

                    <div className="input-group-modern">
                        <label className="label-modern">Mobile Number</label>
                        <input
                            name="mobile"
                            type="tel"
                            className="input-modern"
                            placeholder="9876543210"
                            value={formData.mobile}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="spacer-20"></div>

                    <div className="input-group-modern">
                        <label className="label-modern">Password</label>
                        <input
                            name="password"
                            type="password"
                            className="input-modern"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="spacer-20"></div>

                    <div className="input-group-modern">
                        <label className="label-modern">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            className="input-modern"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="spacer-20"></div>

                    <div className="input-group-modern">
                        <label className="label-modern">I am a</label>
                        <div className="select-wrapper-modern">
                            <select
                                name="role"
                                className="input-modern select-modern"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="" disabled>Select your role</option>
                                {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                            <ChevronDown className="select-arrow-modern" size={16} />
                        </div>
                    </div>

                    <div className="spacer-32"></div>

                    {error && (
                        <div className="error-alert-modern">
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-xl" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register Now'}
                    </button>

                    <div className="spacer-40"></div>
                </form>
            </div>

            <style jsx>{`
        @media (min-width: 1024px) {
          .register-header { display: none !important; }
          .main-container { justify-content: center; align-items: center; background: #F1F5F9; min-height: 100vh; }
          .register-scroll-viewport { 
            width: 100% !important;
            max-width: 600px !important; 
            background: white !important; 
            padding: 40px !important; 
            border-radius: 32px !important; 
            box-shadow: 0 20px 50px rgba(0,0,0,0.05) !important;
            margin: 40px 0 !important;
            height: auto !important;
            flex: initial !important;
          }
          .register-hero-title { font-size: 36px !important; }
        }

        .register-header {
          background-color: white;
          padding: 40px 16px 16px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #F3F4F6;
        }

        .back-btn-glass {
          width: 44px; height: 44px; background: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        .register-header-text { font-size: 15px; font-weight: 700; color: #111; }

        .register-scroll-viewport { flex: 1; overflow-y: auto; background: #FAFAFA; }

        .register-hero-title { font-size: 32px; font-weight: 800; color: #111; letter-spacing: -0.5px; margin: 0; }
        .register-hero-subtitle { font-size: 15px; color: #666; margin-top: 4px; }

        .register-form-premium { padding: 0 24px; }
        
        .input-group-modern { display: flex; flex-direction: column; gap: 8px; }
        .label-modern { font-size: 14px; font-weight: 600; color: #444; }
        
        .input-modern { 
          width: 100%; height: 56px; padding: 0 20px; background: white; 
          border: 1.5px solid #F0F0F0; border-radius: 16px; font-size: 15px; 
          transition: all 0.2s; 
        }
        .input-modern:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(27, 184, 91, 0.1); outline: none; }

        .row-group-modern { display: flex; gap: 16px; }
        
        .select-wrapper-modern { position: relative; }
        .select-modern { appearance: none; cursor: pointer; }
        .select-arrow-modern { position: absolute; right: 20px; top: 20px; color: #AAA; pointer-events: none; }

        .error-alert-modern { background: #FEF2F2; color: #B91C1C; padding: 14px; border-radius: 12px; font-size: 13px; font-weight: 500; text-align: center; margin-bottom: 20px; }
        
        .btn-xl { height: 56px; border-radius: 16px; font-size: 16px; font-weight: 700; }

        .text-center { text-align: center; }
        .px-24 { padding: 0 24px; }
        .flex-1 { flex: 1; }
      `}</style>
        </div>
    );
};

export default RegisterScreen;
