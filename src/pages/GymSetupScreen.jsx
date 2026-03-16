import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building,
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

import WebLayout from '../components/WebLayout';

const GymSetupScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        gymId: '',
        gymName: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        description: ''
    });

    React.useEffect(() => {
        const fetchGym = async () => {
            try {
                const response = await api.post('/get-gym-info', { admin_user_id: user.user_id });
                if (response.data) {
                    setFormData({
                        gymId: response.data.gym_id || '',
                        gymName: response.data.gym_name || '',
                        address: response.data.address || '',
                        city: response.data.city || '',
                        phone: response.data.phone || '',
                        email: response.data.email || '',
                        description: response.data.description || ''
                    });
                }
            } catch (err) {
                console.log("No existing gym found");
            }
        };
        if (user?.user_id) fetchGym();
    }, [user]);

    const isFormValid = formData.gymName && formData.address && formData.city && formData.phone.length === 10 && formData.email.includes('@');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setLoading(true);
        try {
            const hasExistingGym = formData.gymId; // We should probably store gymId in state if fetched
            const endpoint = hasExistingGym ? '/update-gym-info' : '/setup-gym';
            
            const payload = {
                ...formData,
                gym_id: formData.gymId,
                gym_name: formData.gymName,
                gym_admin_id: user.user_id
            };

            const response = await api.post(endpoint, payload);
            
            const nextGymId = response.data.gym_id || formData.gymId;
            navigate('/configure-hours', { state: { gymId: nextGymId } });
        } catch (err) {
            alert(err.response?.data?.message || "Failed to save gym details");
        } finally {
            setLoading(false);
        }
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                {/* Header */}
                <header className="app-header-premium">
                    <div className="header-content">
                        <span className="header-tag">Step 1 of 3</span>
                        <h1 className="header-title-premium">Gym Setup</h1>
                        <p className="header-subtitle-premium">Enter your business details</p>
                    </div>
                </header>


                <main className="content-area-premium">
                    <div className="section-px">
                        <div className="spacer-32"></div>

                        {/* Illustration/Icon Area */}
                        <div className="flex-center mb-32">
                            <div className="illustration-sphere-blue">
                                <Building size={48} color="white" strokeWidth={1.5} />
                            </div>
                        </div>

                        <form className="setup-form-modern" onSubmit={handleSubmit}>
                            <div className="input-group-premium">
                                <label className="label-modern">Gym Name</label>
                                <div className="input-modern-wrapper">
                                    <div className="input-icon">
                                        <Building size={20} color="#94A3B8" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g. fitZone Elite"
                                        className="input-modern-clean"
                                        value={formData.gymName}
                                        onChange={e => setFormData({ ...formData, gymName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="spacer-20"></div>

                            <div className="input-group-premium">
                                <label className="label-modern">Address & City</label>
                                <div className="input-modern-wrapper mb-12">
                                    <div className="input-icon">
                                        <MapPin size={20} color="#94A3B8" />
                                    </div>
                                    <textarea
                                        placeholder="Complete street address"
                                        className="textarea-modern-clean"
                                        rows="2"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    ></textarea>
                                </div>
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="input-modern-clean"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>

                            <div className="spacer-20"></div>

                            <div className="input-group-premium">
                                <label className="label-modern">Contact Information</label>
                                <div className="input-modern-wrapper mb-12">
                                    <div className="input-icon">
                                        <Phone size={20} color="#94A3B8" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="10-digit Phone"
                                        maxLength="10"
                                        className="input-modern-clean"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="input-modern-wrapper">
                                    <div className="input-icon">
                                        <Mail size={20} color="#94A3B8" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="Business Email"
                                        className="input-modern-clean"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="spacer-32"></div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-xl w-full"
                                disabled={!isFormValid || loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-12">
                                        <div className="spinner-small"></div>
                                        <span>Saving Profile...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-8">
                                        <span>Configure Sessions</span>
                                        <ChevronRight size={20} />
                                    </div>
                                )}
                            </button>

                            <div className="spacer-40"></div>
                        </form>
                    </div>
                </main>
            </div>

            <style jsx>{`
                .main-viewport { flex: 1; display: flex; flex-direction: column; background-color: #F8FAFC; }
                
                @media (min-width: 1024px) {
                    .main-viewport { background-color: transparent; }
                    .content-area-premium { max-width: 800px; margin: 0 auto; width: 100%; padding: 0 48px; }
                    .app-header-premium { padding: 60px 48px 40px !important; border-bottom-left-radius: 40px !important; border-bottom-right-radius: 40px !important; margin-bottom: 24px; }
                    .section-px { padding: 0 !important; }
                }

                .section-px { padding: 0 24px; }
                
                .header-tag { font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1.5px; }

                .illustration-sphere-blue { 
                    width: 100px; height: 100px; 
                    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); 
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2);
                    animation: morph-blue 8s ease-in-out infinite;
                }

                @keyframes morph-blue {
                    0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                }

                .input-modern-wrapper { position: relative; display: flex; align-items: center; }
                .input-icon { position: absolute; left: 16px; z-index: 1; }
                
                .label-modern { font-size: 13px; font-weight: 700; color: #64748B; margin-bottom: 8px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }

                .input-modern-clean, .textarea-modern-clean { 
                    width: 100%; height: 56px; 
                    padding: 0 16px 0 48px; 
                    background: #F1F5F9; 
                    border: 1.5px solid transparent; 
                    border-radius: 16px; 
                    font-size: 15px; 
                    font-weight: 500;
                    color: #1E293B;
                    transition: all 0.2s;
                }
                .textarea-modern-clean { height: auto; padding: 16px 16px 16px 48px; resize: none; }

                .input-modern-clean:focus, .textarea-modern-clean:focus { 
                    background: white; 
                    border-color: var(--primary); 
                    box-shadow: 0 8px 16px rgba(27, 184, 91, 0.08);
                    outline: none;
                }

                .btn-xl { height: 56px; border-radius: 16px; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; }

                .spinner-small { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .login-footer {
                  margin-top: auto;
                  padding-bottom: 24px;
                  text-align: center;
                  color: #888;
                  font-size: 13px;
                  font-weight: 600;
                  letter-spacing: 0.5px;
                  text-transform: uppercase;
                }
            `}</style>
        </WebLayout>
    );
};

export default GymSetupScreen;
