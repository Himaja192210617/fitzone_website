import React, { useState, useEffect } from 'react';
import {
    Building,
    Users,
    Calendar,
    History,
    LogOut,
    Monitor,
    Activity,
    ShieldCheck,
    Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

import WebLayout from '../components/WebLayout';

const SuperAdminDashboardScreen = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/super-admin-dashboard');
                setData(response.data);
            } catch (err) {
                console.error('Error fetching super admin data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex-center h-screen">Loading Master Panel...</div>;

    const stats = data || {
        totalGyms: 0,
        totalMembers: 0,
        totalBookings: 0,
        status: { api_status: "Online", ai_models: "Active", database: "Connected" },
        growth: { gym_growth: "+0%", member_growth: "+0%", booking_growth: "+0%" },
        activity: [],
        gyms: []
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                <header className="app-header-compact">
                    <div className="header-row">
                        <div className="header-title-col">
                            <h1 className="header-title">Super Admin Dashboard</h1>
                            <p className="header-subtitle">FitZone Management System</p>
                        </div>
                        <button onClick={() => { logout(); navigate('/login'); }} className="icon-btn-ghost mobile-only">
                            <LogOut size={24} color="white" />
                        </button>
                    </div>
                </header>


                <main className="content-area pt-16">
                    <div className="admin-stats-row">
                        <AdminStatCard title="Total Gyms" val={stats.totalGyms} icon={<Building size={18} />} color="#9C27B0" />
                        <AdminStatCard title="Total Members" val={stats.totalMembers} icon={<Users size={18} />} color="#2196F3" />
                    </div>
                    <div className="spacer-12"></div>
                    <div className="admin-stats-row">
                        <AdminStatCard title="Total Bookings" val={stats.totalBookings} icon={<Calendar size={18} />} color="#4CAF50" />
                        <AdminStatCard title="AI Performance" val="94%" icon={<Zap size={18} />} color="#FF9800" />
                    </div>

                    <div className="spacer-16"></div>

                    <div className="section-card">
                        <h3 className="section-title">System Status</h3>
                        <StatusItem label="API Status" status={stats.status.api_status} />
                        <StatusItem label="AI Models" status={stats.status.ai_models} />
                        <StatusItem label="Database" status={stats.status.database} />
                    </div>

                    <div className="spacer-16"></div>

                    <div className="section-card">
                        <h3 className="section-title">System Activity Logs</h3>
                        <div className="log-list">
                            {stats.activity.length > 0 ? stats.activity.map((log, i) => (
                                <div key={i} className="log-item">
                                    <History size={16} color="gray" />
                                    <div className="log-txt">
                                        <p className="log-msg">{log.activity}</p>
                                        <span className="log-time">{log.time}</span>
                                    </div>
                                </div>
                            )) : <p className="label-gray">No recent logs.</p>}
                        </div>
                    </div>

                    <div className="spacer-16"></div>

                    <div className="section-card">
                        <h3 className="section-title">Platform Growth</h3>
                        <GrowthItem label="Gyms Growth" val={stats.growth.gym_growth} />
                        <GrowthItem label="Members Growth" val={stats.growth.member_growth} />
                        <GrowthItem label="Bookings Growth" val={stats.growth.booking_growth} />
                    </div>

                    <div className="spacer-16"></div>

                    <div className="section-card">
                        <h3 className="section-title">Registered Gyms Management</h3>
                        <div className="gym-table-header">
                            <span className="col-1">Gym Details</span>
                            <span className="col-2">Members</span>
                            <span className="col-3">Actions</span>
                        </div>
                        <div className="gym-list">
                            {stats.gyms.map((gym, i) => (
                                <div key={i} className="gym-row-item">
                                    <div className="gym-main col-1">
                                        <span className="gym-n">{gym.gym_name}</span>
                                        <span className="gym-s">{gym.status}</span>
                                    </div>
                                    <span className="gym-m col-2">{gym.members}</span>
                                    <div className="gym-a col-3">
                                        <button className="btn-suspend">Suspend</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="spacer-24"></div>
                </main>
            </div>
            <style jsx>{`
                .main-viewport { flex: 1; overflow-y: auto; background-color: #0F172A; min-height: 100vh; }
                
                @media (min-width: 1024px) {
                    .main-viewport { background-color: transparent; }
                    .content-area { max-width: 1200px; margin: 0 auto; width: 100%; padding: 0 48px; }
                    .app-header-compact { padding: 60px 48px 40px !important; border-bottom-left-radius: 0 !important; border-bottom-right-radius: 40px !important; margin-bottom: 24px; background: #1E293B !important; }
                    .admin-stats-row { grid-template-columns: repeat(4, 1fr) !important; gap: 24px !important; display: grid !important; }
                    .mobile-only { display: none !important; }
                    .pt-16 { padding-top: 0 !important; }
                }

                .spacer-12 { height: 12px; }
            `}</style>
        </WebLayout>
    );
};

const AdminStatCard = ({ title, val, icon, color }) => (
    <div className="a-stat-card">
        <div className="a-stat-top">
            <div className="a-stat-txt">
                <span className="a-stat-label">{title}</span>
                <span className="a-stat-val">{val}</span>
            </div>
            <div className="a-stat-icon" style={{ backgroundColor: `${color}11`, color: color }}>
                {icon}
            </div>
        </div>
        <span className="a-stat-sub">Updated just now</span>
    </div>
);

const StatusItem = ({ label, status }) => (
    <div className="s-item">
        <span className="s-label">{label}</span>
        <div className="s-badge">
            <div className="s-dot"></div>
            <span>{status}</span>
        </div>
    </div>
);

const GrowthItem = ({ label, val }) => (
    <div className="g-item">
        <span className="g-label">{label}</span>
        <span className="g-val">{val}</span>
    </div>
);

export default SuperAdminDashboardScreen;
