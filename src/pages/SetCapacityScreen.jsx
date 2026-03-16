import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    Users,
    Check,
    Info
} from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import WebLayout from '../components/WebLayout';

const SetCapacityScreen = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const gymId = location.state?.gymId;

    const [loading, setLoading] = useState(false);
    const [capacity, setCapacity] = useState('25');

    const handleComplete = async () => {
        if (!capacity || parseInt(capacity) <= 0) return;

        setLoading(true);
        try {
            await api.post('/set-slot-capacity', { admin_user_id: user.user_id, capacity: parseInt(capacity) });
            navigate('/admin-dashboard');
        } catch (err) {
            alert("Failed to set capacity");
        } finally {
            setLoading(false);
        }
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                {/* Header */}
                <header className="app-header-premium">
                    <div className="header-content-flex">
                        <button onClick={() => navigate(-1)} className="back-btn-modern">
                            <ArrowLeft size={22} color="white" />
                        </button>
                        <div className="header-text-main">
                            <h1 className="header-title-premium">Set Capacity</h1>
                            <p className="header-subtitle-premium">Step 3 of 3 • Final Step</p>
                        </div>
                    </div>
                </header>

                <main className="content-area-premium">
                    <div className="section-px">
                        <div className="spacer-32"></div>

                        {/* Illustration/Icon Area */}
                        <div className="flex-center mb-32">
                            <div className="illustration-sphere">
                                <Users size={48} color="white" strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Intro Text */}
                        <div className="text-center mb-32">
                            <h2 className="title-bolt text-24 mb-8">What's your limit?</h2>
                            <p className="text-grey text-15 px-20">Set the maximum number of people that can work out in one session.</p>
                        </div>

                        {/* Info Card */}
                        <div className="card-premium mb-24 bg-light-green">
                            <div className="flex items-start gap-12">
                                <div className="info-icon-box">
                                    <Info size={18} color="var(--primary)" />
                                </div>
                                <div>
                                    <h4 className="font-700 text-15 mb-4 text-green-dark">Why set capacity?</h4>
                                    <p className="text-13 text-grey-dark line-15">
                                        This value helps our AI predict crowd levels. When bookings reach this limit, the slot will show as "Full".
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Input Section */}
                        <div className="card-premium mb-32">
                            <label className="label-modern mb-12 block">Max Members Per Slot</label>
                            <div className="input-modern-wrapper">
                                <div className="input-icon">
                                    <Users size={20} color="#94A3B8" />
                                </div>
                                <input
                                    type="number"
                                    placeholder="e.g. 25"
                                    className="input-modern-clean"
                                    value={capacity}
                                    onChange={e => setCapacity(e.target.value)}
                                />
                            </div>
                            <p className="text-12 text-grey-light mt-12 italic">
                                Recommended: 15-30 members depending on your gym size.
                            </p>
                        </div>

                        <button
                            onClick={handleComplete}
                            className="btn btn-primary btn-xl"
                            disabled={loading || !capacity}
                        >
                            {loading ? (
                                <div className="flex items-center gap-12">
                                    <div className="spinner-small"></div>
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-8">
                                    <Check size={20} />
                                    <span>Complete Setup</span>
                                </div>
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
                    .content-area-premium { max-width: 600px; margin: 0 auto; width: 100%; padding: 0 48px; }
                    .app-header-premium { padding: 60px 48px 40px !important; border-bottom-left-radius: 40px !important; border-bottom-right-radius: 40px !important; margin-bottom: 24px; }
                    .section-px { padding: 0 !important; }
                }

                .section-px { padding: 0 24px; }
                
                .header-content-flex { display: flex; align-items: center; gap: 16px; }
                .back-btn-modern { background: rgba(255,255,255,0.1); border: none; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .header-text-main { flex: 1; }

                .illustration-sphere { 
                    width: 100px; height: 100px; 
                    background: linear-gradient(135deg, var(--primary) 0%, #15a34e 100%); 
                    border-radius: 40% 60% 70% 30% / 40% 50% 60% 70%;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 20px 40px rgba(27, 184, 91, 0.2);
                    animation: morph 8s ease-in-out infinite;
                }

                @keyframes morph {
                    0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 70%; }
                    50% { border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; }
                    100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 70%; }
                }

                .bg-light-green { background: #ECFDF5; border: 1px solid #D1FAE5; }
                .text-green-dark { color: #065F46; }
                .text-grey-dark { color: #374151; }
                .info-icon-box { background: white; width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

                .input-modern-wrapper { position: relative; display: flex; align-items: center; }
                .input-icon { position: absolute; left: 16px; pointer-events: none; }
                .input-modern-clean { 
                    width: 100%; height: 56px; 
                    padding: 0 16px 0 48px; 
                    background: #F1F5F9; 
                    border: 1.5px solid transparent; 
                    border-radius: 16px; 
                    font-size: 16px; 
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .input-modern-clean:focus { 
                    background: white; 
                    border-color: var(--primary); 
                    box-shadow: 0 8px 16px rgba(27, 184, 91, 0.1);
                }

                .btn-xl { height: 56px; border-radius: 16px; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-top: 12px; }

                .spinner-small { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .line-15 { line-height: 1.5; }
            `}</style>
        </WebLayout>
    );
};

export default SetCapacityScreen;
