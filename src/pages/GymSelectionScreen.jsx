import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Search,
    MapPin,
    Check,
    Building
} from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

import WebLayout from '../components/WebLayout';

const GymSelectionScreen = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [memberId, setMemberId] = useState("");
    const [selectedGym, setSelectedGym] = useState(null);
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        fetchGyms();
    }, []);

    const fetchGyms = async () => {
        setLoading(true);
        try {
            const response = await api.get('/get-registered-gyms');
            setGyms(response.data || []);
        } catch (err) {
            console.error('Error fetching gyms:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredGyms = gyms.filter(gym =>
        gym.gym_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleVerify = async () => {
        if (!selectedGym || !memberId) return;
        setVerifying(true);
        try {
            const response = await api.post('/verify-member', {
                user_id: user.user_id,
                gym_id: selectedGym.gym_id,
                member_id: memberId
            });
            // Update user context with new gym info
            login({ ...user, gym_id: selectedGym.gym_id, gym_name: selectedGym.gym_name, member_id: memberId });
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Verification failed");
        } finally {
            setVerifying(false);
        }
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                {/* Header */}
                <header className="app-header-premium">
                    <div className="header-content-flex">
                        <button onClick={() => navigate(-1)} className="back-btn-modern mobile-only">
                            <ArrowLeft size={22} color="white" />
                        </button>
                        <div className="header-text-main">
                            <h1 className="header-title-premium">Find Your Gym</h1>
                            <p className="header-subtitle-premium">Select your facility to continue</p>
                        </div>
                    </div>
                </header>


                <main className="content-area-premium">
                    <div className="section-px">
                        <div className="spacer-24"></div>

                        {/* Search Bar */}
                        <div className="search-wrapper mb-32">
                            <div className="search-icon">
                                <Search size={20} color="#94A3B8" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name or city..."
                                className="search-input-premium"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Gym List */}
                        <div className="section-header-row mb-16 px-4">
                            <h2 className="title-bolt text-18">Available Gyms</h2>
                            <span className="text-12 text-grey-light uppercase tracking-wider font-700">
                                {filteredGyms.length} Results
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex-center py-40">
                                <div className="spinner-primary"></div>
                            </div>
                        ) : (
                            <div className="gym-roller-container">
                                <div className="gym-roller">
                                    {filteredGyms.map(gym => (
                                        <div
                                            key={gym.gym_id}
                                            className={`gym-card-premium roller-item ${selectedGym?.gym_id === gym.gym_id ? 'active' : ''}`}
                                            onClick={() => setSelectedGym(gym)}
                                        >
                                            <div className="gym-card-inner">
                                                <div className="gym-icon-box">
                                                    <Building size={20} color={selectedGym?.gym_id === gym.gym_id ? 'white' : 'var(--primary)'} />
                                                </div>
                                                <div className="gym-details">
                                                    <h3 className="gym-name-premium">{gym.gym_name}</h3>
                                                    <div className="flex items-center gap-4 mt-4">
                                                        <MapPin size={12} color="#94A3B8" />
                                                        <span className="gym-location-premium">{gym.city}</span>
                                                    </div>
                                                </div>
                                                {selectedGym?.gym_id === gym.gym_id && (
                                                    <div className="selected-badge animate-pop">
                                                        <Check size={14} color="white" strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {filteredGyms.length === 0 && (
                                        <div className="empty-state-card py-40 text-center w-full">
                                            <div className="text-40 mb-12">🔍</div>
                                            <h3 className="font-700 text-16 text-slate-400">No gyms found</h3>
                                            <p className="text-13 text-slate-300">Try searching for a different city</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="spacer-40"></div>

                        {/* Member ID Input & Actions - Fixed at bottom area */}
                        <div className="bottom-action-area">
                            <div className={`card-premium mb-24 transition-all ${selectedGym ? 'active-input' : 'opacity-40 grayscale pointer-events-none'}`}>
                                <label className="label-modern mb-12 block">Enter Gym Member ID</label>
                                <div className="input-modern-wrapper">
                                    <div className="input-icon">
                                        <span className="text-16 font-700 text-slate-400">#</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="e.g. MEM001"
                                        className="input-modern-clean"
                                        value={memberId}
                                        onChange={e => setMemberId(e.target.value)}
                                        disabled={!selectedGym}
                                    />
                                </div>
                                <p className="text-11 text-grey-light mt-12">Select a gym above first, then enter your ID.</p>
                            </div>

                            <button
                                onClick={handleVerify}
                                className={`btn btn-primary btn-xl w-full ${(!selectedGym || !memberId) ? 'btn-disabled' : ''}`}
                                disabled={!selectedGym || !memberId || verifying}
                            >
                                {verifying ? (
                                    <div className="flex items-center gap-12">
                                        <div className="spinner-small"></div>
                                        <span>Verifying...</span>
                                    </div>
                                ) : (
                                    "Confirm & Start Training"
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="spacer-40"></div>
                </main>
            </div>

            <style jsx>{`
                .main-viewport { flex: 1; display: flex; flex-direction: column; background-color: #F8FAFC; }
                
                @media (min-width: 1024px) {
                    .main-viewport { background-color: transparent; }
                    .content-area-premium { max-width: 1000px; margin: 0 auto; width: 100%; padding: 0 48px; }
                    .app-header-premium { padding: 60px 48px 40px !important; border-bottom-left-radius: 40px !important; border-bottom-right-radius: 40px !important; margin-bottom: 24px; }
                    .mobile-only { display: none !important; }
                    .section-px { padding: 0 !important; }
                }

                .section-px { padding: 0 24px; }
                
                .header-content-flex { display: flex; align-items: center; gap: 16px; }
                .back-btn-modern { background: rgba(255,255,255,0.1); border: none; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                
                .search-wrapper { position: relative; display: flex; align-items: center; }
                .search-icon { position: absolute; left: 16px; pointer-events: none; }
                .search-input-premium { 
                    width: 100%; height: 56px; padding: 0 16px 0 48px; 
                    background: white; border: 1.5px solid #E2E8F0; border-radius: 16px; 
                    font-size: 15px; font-weight: 500; transition: all 0.2s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
                }
                .search-input-premium:focus { border-color: var(--primary); outline: none; box-shadow: 0 8px 16px rgba(27, 184, 91, 0.08); }

                /* Horizontal Roller Styles */
                .gym-roller-container { 
                    margin: 0 -24px; 
                    padding: 10px 24px 24px; 
                    overflow-x: auto; 
                    scrollbar-width: none; /* Firefox */
                }
                .gym-roller-container::-webkit-scrollbar { display: none; } /* Chrome/Safari */
                
                .gym-roller { display: flex; gap: 16px; min-width: min-content; }
                
                .roller-item { 
                    flex: 0 0 280px; 
                    background: white; border-radius: 20px; border: 1.5px solid #F1F5F9; 
                    padding: 24px; cursor: pointer; transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }
                
                .gym-card-premium { 
                    background: white; border-radius: 20px; border: 1.5px solid #F1F5F9; 
                    padding: 16px; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .gym-card-premium:hover { transform: scale(1.02); border-color: #E2E8F0; box-shadow: 0 10px 20px rgba(0,0,0,0.04); }
                .gym-card-premium.active { border-color: var(--primary); background: #F0FDF4; box-shadow: 0 10px 20px rgba(27, 184, 91, 0.08); }

                .gym-card-inner { display: flex; align-items: center; gap: 16px; position: relative; }
                .gym-icon-box { width: 40px; height: 40px; background: #F8FAFC; border-radius: 12px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                .active .gym-icon-box { background: var(--primary); }
                
                .gym-name-premium { font-size: 16px; font-weight: 800; color: #1E293B; margin: 0; }
                .gym-location-premium { font-size: 12px; font-weight: 600; color: #64748B; }

                .selected-badge { width: 24px; height: 24px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: absolute; right: 0; }

                .input-modern-wrapper { position: relative; display: flex; align-items: center; }
                .input-icon { position: absolute; left: 16px; }
                .input-modern-clean { 
                    width: 100%; height: 56px; padding: 0 16px 0 40px; 
                    background: #F1F5F9; border: 1.5px solid transparent; border-radius: 16px; 
                    font-size: 16px; font-weight: 700; color: #1E293B; transition: all 0.2s;
                }
                .input-modern-clean:focus { background: white; border-color: var(--primary); outline: none; }

                .btn-disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
                .btn-xl { height: 56px; border-radius: 16px; font-size: 16px; font-weight: 800; }

                .spinner-primary { width: 32px; height: 32px; border: 3px solid #F1F5F9; border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
                .spinner-small { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                .animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </WebLayout>
    );
};

export default GymSelectionScreen;
