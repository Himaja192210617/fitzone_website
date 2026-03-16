import React, { useEffect, useState } from 'react';
import {
    Mail,
    Phone,
    User,
    Dumbbell,
    Calendar as CalendarDays,
    CheckCircle,
    Edit,
    MapPin,
    LogOut,
    ChevronRight,
    Home as HomeIcon,
    Calendar,
    Activity,
    History,
    User as PersonIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';

import WebLayout from '../components/WebLayout';

const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.user_id) return;
            try {
                const response = await api.get(`/user-profile/${user.user_id}`);
                setProfileData(response.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user]);

    if (loading) return <div className="flex-center h-screen">Loading profile...</div>;

    const data = profileData || {
        name: user?.name || 'User',
        email: user?.email || 'N/A',
        mobile: user?.mobile || 'N/A',
        age: user?.age || 'N/A',
        gender: user?.gender || 'N/A',
        gym: {
            gym_name: user?.gym_name || 'No Gym Selected',
            location: user?.gym_location || 'N/A',
            member_id: user?.member_id || 'N/A'
        },
        stats: {
            total_bookings: 0,
            active_bookings: 0
        }
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                {/* Header */}
                <header className="profile-header-premium">
                    <div className="profile-header-content text-center">
                        <div className="avatar-premium-lg">
                            {data.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="spacer-16"></div>
                        <h1 className="user-name-title-lg">{data.name}</h1>
                        <span className="user-role-badge">Premium Member</span>
                    </div>
                </header>

                <main className="content-area-premium">
                    <div className="spacer-24"></div>

                    <div className="profile-grid-web">
                        <div className="profile-main-col">
                            {/* Contact Info Card */}
                            <div className="section-px">
                                <div className="card-premium">
                                    <h3 className="section-title-small mb-16">Contact Information</h3>
                                    <div className="info-grid-modern">
                                        <div className="info-box-modern">
                                            <Mail size={18} className="info-icon-green" />
                                            <div className="info-texts">
                                                <span className="info-label-sm">Email Address</span>
                                                <span className="info-val-md">{data.email}</span>
                                            </div>
                                        </div>
                                        <div className="divider-light"></div>
                                        <div className="info-box-modern">
                                            <Phone size={18} className="info-icon-green" />
                                            <div className="info-texts">
                                                <span className="info-label-sm">Mobile Number</span>
                                                <span className="info-val-md">{data.mobile}</span>
                                            </div>
                                        </div>
                                        <div className="divider-light"></div>
                                        <div className="info-box-modern">
                                            <PersonIcon size={18} className="info-icon-green" />
                                            <div className="info-texts">
                                                <span className="info-label-sm">Personal Info</span>
                                                <span className="info-val-md">{data.age} yrs • {data.gender}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="spacer-24"></div>

                            {/* Gym Membership Card */}
                            <div className="section-px">
                                <h3 className="section-title-small">Gym Details</h3>
                                <div className="spacer-12"></div>
                                <div className="card-premium gym-card-premium">
                                    <div className="gym-header-row">
                                        <div className="gym-icon-box-modern">
                                            <Dumbbell size={24} color="#1BB85B" />
                                        </div>
                                        <div className="gym-title-texts">
                                            <h4 className="gym-name-modern">{data.gym.gym_name}</h4>
                                            <p className="gym-location-modern">{data.gym.location}</p>
                                        </div>
                                    </div>
                                    <div className="spacer-20"></div>
                                    <div className="membership-id-strip">
                                        <span className="m-id-label">Membership ID</span>
                                        <span className="m-id-value">{data.gym.member_id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="profile-side-col">
                            {/* Stats Grid */}
                            <div className="section-px">
                                <h3 className="section-title-small">Activity Overview</h3>
                                <div className="spacer-12"></div>
                                <div className="stats-grid-modern-web">
                                    <div className="stat-pill-modern blue">
                                        <span className="stat-pill-val">{data.stats.total_bookings}</span>
                                        <span className="stat-pill-label">Total Slots</span>
                                    </div>
                                    <div className="stat-pill-modern green">
                                        <span className="stat-pill-val">{data.stats.active_bookings}</span>
                                        <span className="stat-pill-label">Active Now</span>
                                    </div>
                                </div>
                            </div>

                            <div className="spacer-24"></div>

                            {/* Actions Menu */}
                            <div className="section-px">
                                <div className="menu-container-premium">
                                    <ActionItem icon={<Edit size={20} />} label="Edit Profile" onClick={() => navigate('/edit-profile')} />
                                    <ActionItem icon={<MapPin size={20} />} label="Switch Gym" onClick={() => navigate('/select-gym')} />
                                    <ActionItem icon={<LogOut size={20} />} label="Sign Out" isDestructive onClick={() => { logout(); navigate('/login'); }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="spacer-40"></div>

                    {/* App Version Tag */}
                    <div className="version-tag-modern">
                        <span className="brand-text">FitZone</span>
                        <span className="ver-text">v1.2.0 Stable Build</span>
                    </div>

                    <div className="spacer-40"></div>
                </main>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <nav className="bottom-navbar-premium">
                <BottomNavItem icon={<HomeIcon size={24} />} label="Home" onClick={() => navigate('/dashboard')} />
                <BottomNavItem icon={<Calendar size={24} />} label="Book" onClick={() => navigate('/book-slot')} />
                <BottomNavItem icon={<Dumbbell size={24} />} label="Workout" onClick={() => navigate('/workout-guide')} />
                <BottomNavItem icon={<Activity size={24} />} label="BMI" onClick={() => navigate('/bmi')} />
                <BottomNavItem icon={<History size={24} />} label="History" onClick={() => navigate('/history')} />
                <BottomNavItem icon={<PersonIcon size={24} />} label="Profile" active />
            </nav>


            <style jsx>{`
        .main-viewport { flex: 1; overflow-y: auto; padding-bottom: 90px; background-color: #FAFAFA; }
        
        @media (min-width: 1024px) {
            .main-viewport { padding-bottom: 40px; background-color: transparent; }
            .content-area-premium { max-width: 1200px; margin: 0 auto; width: 100%; padding: 0 48px; }
            .profile-header-premium { padding: 60px 48px 40px !important; border-bottom-left-radius: 40px !important; border-bottom-right-radius: 40px !important; margin-bottom: 24px; }
            .profile-grid-web { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }
            .mobile-only { display: none !important; }
            .section-px { padding: 0 !important; }
        }

        .profile-header-premium {
          background: linear-gradient(135deg, #1BB85B 0%, #15a34e 100%);
          padding: 60px 24px 40px 24px;
          border-bottom-left-radius: 40px;
          border-bottom-right-radius: 40px;
          box-shadow: 0 10px 30px rgba(27, 184, 91, 0.2);
        }

        .avatar-premium-lg {
          width: 90px; height: 90px; border-radius: 30px; background: white; 
          margin: 0 auto; display: flex; align-items: center; justify-content: center;
          font-size: 36px; font-weight: 800; color: var(--primary);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .user-name-title-lg { font-size: 28px; font-weight: 800; color: white; margin: 0; letter-spacing: -0.5px; }
        .user-role-badge { display: inline-block; background: rgba(255,255,255,0.2); color: white; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-top: 8px; backdrop-filter: blur(4px); }

        .content-area-premium { padding: 0; }
        .section-px { padding: 0 20px; }
        .section-title-small { font-size: 14px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; }

        .info-grid-modern { display: flex; flex-direction: column; gap: 16px; }
        .info-box-modern { display: flex; align-items: center; gap: 16px; }
        .info-icon-green { color: var(--primary); }
        .info-texts { display: flex; flex-direction: column; }
        .info-label-sm { font-size: 11px; color: #999; font-weight: 600; text-transform: uppercase; }
        .info-val-md { font-size: 15px; font-weight: 700; color: #111; }
        .divider-light { height: 1px; background: #F3F4F6; width: 100%; }

        .gym-header-row { display: flex; align-items: center; gap: 16px; }
        .gym-icon-box-modern { width: 56px; height: 56px; background: #F0FDF4; border-radius: 18px; display: flex; align-items: center; justify-content: center; }
        .gym-name-modern { font-size: 18px; font-weight: 800; color: #111; margin: 0; }
        .gym-location-modern { font-size: 13px; color: #666; margin: 0; }
        
        .membership-id-strip { background: #111; border-radius: 14px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; }
        .m-id-label { font-size: 12px; color: #888; font-weight: 600; }
        .m-id-value { font-size: 14px; color: white; font-weight: 800; font-family: monospace; }

        .stats-grid-modern-web { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .stat-pill-modern { padding: 20px; border-radius: 24px; display: flex; flex-direction: column; align-items: center; }
        .stat-pill-modern.blue { background: #EFF6FF; color: #1D4ED8; }
        .stat-pill-modern.green { background: #ECFDF5; color: #059669; }
        .stat-pill-val { font-size: 32px; font-weight: 800; }
        .stat-pill-label { font-size: 12px; font-weight: 700; margin-top: 2px; }

        .menu-container-premium { background: white; border-radius: 24px; overflow: hidden; border: 1px solid #F0F0F0; }
        
        .version-tag-modern { text-align: center; }
        .brand-text { font-size: 18px; font-weight: 800; color: #DDD; display: block; }
        .ver-text { font-size: 11px; color: #EEE; font-weight: 600; }

        .bottom-navbar-premium { 
          position: fixed; bottom: 0; left: 0; right: 0; height: 80px; background-color: rgba(255,255,255,0.95); 
          display: flex; justify-content: space-around; align-items: center; border-top: 1px solid #F0F0F0; 
          backdrop-filter: blur(10px); z-index: 100;
          padding: 0 10px 10px 10px;
        }
      `}</style>
        </WebLayout>
    );
};

const ActionItem = ({ icon, label, isDestructive, onClick }) => (
    <div className="action-item" onClick={onClick}>
        <div className="action-left">
            {icon}
            <span className={isDestructive ? 'red-text' : ''}>{label}</span>
        </div>
        {!isDestructive && <ChevronRight size={16} color="gray" />}
        <style jsx>{`
      .action-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; cursor: pointer; }
      .action-left { display: flex; align-items: center; gap: 16px; font-weight: 500; font-size: 14px; }
      .red-text { color: red; }
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

export default ProfileScreen;
