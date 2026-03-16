import React, { useState, useEffect } from 'react';
import {
    RefreshCw,
    LogOut,
    TrendingUp,
    Clock,
    AlertTriangle,
    CalendarCheck,
    CheckCircle,
    Flame,
    Home as HomeIcon,
    Calendar,
    Dumbbell,
    Activity,
    History,
    User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

import WebLayout from '../components/WebLayout';

const HomeScreen = () => {
    const { user, logout } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        if (!user?.user_id) return;
        setLoading(true);
        try {
            const response = await api.get(`/user-home/${user.user_id}`);
            setData(response.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // 1 minute interval like the app
        return () => clearInterval(interval);
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                {/* Green Header */}
                <header className="app-header-premium">
                    <div className="header-top">
                        <div className="user-profile-info">
                            <h2 className="welcome-back">Welcome back,</h2>
                            <h1 className="user-name-title">{user?.name || 'User'}</h1>
                            <div className="spacer-4"></div>
                            <div className="gym-tag">
                                <Activity size={12} color="#4ADE80" />
                                <span>{user?.gym_name || 'Select Gym'}</span>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button onClick={fetchData} className="header-icon-btn-glass" title="Refresh">
                                <RefreshCw size={20} color="white" />
                            </button>
                            <button onClick={handleLogout} className="header-icon-btn-glass mobile-only" title="Logout">
                                <LogOut size={20} color="white" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Real-time Indicator */}
                {loading && <div className="loading-bar"></div>}

                <main className="content-area-premium">
                    <div className="spacer-24"></div>

                    <div className="dashboard-grid">
                        {/* Personal Session / Next Slot Card */}
                        <div className="card-span-1">
                            {data?.your_booking ? (
                                <YourBookingCard slotTime={data.your_booking} />
                            ) : (
                                <NextSlotCard slotTime={data?.next_available_slot || 'N/A'} onBookClick={() => navigate('/book-slot')} />
                            )}
                        </div>

                        {/* Crowd Level Card */}
                        <div className="card-span-1">
                            <CrowdLevelCard level={data?.current_crowd_level || 'Low'} />
                        </div>
                    </div>

                    <div className="spacer-20"></div>

                    {/* Peak Hour Alert */}
                    {data?.peak_message && (
                        <>
                            <div className="section-px">
                                <PeakHourAlertCard message={data.peak_message} />
                            </div>
                            <div className="spacer-20"></div>
                        </>
                    )}

                    {/* Filling Fast Alert */}
                    {data?.filling_fast_slot && (
                        <>
                            <div className="section-px">
                                <FillingFastAlertCard slotTime={data.filling_fast_slot} />
                            </div>
                            <div className="spacer-20"></div>
                        </>
                    )}

                    {/* Feature Grid */}
                    <div className="section-px">
                        <h3 className="section-title-small">Quick Actions</h3>
                        <div className="spacer-12"></div>
                        <div className="feature-grid-modern">
                            <FeatureCard
                                icon={<Activity size={32} color="#1BB85B" />}
                                label="BMI Calculator"
                                desc="Check health index"
                                onClick={() => navigate('/bmi')}
                            />
                            <FeatureCard
                                icon={<Dumbbell size={32} color="#1BB85B" />}
                                label="Workout Guide"
                                desc="Pro exercise plans"
                                onClick={() => navigate('/workout-guide')}
                            />
                            <FeatureCard
                                icon={<History size={32} color="#1BB85B" />}
                                label="Recent Bookings"
                                desc="View your history"
                                onClick={() => navigate('/history')}
                            />
                            <FeatureCard
                                icon={<User size={32} color="#1BB85B" />}
                                label="My Profile"
                                desc="Update your details"
                                onClick={() => navigate('/profile')}
                            />
                        </div>
                    </div>

                    <div className="spacer-32"></div>
                </main>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="bottom-navbar-premium">
                <BottomNavItem icon={<HomeIcon size={24} />} label="Home" active />
                <BottomNavItem icon={<Calendar size={24} />} label="Book" onClick={() => navigate('/book-slot')} />
                <BottomNavItem icon={<Dumbbell size={24} />} label="Workout" onClick={() => navigate('/workout-guide')} />
                <BottomNavItem icon={<Activity size={24} />} label="BMI" onClick={() => navigate('/bmi')} />
                <BottomNavItem icon={<History size={24} />} label="History" onClick={() => navigate('/history')} />
                <BottomNavItem icon={<User size={24} />} label="Profile" onClick={() => navigate('/profile')} />
            </nav>

            <style jsx>{`
        .main-viewport {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 90px;
          background-color: #FAFAFA;
        }

        @media (min-width: 1024px) {
            .main-viewport {
                padding-bottom: 40px;
                background-color: transparent;
            }
            .app-header-premium {
                padding: 60px 48px 40px !important;
                border-bottom-left-radius: 40px !important;
                border-bottom-right-radius: 40px !important;
                margin-bottom: 24px;
            }
            .section-px {
                padding: 0 48px !important;
            }
            .content-area-premium {
                max-width: 1200px;
                margin: 0 auto;
                width: 100%;
            }
            .mobile-only {
                display: none !important;
            }
        }

        .app-header-premium {
          background: linear-gradient(135deg, #1BB85B 0%, #15a34e 100%);
          padding: 40px 24px 30px 24px;
          border-bottom-left-radius: 30px;
          border-bottom-right-radius: 30px;
          box-shadow: 0 10px 20px rgba(27, 184, 91, 0.15);
        }

        .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .welcome-back { font-size: 16px; font-weight: 500; color: rgba(255,255,255,0.8); margin: 0; }
        .user-name-title { font-size: 28px; font-weight: 800; color: white; margin: 0; letter-spacing: -0.5px; }
        
        .gym-tag { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.15); padding: 4px 12px; rounded-full; border-radius: 20px; font-size: 12px; color: white; width: fit-content; }

        .header-actions { display: flex; gap: 10px; }
        .header-icon-btn-glass { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.1); padding: 10px; cursor: pointer; border-radius: 12px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); transition: all 0.2s; }
        .header-icon-btn-glass:hover { background: rgba(255,255,255,0.3); }

        .content-area-premium { padding: 0; }
        .section-px { padding: 0 20px; }
        .section-title-small { font-size: 14px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; }

        .dashboard-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 20px;
        }

        @media (min-width: 768px) {
            .dashboard-grid {
                grid-template-columns: 1fr 1fr;
                padding: 0 48px;
            }
            .section-px {
                padding: 0 48px;
            }
        }

        .feature-grid-modern { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        
        @media (min-width: 768px) {
            .feature-grid-modern {
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 24px;
            }
        }

        .bottom-navbar-premium { 
          position: fixed; bottom: 0; left: 0; right: 0; height: 80px; background-color: rgba(255,255,255,0.95); 
          display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #F0F0F0; 
          backdrop-filter: blur(10px); z-index: 100;
          padding: 0 10px 10px 10px;
        }

        .loading-bar { height: 4px; width: 100%; position: relative; overflow: hidden; }
        .loading-bar::after { content: ''; position: absolute; height: 100%; width: 30%; background-color: var(--primary); animation: loading 1.5s infinite linear; }
        @keyframes loading { 0% { left: -30%; } 100% { left: 100%; } }
        .spacer-4 { height: 4px; }
      `}</style>
        </WebLayout>
    );
};


const YourBookingCard = ({ slotTime }) => (
    <div className="booking-card personal">
        <div className="card-content">
            <div className="card-main-col">
                <div className="booking-header">
                    <CalendarCheck size={18} color="white" />
                    <span className="booking-status-text">Your Booking Today</span>
                </div>
                <div className="spacer-12"></div>
                <span className="slot-time-large">{slotTime}</span>
            </div>
            <div className="check-icon-circle">
                <CheckCircle size={24} color="white" />
            </div>
        </div>
        <style jsx>{`
      .booking-card.personal {
        background: linear-gradient(135deg, #1BB85B 0%, #059669 100%);
        border: none;
        border-radius: 24px;
        padding: 24px;
        box-shadow: 0 10px 25px rgba(27, 184, 91, 0.2);
        color: white;
      }
      .card-content { display: flex; justify-content: space-between; align-items: center; }
      .booking-header { display: flex; align-items: center; gap: 8px; }
      .booking-status-text { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.9); }
      .slot-time-large { font-size: 32px; font-weight: 800; color: white; display: block; }
      .check-icon-circle { width: 50px; height: 50px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
      .spacer-12 { height: 12px; }
    `}</style>
    </div>
);

const NextSlotCard = ({ slotTime, onBookClick }) => (
    <div className="card-premium elevation-1">
        <div className="card-content">
            <div className="card-main-col">
                <span className="card-label">Next Available Slot</span>
                <div className="spacer-12"></div>
                <span className="slot-time-large-dark">{slotTime}</span>
                <div className="spacer-20"></div>
                <button onClick={onBookClick} className="btn-primary-small">Book Now</button>
            </div>
            <div className="time-icon-circle">
                <Clock size={24} color="#1BB85B" />
            </div>
        </div>
        <style jsx>{`
      .card-premium { background-color: white; border-radius: 24px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #F0F0F0; }
      .card-label { font-size: 14px; color: #888; font-weight: 600; }
      .slot-time-large-dark { font-size: 32px; font-weight: 800; color: #111; display: block; }
      .btn-primary-small { background: linear-gradient(135deg, #1BB85B 0%, #15a34e 100%); color: white; border: none; border-radius: 12px; padding: 12px 24px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(27, 184, 91, 0.2); transition: all 0.2s; }
      .btn-primary-small:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(27, 184, 91, 0.3); }
      .time-icon-circle { width: 56px; height: 56px; background: #E8F5E9; border-radius: 18px; display: flex; align-items: center; justify-content: center; transform: rotate(-10deg); }
      .spacer-12 { height: 12px; }
      .spacer-20 { height: 20px; }
    `}</style>
    </div>
);

const CrowdLevelCard = ({ level }) => {
    const getColors = () => {
        if (level === 'High') return { text: '#E65100', bg: '#FFF3E0' };
        if (level === 'Medium') return { text: '#FBC02D', bg: '#FFF9C4' };
        return { text: '#1BB85B', bg: '#E8F5E9' };
    };
    const colors = getColors();

    return (
        <div className="card-premium">
            <div className="card-content">
                <div className="card-main-col">
                    <span className="card-label">Current Crowd Level</span>
                    <div className="spacer-12"></div>
                    <div className="level-badge-premium" style={{ backgroundColor: colors.bg, color: colors.text }}>
                        {level}
                    </div>
                    <div className="spacer-12"></div>
                    <span className="card-subtext">Live crowd prediction based on current bookings</span>
                </div>
                <div className="trend-icon-circle">
                    <TrendingUp size={24} color={colors.text} />
                </div>
            </div>
            <style jsx>{`
        .card-premium { background-color: white; border-radius: 24px; padding: 24px; border: 1px solid #F0F0F0; }
        .level-badge-premium { display: inline-block; padding: 10px 20px; border-radius: 14px; font-size: 18px; font-weight: 800; }
        .card-subtext { font-size: 12px; color: #999; line-height: 1.4; display: block; max-width: 180px; }
        .trend-icon-circle { width: 56px; height: 56px; background: #F8F9FA; border-radius: 18px; display: flex; align-items: center; justify-content: center; }
      `}</style>
        </div>
    );
};

const PeakHourAlertCard = ({ message }) => (
    <div className="alert-card warning">
        <AlertTriangle size={24} color="#E65100" />
        <div className="alert-content">
            <h3 className="alert-title">Peak Hour Alert</h3>
            <p className="alert-msg">{message}</p>
            <p className="alert-tip">Consider booking earlier or later slots for better experience</p>
        </div>
        <style jsx>{`
      .alert-card.warning { background-color: #FFF3E0; border: 1px solid #FFE0B2; border-radius: 12px; padding: 20px; display: flex; gap: 12px; }
      .alert-title { font-size: 16px; font-weight: 700; color: #E65100; }
      .alert-msg { font-size: 13px; color: #EF6C00; }
      .alert-tip { font-size: 12px; color: #EF6C00; }
    `}</style>
    </div>
);

const FillingFastAlertCard = ({ slotTime }) => (
    <div className="alert-card danger">
        <Flame size={24} color="#C62828" />
        <div className="alert-content">
            <h3 className="alert-title danger">Filling Fast!</h3>
            <p className="alert-msg danger">The {slotTime} slot is almost full.</p>
            <p className="alert-tip danger-opacity">Book now to secure your spot!</p>
        </div>
        <style jsx>{`
      .alert-card.danger { background-color: #FFEBEE; border: 1px solid rgba(198, 40, 40, 0.2); border-radius: 12px; padding: 20px; display: flex; gap: 12px; }
      .alert-title.danger { color: #C62828; font-size: 16px; font-weight: 700; }
      .alert-msg.danger { color: #B71C1C; font-size: 14px; }
      .alert-tip.danger-opacity { color: rgba(183, 28, 28, 0.8); font-size: 12px; }
    `}</style>
    </div>
);

const FeatureCard = ({ icon, label, desc, onClick }) => (
    <div className="card-feature-premium" onClick={onClick}>
        <div className="feature-icon-box">
            {icon}
        </div>
        <div className="spacer-16"></div>
        <div className="feature-text">
            <span className="feature-label-title">{label}</span>
            <span className="feature-label-desc">{desc}</span>
        </div>
        <style jsx>{`
      .card-feature-premium { background-color: white; border-radius: 24px; padding: 24px; text-align: left; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid #F0F0F0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); display: flex; flex-direction: column; }
      .card-feature-premium:hover { transform: translateY(-5px); box-shadow: 0 12px 25px rgba(0,0,0,0.06); border-color: var(--primary); }
      .feature-icon-box { width: 48px; height: 48px; background: #F8F9FA; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
      .feature-label-title { font-size: 16px; font-weight: 700; color: #111; display: block; }
      .feature-label-desc { font-size: 12px; color: #888; margin-top: 4px; display: block; }
    `}</style>
    </div>
);

const BottomNavItem = ({ icon, label, active, onClick }) => (
    <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
        {icon}
        <span className="nav-label">{label}</span>
        <style jsx>{`
      .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #AAAAAA; cursor: pointer; width: 50px; }
      .nav-item.active { color: var(--primary); font-weight: 700; }
      .nav-label { font-size: 10px; }
    `}</style>
    </div>
);

export default HomeScreen;
