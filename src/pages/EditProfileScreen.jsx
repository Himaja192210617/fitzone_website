import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar as CalendarIcon, Camera, ChevronDown } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

import WebLayout from '../components/WebLayout';

const EditProfileScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, login } = useAuth();

    // Initial state from navigation or existing user
    const initialData = location.state || user || {};

    const [name, setName] = useState(initialData.name || '');
    const [email, setEmail] = useState(initialData.email || '');
    const [phone, setPhone] = useState(initialData.mobile || '');
    const [age, setAge] = useState(initialData.age?.toString() || '');
    const [gender, setGender] = useState(initialData.gender || '');
    const [isSaving, setIsSaving] = useState(false);
    const [showGenderMenu, setShowGenderMenu] = useState(false);

    const genderOptions = ["Male", "Female", "Other"];

    const handleSave = async () => {
        if (!name || !email) return;
        setIsSaving(true);
        try {
            const response = await api.post('/update-profile', {
                user_id: user.user_id,
                name,
                email,
                mobile: phone,
                age: parseInt(age),
                gender
            });
            // Update context
            login({ ...user, name, email, mobile: phone, age: parseInt(age), gender });
            navigate('/profile');
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                {/* Header */}
                <header className="app-header-premium">
                    <div className="header-content-flex">
                        <button onClick={() => navigate('/profile')} className="back-btn-modern mobile-only">
                            <ArrowLeft size={22} color="white" />
                        </button>
                        <div className="header-text-main">
                            <h1 className="header-title-premium">Edit Profile</h1>
                            <p className="header-subtitle-premium">Keep your details up to date</p>
                        </div>
                    </div>
                </header>


                <main className="content-area-premium">
                    <div className="section-px">
                        <div className="spacer-32"></div>

                        {/* Avatar Section */}
                        <div className="flex-center mb-40">
                            <div className="avatar-edit-box">
                                <div className="avatar-sphere">
                                    <span className="text-32 font-800 text-white">
                                        {name ? name.charAt(0).toUpperCase() : 'U'}
                                    </span>
                                </div>
                                <div className="edit-icon-overlay">
                                    <Camera size={18} color="white" />
                                </div>
                            </div>
                        </div>

                        <div className="card-premium">
                            <EditField
                                label="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<User size={18} />}
                                placeholder="Your Name"
                            />

                            <div className="spacer-20"></div>

                            <EditField
                                label="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail size={18} />}
                                placeholder="name@example.com"
                            />

                            <div className="spacer-20"></div>

                            <EditField
                                label="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                icon={<Phone size={18} />}
                                placeholder="10-digit mobile"
                            />

                            <div className="spacer-20"></div>

                            <div className="flex gap-16">
                                <div className="flex-1">
                                    <EditField
                                        label="Age"
                                        value={age}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*$/.test(val)) setAge(val);
                                        }}
                                        icon={<CalendarIcon size={18} />}
                                        placeholder="Age"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="label-tiny block mb-8 ml-4">Gender</label>
                                    <div className="relative">
                                        <div
                                            className="gender-select-fake"
                                            onClick={() => setShowGenderMenu(!showGenderMenu)}
                                        >
                                            <div className="flex items-center gap-12">
                                                <div className="field-icon-box">⚥</div>
                                                <span className={`text-15 font-600 ${gender ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    {gender || 'Select'}
                                                </span>
                                            </div>
                                            <ChevronDown size={16} color="#94A3B8" />
                                        </div>

                                        {showGenderMenu && (
                                            <div className="gender-dropdown-modern animate-pop">
                                                {genderOptions.map(opt => (
                                                    <div
                                                        key={opt}
                                                        className="gender-opt"
                                                        onClick={() => {
                                                            setGender(opt);
                                                            setShowGenderMenu(false);
                                                        }}
                                                    >
                                                        {opt}
                                                        {gender === opt && <Check size={14} color="var(--primary)" />}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="spacer-32"></div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving || !name || !email}
                            className="btn btn-primary btn-xl w-full"
                        >
                            {isSaving ? (
                                <div className="flex items-center gap-12">
                                    <div className="spinner-small"></div>
                                    <span>Updating...</span>
                                </div>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>

                    <div className="spacer-40"></div>
                </main>
            </div>

            <style jsx>{`
                .main-viewport { flex: 1; display: flex; flex-direction: column; background-color: #F8FAFC; }
                
                @media (min-width: 1024px) {
                    .main-viewport { background-color: transparent; }
                    .content-area-premium { max-width: 800px; margin: 0 auto; width: 100%; padding: 0 48px; }
                    .app-header-premium { padding: 60px 48px 40px !important; border-bottom-left-radius: 40px !important; border-bottom-right-radius: 40px !important; margin-bottom: 24px; }
                    .mobile-only { display: none !important; }
                    .section-px { padding: 0 !important; }
                }

                .section-px { padding: 0 24px; }
                
                .header-content-flex { display: flex; align-items: center; gap: 16px; }
                .back-btn-modern { background: rgba(255,255,255,0.1); border: none; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

                .avatar-edit-box { position: relative; }
                .avatar-sphere { 
                    width: 100px; height: 100px; 
                    background: linear-gradient(135deg, var(--primary) 0%, #15a34e 100%); 
                    border-radius: 35px;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 15px 30px rgba(27, 184, 91, 0.2);
                }
                .edit-icon-overlay { 
                    position: absolute; bottom: -8px; right: -8px; 
                    width: 36px; height: 36px; background: #1E293B; 
                    border: 3px solid white; border-radius: 12px; 
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }

                .gender-select-fake { 
                    height: 52px; background: #F8FAFC; border: 1.5px solid #F1F5F9; 
                    border-radius: 14px; display: flex; align-items: center; justify-content: space-between; 
                    padding: 0 16px; cursor: pointer; transition: all 0.2s;
                }
                .gender-select-fake:hover { border-color: #E2E8F0; background: white; }

                .gender-dropdown-modern { 
                    position: absolute; top: 60px; left: 0; right: 0; 
                    background: white; border-radius: 16px; border: 1.5px solid #F1F5F9; 
                    box-shadow: 0 15px 30px rgba(0,0,0,0.1); z-index: 50; overflow: hidden;
                }
                .gender-opt { 
                    padding: 14px 16px; font-size: 14px; font-weight: 600; color: #475569; 
                    display: flex; justify-content: space-between; align-items: center; cursor: pointer;
                }
                .gender-opt:hover { background: #F8FAFC; color: var(--primary); }

                .btn-xl { height: 56px; border-radius: 16px; font-size: 16px; font-weight: 800; }
                .spinner-small { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </WebLayout>
    );
};

const EditField = ({ label, value, onChange, icon, placeholder }) => (
    <div className="edit-field-group">
        <label className="label-tiny block mb-8 ml-4">{label}</label>
        <div className="input-modern-wrapper-grey">
            <div className="field-icon-box">
                {icon}
            </div>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="input-field-modern-clean"
            />
        </div>
        <style jsx>{`
            .label-tiny { font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.8px; }
            .input-modern-wrapper-grey { position: relative; display: flex; align-items: center; }
            .field-icon-box { position: absolute; left: 16px; color: #94A3B8; font-weight: 700; width: 24px; display: flex; justify-content: center; }
            .input-field-modern-clean { 
                width: 100%; height: 52px; padding: 0 16px 0 48px; 
                background: #F8FAFC; border: 1.5px solid #F1F5F9; border-radius: 14px; 
                font-size: 15px; font-weight: 600; color: #1E293B; transition: all 0.2s;
            }
            .input-field-modern-clean:focus { background: white; border-color: var(--primary); outline: none; box-shadow: 0 8px 16px rgba(27, 184, 91, 0.05); }
        `}</style>
    </div>
);

export default EditProfileScreen;
