import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    Sun,
    Cloud,
    Moon,
    Clock,
    Check,
    ChevronRight
} from 'lucide-react';
import api from '../api/api';
import WebLayout from '../components/WebLayout';

const ConfigureHoursScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const gymId = location.state?.gymId;

    const [loading, setLoading] = useState(false);
    const [morning, setMorning] = useState({ open: '06:00', close: '11:00' });
    const [afternoon, setAfternoon] = useState({ enabled: false, open: '12:00', close: '15:00' });
    const [evening, setEvening] = useState({ enabled: true, open: '16:00', close: '21:00' });

    React.useEffect(() => {
        const fetchHours = async () => {
            try {
                const id = gymId || location.state?.gymId;
                if (!id) return;
                const response = await api.post('/get-gym-hours', { gym_id: id });
                if (response.data && response.data.length > 0) {
                    response.data.forEach(session => {
                        const sessData = { enabled: true, open: session.open_time.substring(0, 5), close: session.close_time.substring(0, 5) };
                        if (session.session_type === 'morning') setMorning(sessData);
                        else if (session.session_type === 'afternoon') setAfternoon(sessData);
                        else if (session.session_type === 'evening') setEvening(sessData);
                    });
                }
            } catch (err) {
                console.log("No existing hours found");
            }
        };
        fetchHours();
    }, [gymId, location.state]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const sessions = [
                { session_type: 'morning', open_time: morning.open, close_time: morning.close }
            ];
            if (afternoon.enabled) {
                sessions.push({ session_type: 'afternoon', open_time: afternoon.open, close_time: afternoon.close });
            }
            if (evening.enabled) {
                sessions.push({ session_type: 'evening', open_time: evening.open, close_time: evening.close });
            }

            await api.post('/configure-hours', { gym_id: gymId, sessions });
            navigate('/upload-data', { state: { gymId } });
        } catch (err) {
            alert("Failed to save hours");
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
                            <h1 className="header-title-premium">Session Hours</h1>
                            <p className="header-subtitle-premium">Step 2 of 3 • Operating Times</p>
                        </div>
                    </div>
                </header>

                <main className="content-area-premium">
                    <div className="section-px">
                        <div className="spacer-24"></div>

                        {/* Illustration/Icon Area */}
                        <div className="flex-center mb-32">
                            <div className="illustration-sphere-orange">
                                <Clock size={48} color="white" strokeWidth={1.5} />
                            </div>
                        </div>

                        <div className="session-list-modern">
                            <SessionCard
                                icon={<Sun size={22} color="#F59E0B" />}
                                title="Morning Session"
                                category="Morning"
                                times={morning}
                                setTimes={setMorning}
                                required
                            />

                            <div className="spacer-16"></div>

                            <SessionCard
                                icon={<Cloud size={22} color="#3B82F6" />}
                                title="Afternoon Session"
                                category="Afternoon"
                                times={afternoon}
                                setTimes={setAfternoon}
                                canToggle
                            />

                            <div className="spacer-16"></div>

                            <SessionCard
                                icon={<Moon size={22} color="#6366F1" />}
                                title="Evening Session"
                                category="Evening"
                                times={evening}
                                setTimes={setEvening}
                                canToggle
                            />
                        </div>

                        <div className="spacer-32"></div>

                        <button
                            onClick={handleSave}
                            className="btn btn-primary btn-xl w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-12">
                                    <div className="spinner-small"></div>
                                    <span>Saving Sessions...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-8">
                                    <span>Next: Data Import</span>
                                    <ChevronRight size={20} />
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

                .illustration-sphere-orange { 
                    width: 100px; height: 100px; 
                    background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); 
                    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 20px 40px rgba(245, 158, 11, 0.2);
                    animation: morph-orange 8s ease-in-out infinite;
                }

                @keyframes morph-orange {
                    0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                    50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
                    100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                }

                .btn-xl { height: 56px; border-radius: 16px; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; }

                .spinner-small { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </WebLayout>
    );
};

const SessionCard = ({ icon, title, category, times, setTimes, canToggle, required }) => (
    <div className={`card-premium transition-all ${(!canToggle || times.enabled) ? 'border-primary-soft' : 'opacity-60'}`}>
        <div className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-12">
                <div className="session-icon-box">
                    {icon}
                </div>
                <div>
                    <h3 className="font-800 text-16 text-slate-900">{title}</h3>
                    <span className={`text-11 font-700 uppercase tracking-wider ${required ? 'text-primary' : 'text-slate-400'}`}>
                        {required ? 'Required' : 'Optional Session'}
                    </span>
                </div>
            </div>
            {canToggle && (
                <div
                    className={`toggle-pill ${times.enabled ? 'active' : ''}`}
                    onClick={() => setTimes({ ...times, enabled: !times.enabled })}
                >
                    <div className="toggle-dot"></div>
                </div>
            )}
        </div>

        {(!canToggle || times.enabled) && (
            <div className="time-input-grid animate-in">
                <div className="time-input-col">
                    <span className="label-tiny">Starts at</span>
                    <input
                        type="time"
                        className="time-modern-input"
                        value={times.open}
                        onChange={e => setTimes({ ...times, open: e.target.value })}
                    />
                </div>
                <div className="time-input-col">
                    <span className="label-tiny">Ends at</span>
                    <input
                        type="time"
                        className="time-modern-input"
                        value={times.close}
                        onChange={e => setTimes({ ...times, close: e.target.value })}
                    />
                </div>
            </div>
        )}

        <style jsx>{`
            .border-primary-soft { border: 1.5px solid rgba(27, 184, 91, 0.2); background: white; box-shadow: 0 12px 24px rgba(27, 184, 91, 0.04); }
            .session-icon-box { width: 44px; height: 44px; background: #F8FAFC; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
            
            .toggle-pill { width: 44px; height: 24px; background: #E2E8F0; border-radius: 20px; position: relative; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
            .toggle-pill.active { background: var(--primary); }
            .toggle-dot { width: 18px; height: 18px; background: white; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .toggle-pill.active .toggle-dot { left: 23px; }

            .time-input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 12px; border-top: 1px solid #F1F5F9; }
            .time-input-col { display: flex; flex-direction: column; gap: 4px; }
            .label-tiny { font-size: 10px; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; margin-left: 4px; }
            
            .time-modern-input { 
                width: 100%; height: 48px; border: 1.5px solid #F1F5F9; background: #F8FAFC; 
                border-radius: 12px; padding: 0 12px; font-size: 14px; font-weight: 700; color: #1E293B;
                font-family: var(--font-main); transition: all 0.2s;
            }
            .time-modern-input:focus { border-color: var(--primary); background: white; outline: none; }
        `}</style>
    </div>
);

export default ConfigureHoursScreen;
