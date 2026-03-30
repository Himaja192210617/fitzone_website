import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Calendar, 
    TrendingUp, 
    Clock, 
    Settings, 
    Grid, 
    Upload, 
    LogOut,
    UserPlus,
    Save,
    Trash2,
    Sun,
    Info,
    ChevronRight,
    Search,
    MapPin,
    Building,
    User,
    ArrowUpRight,
    Activity,
    AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import WebLayout from '../components/WebLayout';

const GymOwnerDashboardScreen = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState("analytics");
    const [dashboardData, setDashboardData] = useState(null);
    const [members, setMembers] = useState([]);
    const [gymInfo, setGymInfo] = useState(null);
    const [slotsData, setSlotsData] = useState([]);
    const [gymHours, setGymHours] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [memberName, setMemberName] = useState("");
    const [memberId, setMemberId] = useState("");
    const [isAddingMember, setIsAddingMember] = useState(false);


    useEffect(() => {
        if (user?.user_id) {
            fetchAllData();
        }
    }, [user]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchDashboard(),
                fetchMembers(),
                fetchGymInfo(),
                fetchSlots(),
                fetchGymHours()
            ]);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboard = async () => {
        try {
            const response = await api.post('/gym-dashboard', { admin_user_id: user.user_id });
            setDashboardData(response.data);
        } catch (err) {
            console.error('Error fetching dashboard:', err);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await api.post('/get-members', { admin_user_id: user.user_id });
            setMembers(response.data.members || []);
        } catch (err) {
            console.error('Error fetching members:', err);
        }
    };

    const fetchGymInfo = async () => {
        try {
            const response = await api.post('/get-gym-info', { admin_user_id: user.user_id });
            setGymInfo(response.data);
        } catch (err) {
            console.error('Error fetching gym info:', err);
        }
    };

    const fetchSlots = async () => {
        try {
            // Get current date in YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0];
            // We need gym_id from dashboardData or fetch it first
            const dashboardRes = await api.post('/gym-dashboard', { admin_user_id: user.user_id });
            const gymId = dashboardRes.data.gym_id;
            
            const response = await api.post('/get-slots', { 
                gym_id: gymId,
                date: today
            });
            setSlotsData(response.data || []);
        } catch (err) {
            console.error('Error fetching slots:', err);
        }
    };

    const fetchGymHours = async () => {
        try {
            const dashboardRes = await api.post('/gym-dashboard', { admin_user_id: user.user_id });
            const gymId = dashboardRes.data.gym_id;
            const response = await api.post('/get-gym-hours', { gym_id: gymId });
            setGymHours(response.data || []);
        } catch (err) {
            console.error('Error fetching gym hours:', err);
        }
    };

    const fetchHolidays = async () => {
        // We'll need a backend endpoint for this or just rely on the existing state if added
        // For now, we'll implement the UI to add them and show them
    };


    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!memberName || !memberId) return;

        // Name validation: should not contain numbers
        if (/\d/.test(memberName)) {
            alert("Name should not contain numbers");
            return;
        }

        // Mobile validation (as memberId): should start with 6, 7, 8, or 9 and be 10 digits
        if (!/^[6-9]/.test(memberId)) {
            alert("Mobile number must start with 6, 7, 8, or 9");
            return;
        }
        if (!/^\d{10}$/.test(memberId)) {
            alert("Mobile number must be exactly 10 digits");
            return;
        }
        
        setIsAddingMember(true);
        try {
            const response = await api.post('/add-member', {
                admin_user_id: user.user_id,
                member_id: memberId,
                name: memberName
            });
            
            // Clear inputs
            setMemberName("");
            setMemberId("");
            
            // Refresh data from backend to ensure state is in sync
            await Promise.all([
                fetchMembers(),
                fetchDashboard()
            ]);
            
            alert(response.data.message || "Member registered successfully!");
        } catch (err) {
            console.error('Member Registration Error:', err);
            alert(err.response?.data?.error || "Failed to add member to database");
        } finally {
            setIsAddingMember(false);
        }
    };


    if (loading) return (
        <WebLayout>
            <div className="flex-center h-screen flex-col gap-16">
                <div className="loader"></div>
                <span className="text-14 font-600 text-slate-500">Synchronizing Dashboard Data...</span>
                <style jsx>{`
                    .loader { border: 4px solid #F3F3F3; border-top: 4px solid #1BB85B; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>
            </div>
        </WebLayout>
    );

    const metrics = dashboardData || {
        total_members: 0,
        todays_bookings: 0,
        total_bookings: 0,
        time_slots: 0,
        gym_name: "Loading...",
        peak_time: "N/A",
        weekly_growth: "0%",
        monthly_growth: "0%"
    };

    const info = gymInfo || {
        gym_name: "N/A",
        gym_id: "N/A",
        address: "N/A",
        city: "N/A",
        phone: "N/A",
        email: "N/A"
    };

    return (
        <WebLayout>
            <div className="web-dashboard-container">
                {/* Modern Website Header */}
                <header className="web-admin-header">
                    <div className="header-web-inner">
                        <div className="header-web-title">
                            <h1 className="web-h1">Admin Console</h1>
                            <div className="gym-badge">
                                <Building size={14} />
                                <span>{metrics.gym_name}</span>
                            </div>
                        </div>
                        <div className="header-web-actions">
                            <div className="user-profile-web">
                                <div className="avatar-web">{metrics.admin_name?.charAt(0) || 'A'}</div>
                                <div className="user-info-web">
                                    <span className="user-n">{metrics.admin_name}</span>
                                    <span className="user-r">Gym Administrator</span>
                                </div>
                            </div>
                            <button onClick={() => { logout(); navigate('/login'); }} className="logout-web-btn">
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="web-main-content">
                    {/* Horizontal Metrics Row */}
                    <div className="web-metrics-row">
                        <WebMetricCard label="Active Members" value={members.length} icon={<Users size={24} />} trend={metrics.weekly_growth} color="#1BB85B" />
                        <WebMetricCard label="Today's Sessions" value={metrics.todays_bookings} icon={<Calendar size={24} />} trend={metrics.monthly_growth} color="#3B82F6" />
                        <WebMetricCard label="Total Bookings" value={metrics.total_bookings} icon={<TrendingUp size={24} />} trend="" color="#8B5CF6" />
                        <WebMetricCard label="Operational Slots" value={metrics.time_slots} icon={<Clock size={24} />} trend="Active" color="#F59E0B" />
                    </div>

                    <div className="spacer-32"></div>

                    {/* Main Dashboard Grid */}
                    <div className="web-dashboard-body">
                        {/* Tab Bar positioned like a secondary nav */}
                        <div className="web-side-nav-tabs">
                            <div className="nav-tab-list">
                                <WebTabButton icon={<Activity size={20} />} label="Analytics" active={selectedTab === "analytics"} onClick={() => setSelectedTab("analytics")} />
                                <WebTabButton icon={<Users size={20} />} label="Members" active={selectedTab === "members"} onClick={() => setSelectedTab("members")} />
                                <WebTabButton icon={<Settings size={20} />} label="Management" active={selectedTab === "settings"} onClick={() => setSelectedTab("settings")} />
                                <WebTabButton icon={<Grid size={20} />} label="Gym Profile" active={selectedTab === "slots"} onClick={() => setSelectedTab("slots")} />
                                <WebTabButton icon={<Upload size={20} />} label="Data Sync" active={selectedTab === "upload"} onClick={() => setSelectedTab("upload")} />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="web-content-pane">
                            {selectedTab === "analytics" && <WebAnalyticsSection slotsData={slotsData} metrics={metrics} />}
                            {selectedTab === "members" && (
                                <div className="web-members-grid">
                                    <div className="pane-left">
                                        <AddMemberFormWeb 
                                            name={memberName} 
                                            setName={setMemberName} 
                                            id={memberId} 
                                            setId={setMemberId} 
                                            onSubmit={handleAddMember}
                                            loading={isAddingMember}
                                        />

                                    </div>
                                    <div className="pane-right">
                                        <MemberListWeb members={members} />
                                    </div>
                                </div>
                            )}
                            {selectedTab === "settings" && <WebSettingsSection gymHours={gymHours} onUpdate={fetchGymHours} metrics={metrics} />}
                            {selectedTab === "slots" && <WebSlotsSection info={info} />}
                            {selectedTab === "upload" && <WebUploadSection adminId={user.user_id} />}
                        </div>
                    </div>
                </main>
            </div>

            <style jsx>{`
                .web-dashboard-container { flex: 1; background: #F4F7FA; min-height: 100vh; display: flex; flex-direction: column; }
                
                /* Website Header */
                .web-admin-header { background: white; border-bottom: 1px solid #E2E8F0; padding: 0 40px; height: 80px; display: flex; align-items: center; }
                .header-web-inner { width: 100%; display: flex; justify-content: space-between; align-items: center; }
                .web-h1 { font-size: 20px; font-weight: 800; color: #1E293B; margin: 0; }
                .gym-badge { display: flex; align-items: center; gap: 6px; background: #F1F5F9; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; color: #64748B; margin-top: 4px; }
                
                .header-web-actions { display: flex; align-items: center; gap: 32px; }
                .user-profile-web { display: flex; align-items: center; gap: 12px; }
                .avatar-web { width: 40px; height: 40px; background: #1BB85B; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; }
                .user-info-web { display: flex; flex-direction: column; }
                .user-n { font-size: 14px; font-weight: 700; color: #1E293B; }
                .user-r { font-size: 11px; color: #94A3B8; font-weight: 600; text-transform: uppercase; }
                
                .logout-web-btn { display: flex; align-items: center; gap: 8px; background: #FFF1F2; border: 1px solid #FFE4E6; color: #E11D48; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .logout-web-btn:hover { background: #FFE4E6; transform: translateY(-1px); }

                /* Main Content Layout */
                .web-main-content { padding: 40px; flex: 1; display: flex; flex-direction: column; }
                
                /* Metrics Row */
                .web-metrics-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
                .web-metric-card { background: white; padding: 24px; border-radius: 20px; border: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: flex-start; transition: transform 0.2s; }
                .web-metric-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.03); }
                .m-label-w { font-size: 13px; font-weight: 600; color: #64748B; margin-bottom: 8px; display: block; }
                .m-value-w { font-size: 32px; font-weight: 800; color: #1E293B; display: block; }
                .m-trend-w { font-size: 12px; font-weight: 700; margin-top: 8px; display: flex; align-items: center; gap: 4px; }
                .m-icon-sphere-w { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }

                /* Dashboard Body */
                .web-dashboard-body { display: flex; gap: 40px; flex: 1; }
                
                /* Sidebar Vertical Tabs */
                .web-side-nav-tabs { width: 240px; }
                .nav-tab-list { display: flex; flex-direction: column; gap: 12px; position: sticky; top: 40px; }
                .tab-btn-w { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 12px; color: #64748B; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
                .tab-btn-w:hover { background: #EDF2F7; color: #1E293B; }
                .tab-btn-w.active { background: white; color: #1BB85B; border-color: #E2E8F0; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }

                /* Main Pane */
                .web-content-pane { flex: 1; min-height: 500px; animation: slideUp 0.4s ease-out; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                /* Grid Layout for Members tab */
                .web-members-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; align-items: start; }
                
                .card-web-white { background: white; border-radius: 24px; padding: 32px; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.02); width: 100%; }
                .web-title-admin { font-size: 20px; font-weight: 800; color: #1E293B; margin-bottom: 24px; }
            `}</style>
        </WebLayout>
    );
};

const WebMetricCard = ({ label, value, icon, trend, color, isPositive = true }) => (
    <div className="web-metric-card">
        <div className="m-left-w">
            <span className="m-label-w">{label}</span>
            <span className="m-value-w">{value}</span>
            <div className="m-trend-w">
                {trend && trend !== '---' && (
                    <div className="flex items-center" style={{ color: color }}>
                        <ArrowUpRight size={14} style={{ transform: isPositive ? 'none' : 'rotate(90deg)' }} />
                        <span className="ml-4">{trend}</span>
                    </div>
                )}
                <span className="m-performance-text">{trend === '---' ? '---' : 'performance'}</span>
            </div>
        </div>
        <div className="m-icon-sphere-w" style={{ backgroundColor: `${color}10`, color: color }}>
            {icon}
        </div>
        <style jsx>{`
            .web-metric-card { background: white; padding: 24px; border-radius: 20px; border: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: flex-start; transition: all 0.2s ease; overflow: hidden; position: relative; }
            .web-metric-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.04); border-color: #CBD5E1; }
            .m-label-w { font-size: 14px; font-weight: 700; color: #64748B; margin-bottom: 8px; display: block; }
            .m-value-w { font-size: 36px; font-weight: 800; color: #1E293B; display: block; line-height: 1; }
            .m-trend-w { font-size: 13px; font-weight: 700; margin-top: 12px; display: flex; align-items: center; gap: 6px; }
            .m-performance-text { color: #94A3B8; font-weight: 600; }
            .m-icon-sphere-w { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
            .ml-4 { margin-left: 4px; }
        `}</style>
    </div>
);

const WebTabButton = ({ icon, label, active, onClick }) => (
    <div className={`tab-btn-w ${active ? 'active' : ''}`} onClick={onClick}>
        {icon}
        <span>{label}</span>
    </div>
);

/* --- ANALYTICS SECTION (WEB) --- */
const WebAnalyticsSection = ({ slotsData, metrics }) => (
    <div className="web-analytics-grid">
        <div className="grid-top">
            <div className="card-web-white shadow-sm">
                <div className="flex justify-between items-center mb-20">
                    <h3 className="section-title-w">Live Occupancy Analysis</h3>
                    <div className="status-badge-realtime">Real-time Data</div>
                </div>
                {slotsData.length === 0 ? (
                    <div className="flex-center py-60 flex-col gap-16 bg-slate-50 border-dashed border-2 border-slate-200 rounded-20">
                        <div className="icon-circle-w bg-white shadow-sm">
                            <Info size={24} color="#94A3B8" />
                        </div>
                        <span className="text-15 font-700 text-slate-400">No occupancy data available for today.</span>
                    </div>
                ) : (
                    <div className="web-chart-box">
                        <div className="bar-row-w">
                            {slotsData.map((slot, i) => {
                                const percentage = (slot.booked / slot.capacity) * 100;
                                return (
                                    <div key={i} className="bar-w-item">
                                        <div className="bar-w-fill" style={{ 
                                            height: `${Math.max(percentage * 2, 20)}px`,
                                            backgroundColor: slot.color === 'red' ? '#EF4444' : slot.color === 'yellow' ? '#F59E0B' : '#1BB85B'
                                        }}>
                                            <span className="bar-tip-w">{slot.booked}/{slot.capacity}</span>
                                        </div>
                                        <span className="bar-label-w">{slot.slot}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        <div className="spacer-32"></div>

        <div className="analytics-split-view">
            <div className="card-web-white">
                <h3 className="section-title-w">Performance Metrics</h3>
                <div className="metrics-list-w">
                    <WebTrendStat label="Expected Peak" val={metrics.peak_time || 'N/A'} />
                    <WebTrendStat label="Public Holidays" val={`${metrics.public_holidays?.length || 0} Days`} />
                    <WebTrendStat label="Morning-Only Days" val={`${metrics.morning_only_days?.length || 0} Special Days`} />
                    <WebTrendStat label="Total Volume" val={`${metrics.total_bookings} Bookings`} />
                </div>
            </div>

            <div className="card-web-white">
                <h3 className="section-title-w">Top Workout Categories</h3>
                <div className="workouts-web-list mt-24">
                    {metrics.popular_workouts && metrics.popular_workouts.length > 0 ? (
                        metrics.popular_workouts.map((w, i) => (
                            <WebWorkoutBar 
                                key={i} 
                                name={w.workout} 
                                perc={w.percentage} 
                                count={w.count} 
                                color={i === 0 ? "#3B82F6" : i === 1 ? "#10B981" : i === 2 ? "#8B5CF6" : "#F59E0B"} 
                            />
                        ))
                    ) : (
                        <>
                            <WebWorkoutBar name="Weight Training" perc="0%" count="0" color="#3B82F6" />
                            <WebWorkoutBar name="Cardio Sessions" perc="0%" count="0" color="#10B981" />
                            <WebWorkoutBar name="Yoga / Flexibility" perc="0%" count="0" color="#8B5CF6" />
                            <WebWorkoutBar name="Functional Fitness" perc="0%" count="0" color="#F59E0B" />
                        </>
                    )}
                </div>
                <div className="category-notice">
                    <Info size={14} />
                    <span>Category breakdowns are calculated from historical booking strings.</span>
                </div>
            </div>
        </div>

        <style jsx>{`
            .web-analytics-grid { display: flex; flex-direction: column; }
            .section-title-w { font-size: 18px; font-weight: 800; color: #1E293B; margin-bottom: 24px; }
            .status-badge-realtime { font-size: 11px; font-weight: 700; color: #64748B; background: #F1F5F9; padding: 6px 14px; border-radius: 8px; border: 1px solid #E2E8F0; text-transform: uppercase; letter-spacing: 0.5px; }
            
            .icon-circle-w { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
            
            .analytics-split-view { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
            .category-notice { display: flex; align-items: center; gap: 10px; margin-top: 24px; padding: 12px 16px; background: #F8FAFC; border-radius: 12px; color: #64748B; font-size: 12px; font-weight: 600; }
            
            .web-chart-box { padding: 10px 0; }
            .bar-row-w { display: flex; align-items: flex-end; justify-content: space-around; min-height: 200px; padding-bottom: 20px; gap: 12px; }
            .bar-w-item { display: flex; flex-direction: column; align-items: center; gap: 12px; }
            .bar-w-fill { width: 36px; border-radius: 8px 8px 4px 4px; position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; }
            .bar-w-fill:hover { transform: scaleX(1.1); filter: brightness(1.1); }
            .bar-tip-w { position: absolute; top: -28px; left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 800; color: #1E293B; }
            .bar-label-w { font-size: 11px; font-weight: 700; color: #94A3B8; }
        `}</style>
    </div>
);


const WebTrendStat = ({ label, val }) => (
    <div className="flex justify-between items-center py-16 border-b border-slate-50 last:border-0">
        <span className="text-14 font-600 text-slate-500">{label}</span>
        <span className="text-15 font-800 text-slate-800">{val}</span>
    </div>
);

const WebWorkoutBar = ({ name, perc, count, color }) => (
    <div className="mb-24 last:mb-0">
        <div className="flex justify-between mb-10 items-end">
            <span className="text-15 font-700 text-slate-700">{name}</span>
            <span className="text-13 font-700 text-slate-400">{count} bookings ({perc})</span>
        </div>
        <div className="web-progress-container shadow-sm">
            <div className="web-progress-fill" style={{ width: perc, backgroundColor: color }}></div>
        </div>
        <style jsx>{`
            .web-progress-container { width: 100%; height: 10px; background: #F1F5F9; border-radius: 6px; overflow: hidden; }
            .web-progress-fill { height: 100%; border-radius: 6px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
        `}</style>
    </div>
);

/* --- MEMBERS SECTION (WEB) --- */
const AddMemberFormWeb = ({ name, setName, id, setId, onSubmit, loading }) => (
    <div className="card-web-white">
        <h3 className="web-title-admin">Register Member</h3>
        <p className="text-14 text-slate-400 mb-24">Assign a permanent Member ID to your facility users.</p>
        <div className="web-input-group">
            <label className="web-label">Full Name</label>
            <input 
                type="text" 
                className="web-input-modern" 
                placeholder="John Doe" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                disabled={loading}
            />
        </div>
        <div className="spacer-16"></div>
        <div className="web-input-group">
            <label className="web-label">Member ID Code</label>
            <div className="input-with-hash">
                <span className="hash-prefix">#</span>
                <input 
                    type="text" 
                    className="web-input-modern px-left" 
                    placeholder="MEM-001" 
                    value={id} 
                    onChange={e => setId(e.target.value)} 
                    disabled={loading}
                />
            </div>
        </div>
        <div className="spacer-32"></div>
        <button 
            className={`web-btn-primary-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`} 
            onClick={onSubmit}
            disabled={loading}
        >
            {loading ? (
                <div className="flex items-center gap-10">
                    <div className="sm-loader"></div>
                    <span>Processing...</span>
                </div>
            ) : (
                <>
                    <UserPlus size={20} />
                    <span>Confirm Registration</span>
                </>
            )}
        </button>
        <style jsx>{`
            .web-label { font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 8px; display: block; }
            .web-input-modern { width: 100%; height: 54px; padding: 0 16px; border: 1.5px solid #E2E8F0; border-radius: 12px; font-size: 15px; outline: none; transition: 0.2s; }
            .web-input-modern:focus { border-color: #1BB85B; box-shadow: 0 0 0 4px rgba(27, 184, 91, 0.08); }
            .web-input-modern:disabled { background: #F8FAFC; color: #94A3B8; }
            .input-with-hash { position: relative; }
            .hash-prefix { position: absolute; left: 16px; top: 16px; font-weight: 800; color: #94A3B8; }
            .web-input-modern.px-left { padding-left: 40px; }
            .web-btn-primary-lg { width: 100%; height: 54px; background: #1BB85B; color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.2s; }
            .web-btn-primary-lg:hover:not(:disabled) { filter: brightness(1.05); transform: translateY(-2px); }
            .sm-loader { border: 3px solid #E2E8F0; border-top: 3px solid white; border-radius: 50%; width: 18px; height: 18px; animation: spin 0.8s linear infinite; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            .opacity-70 { opacity: 0.7; }
            .cursor-not-allowed { cursor: not-allowed; }
        `}</style>
    </div>
);


const MemberListWeb = ({ members }) => (
    <div className="card-web-white">
        <div className="flex justify-between items-center mb-24">
            <h3 className="web-title-admin" style={{ marginBottom: 0 }}>Active Members</h3>
            <div className="member-count-pill">{members.length} Active</div>
        </div>
        <div className="web-member-list-pane">
            {members.length === 0 ? (
                <div className="empty-web">No members registered yet.</div>
            ) : (
                <div className="web-member-grid-display">
                    {members.map((m, i) => (
                        <div key={i} className="web-member-row-item">
                            <div className="m-avatar-web">{m.name?.charAt(0)}</div>
                            <div className="m-det-web">
                                <span className="m-n-web">{m.name}</span>
                                <span className="m-i-web">ID: {m.member_id}</span>
                            </div>
                            <div className="m-act-web">
                                <button className="icon-web-btn"><Info size={16} /></button>
                                <button className="icon-web-btn"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <style jsx>{`
            .member-count-pill { background: #E8F5E9; color: #1BB85B; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 800; }
            .web-member-list-pane { max-height: 500px; overflow-y: auto; padding-right: 8px; }
            .web-member-grid-display { display: flex; flex-direction: column; gap: 12px; }
            .web-member-row-item { display: flex; align-items: center; gap: 16px; padding: 16px; background: #F8FAFC; border-radius: 16px; border: 1px solid #F1F5F9; transition: 0.2s; }
            .web-member-row-item:hover { border-color: #CBD5E1; }
            .m-avatar-web { width: 44px; height: 44px; background: white; border: 2px solid #E2E8F0; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #1BB85B; }
            .m-det-web { flex: 1; display: flex; flex-direction: column; }
            .m-n-web { font-size: 15px; font-weight: 700; color: #1E293B; }
            .m-i-web { font-size: 12px; color: #94A3B8; font-weight: 500; }
            .m-act-web { display: flex; gap: 8px; }
            .icon-web-btn { width: 32px; height: 32px; background: white; border: 1.5px solid #E2E8F0; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748B; transition: 0.2s; }
            .icon-web-btn:hover { background: #F8FAFC; color: #1E293B; border-color: #CBD5E1; }
            .empty-web { text-align: center; padding: 60px; color: #94A3B8; font-size: 15px; }
        `}</style>
    </div>
);

/* --- SETTINGS SECTION (WEB) --- */
const WebSettingsSection = ({ gymHours, onUpdate, metrics }) => {
    const { user } = useAuth();
    
    // Internal states for local editing
    const [sessions, setSessions] = useState([
        { session_type: 'morning', open_time: '06:00', close_time: '11:00', enabled: true },
        { session_type: 'afternoon', open_time: '12:00', close_time: '14:30', enabled: false },
        { session_type: 'evening', open_time: '16:00', close_time: '22:00', enabled: true }
    ]);

    const [holidays, setHolidays] = useState([]);
    const [morningOnly, setMorningOnly] = useState([]);
    
    const [holidayDate, setHolidayDate] = useState("");
    const [morningOnlyDate, setMorningOnlyDate] = useState("");

    useEffect(() => {
        if (gymHours.length > 0) {
            const updated = sessions.map(s => {
                const found = gymHours.find(h => h.session_type === s.session_type);
                return found ? { ...s, open_time: found.open_time, close_time: found.close_time, enabled: true } : s;
            });
            setSessions(updated);
        }
    }, [gymHours]);

    useEffect(() => {
        if (metrics?.public_holidays) {
            setHolidays(metrics.public_holidays);
        }
        if (metrics?.morning_only_days) {
            setMorningOnly(metrics.morning_only_days);
        }
    }, [metrics]);

    const handleSessionChange = (type, field, val) => {
        setSessions(prev => prev.map(s => s.session_type === type ? { ...s, [field]: val } : s));
    };

    const handleToggleSession = (type) => {
        setSessions(prev => prev.map(s => s.session_type === type ? { ...s, enabled: !s.enabled } : s));
    };

    const handleSaveHours = async () => {
        // Validation logic
        const validateTimeStr = (time, start, end) => {
            return time >= start && time <= end;
        };

        for (const sess of sessions) {
            if (!sess.enabled) continue;

            if (sess.session_type === 'morning') {
                if (!validateTimeStr(sess.open_time, '04:00', '11:59') || !validateTimeStr(sess.close_time, '04:00', '11:59')) {
                    alert("Morning session must be between 04:00 and 11:59");
                    return;
                }
            } else if (sess.session_type === 'afternoon') {
                if (!validateTimeStr(sess.open_time, '12:00', '14:59') || !validateTimeStr(sess.close_time, '12:00', '14:59')) {
                    alert("Afternoon session must be between 12:00 and 14:59 (2:59 PM)");
                    return;
                }
            } else if (sess.session_type === 'evening') {
                if (!validateTimeStr(sess.open_time, '15:00', '23:00') || !validateTimeStr(sess.close_time, '15:00', '23:00')) {
                    alert("Evening session must be between 15:00 (3 PM) and 23:00 (11 PM)");
                    return;
                }
            }

            if (sess.open_time >= sess.close_time) {
                alert(`${sess.session_type.charAt(0).toUpperCase() + sess.session_type.slice(1)} opening time must be before closing time`);
                return;
            }
        }

        const targetGymId = metrics.gym_id || user?.gym_id;
        if (!targetGymId) {
            alert("No gym ID found. Please try refreshing the dashboard.");
            return;
        }

        try {
            const enabledSessions = sessions.filter(s => s.enabled);
            await api.post('/configure-hours', { 
                gym_id: targetGymId, 
                sessions: enabledSessions 
            });
            alert("Gym hours updated successfully!");
            onUpdate(); // Refreshes hours
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update hours");
        }
    };

    const handleAddHoliday = async () => {
        if (!holidayDate) return;
        
        // Prevent same date being public holiday and morning only
        if (morningOnly.includes(holidayDate)) {
            alert(`Date ${holidayDate} is already marked as a Morning-Only day. Please remove it from there first.`);
            return;
        }

        if (holidays.includes(holidayDate)) {
            alert("This date is already in the holidays list.");
            return;
        }

        try {
            await api.post('/add-holiday', { 
                admin_user_id: user.user_id, 
                gym_id: metrics.gym_id,
                holiday_date: holidayDate 
            });
            setHolidays([...holidays, holidayDate]);
            setHolidayDate("");
            alert("Holiday added");
        } catch (err) {
            alert("Failed to add holiday");
        }
    };

    const handleDeleteHoliday = async (date) => {
        try {
            await api.post('/remove-holiday', { 
                admin_user_id: user.user_id, 
                holiday_date: date 
            });
            setHolidays(prev => prev.filter(h => h !== date));
            alert("Holiday removed");
        } catch (err) {
            console.error("Delete holiday error:", err);
            alert("Failed to delete holiday from server");
        }
    };

    const handleAddMorningOnly = async () => {
        if (!morningOnlyDate) return;

        // Prevent same date being public holiday and morning only
        if (holidays.includes(morningOnlyDate)) {
            alert(`Date ${morningOnlyDate} is already marked as a Public Holiday. Please remove it from there first.`);
            return;
        }

        if (morningOnly.includes(morningOnlyDate)) {
            alert("This date is already in the Morning-Only list.");
            return;
        }

        try {
            await api.post('/add-morning-only', { 
                admin_user_id: user.user_id, 
                gym_id: metrics.gym_id,
                special_date: morningOnlyDate 
            });
            setMorningOnly([...morningOnly, morningOnlyDate]);
            setMorningOnlyDate("");
            alert("Morning-only day applied");
        } catch (err) {
            alert("Failed to add morning-only day");
        }
    };

    const handleDeleteMorningOnly = async (date) => {
        try {
            await api.post('/remove-morning-only', { 
                admin_user_id: user.user_id, 
                special_date: date 
            });
            setMorningOnly(prev => prev.filter(m => m !== date));
            alert("Morning-only day removed");
        } catch (err) {
            console.error("Delete morning-only error:", err);
            alert("Failed to remove morning-only day from server");
        }
    };

    return (
        <div className="web-settings-layout">
            <div className="settings-main-split">
                <div className="pane-config">
                    {/* Operating Hours Section */}
                    <div className="card-web-white mb-24">
                        <h3 className="web-title-admin">Gym Opening Hours</h3>
                        <p className="text-14 text-slate-400 mb-24">Configure gym operating hours for different sessions</p>
                        
                        <div className="web-sessions-vertical">
                            {sessions.map((sess, idx) => (
                                <WebSessionCard 
                                    key={idx}
                                    sess={sess}
                                    onChange={handleSessionChange}
                                    onToggle={() => handleToggleSession(sess.session_type)}
                                />
                            ))}
                        </div>

                        <div className="spacer-32"></div>
                        <button className="web-save-green-btn" onClick={handleSaveHours}>
                            <Save size={20} />
                            <span>Save Gym Hours</span>
                        </button>
                    </div>

                    {/* Holidays & Morning Only Split */}
                    <div className="web-overrides-grid">
                        <div className="card-web-white">
                            <h3 className="web-title-admin">Public Holidays</h3>
                            <p className="text-13 text-slate-400 mb-20">Mark days when gym is closed</p>
                            <div className="web-input-action-row">
                                <input 
                                    type="date" 
                                    className="web-date-input" 
                                    value={holidayDate}
                                    onChange={e => setHolidayDate(e.target.value)}
                                />
                                <button className="web-add-red-btn" onClick={handleAddHoliday}>
                                    <AlertCircle size={16} />
                                    <span>Add</span>
                                </button>
                            </div>
                            <div className="web-date-list">
                                {holidays.map((date, i) => (
                                    <div key={i} className="date-list-item">
                                        <span>• {date}</span>
                                        <button 
                                            className="delete-date-btn" 
                                            onClick={() => handleDeleteHoliday(date)}
                                            title="Delete holiday"
                                        >
                                            <Trash2 size={14} color="#E11D48" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card-web-white">
                            <h3 className="web-title-admin">Morning-Only Days</h3>
                            <p className="text-13 text-slate-400 mb-20">Days with only morning session</p>
                            <div className="web-input-action-row">
                                <input 
                                    type="date" 
                                    className="web-date-input" 
                                    value={morningOnlyDate}
                                    onChange={e => setMorningOnlyDate(e.target.value)}
                                />
                                <button className="web-add-orange-btn" onClick={handleAddMorningOnly}>
                                    <Sun size={16} />
                                    <span>Add</span>
                                </button>
                            </div>
                             <div className="web-date-list">
                                {morningOnly.map((date, i) => (
                                    <div key={i} className="date-list-item">
                                        <span>• {date}</span>
                                        <button 
                                            className="delete-date-btn" 
                                            onClick={() => handleDeleteMorningOnly(date)}
                                            title="Delete morning-only"
                                        >
                                            <Trash2 size={14} color="#E11D48" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pane-summary">
                    <ConfigSummaryCard 
                        sessions={sessions}
                        holidaysCount={holidays.length}
                        morningOnlyCount={morningOnly.length}
                    />
                </div>
            </div>

            <style jsx>{`
                .web-settings-layout { width: 100%; }
                .settings-main-split { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; align-items: start; }
                
                .web-sessions-vertical { display: flex; flex-direction: column; gap: 20px; }
                
                .web-save-green-btn { width: 100%; height: 56px; background: #1BB85B; color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(27, 184, 91, 0.2); }
                .web-save-green-btn:hover { transform: translateY(-2px); filter: brightness(1.05); }

                .web-overrides-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                
                .web-input-action-row { display: flex; gap: 12px; margin-bottom: 20px; }
                .web-date-input { flex: 1; height: 44px; padding: 0 16px; border: 1.5px solid #E2E8F0; border-radius: 10px; font-size: 14px; outline: none; }
                .web-date-input:focus { border-color: #1BB85B; }
                
                .web-add-red-btn { background: #E11D48; color: white; border: none; padding: 0 20px; border-radius: 10px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }
                .web-add-orange-btn { background: #F59E0B; color: white; border: none; padding: 0 20px; border-radius: 10px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; }
                
                .web-date-list { display: flex; flex-direction: column; gap: 8px; max-height: 200px; overflow-y: auto; }
                .date-list-item { font-size: 14px; font-weight: 600; color: #475569; display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; border-radius: 6px; }
                .date-list-item:hover { background: #F1F5F9; }
                .delete-date-btn { background: transparent; border: none; padding: 4px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
                .delete-date-btn:hover { background: #FFE4E6; }

                .pane-summary { position: sticky; top: 40px; }
            `}</style>
        </div>
    );
};

const WebSessionCard = ({ sess, onChange, onToggle }) => {
    const isMorning = sess.session_type === 'morning';
    const isEvening = sess.session_type === 'evening';
    const isAfternoon = sess.session_type === 'afternoon';

    if (!sess.enabled && isAfternoon) {
        return (
            <div className="web-session-card-w disabled">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-16">
                        <div className="sess-icon-web afternoon"><Clock size={18} /></div>
                        <div className="flex flex-col">
                            <span className="text-16 font-800 text-slate-400">Afternoon Session</span>
                            <span className="text-12 font-600 text-slate-300">(Optional)</span>
                        </div>
                    </div>
                    <button className="enable-btn-w" onClick={onToggle}>Enable</button>
                </div>
                <style jsx>{`
                    .web-session-card-w.disabled { padding: 24px; border: 1.5px dashed #CBD5E1; border-radius: 20px; background: #F8FAFC; display: flex; align-items: center; }
                    .enable-btn-w { font-size: 14px; font-weight: 800; color: #1BB85B; background: transparent; border: none; cursor: pointer; }
                    .sess-icon-web.afternoon { width: 40px; height: 40px; background: #E2E8F0; color: #94A3B8; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                `}</style>
            </div>
        );
    }

    return (
        <div className={`web-session-card-w ${sess.session_type}`}>
            <div className="flex items-center gap-10 mb-20">
                <div className={`sess-icon-web ${sess.session_type}`}>
                    {isMorning ? <Sun size={18} /> : <Clock size={18} />}
                </div>
                <span className={`text-16 font-800 ${isMorning ? 'text-amber-700' : isEvening ? 'text-indigo-800' : 'text-slate-800'}`}>
                    {sess.session_type.charAt(0).toUpperCase() + sess.session_type.slice(1)} Session
                </span>
            </div>
            <div className="flex gap-24">
                <div className="flex-1">
                    <label className="web-label-s">Opening Time</label>
                    <input 
                        type="time" 
                        value={sess.open_time} 
                        onChange={e => onChange(sess.session_type, 'open_time', e.target.value)}
                        className="web-time-input-w"
                    />
                    <span className="current-hint-w">Current: {sess.open_time} - {sess.close_time}</span>
                </div>
                <div className="flex-1">
                    <label className="web-label-s">Closing Time</label>
                    <input 
                        type="time" 
                        value={sess.close_time} 
                        onChange={e => onChange(sess.session_type, 'close_time', e.target.value)}
                        className="web-time-input-w"
                    />
                </div>
            </div>
            <style jsx>{`
                .web-session-card-w { padding: 24px; border-radius: 20px; border: 1px solid #E2E8F0; transition: 0.2s; }
                .web-session-card-w.morning { background: #FFFBEB; border-color: #FDE68A; }
                .web-session-card-w.afternoon { background: #F0F9FF; border-color: #BAE6FD; }
                .web-session-card-w.evening { background: #F5F3FF; border-color: #DDD6FE; }
                
                .sess-icon-web { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .sess-icon-web.morning { background: #FEF3C7; color: #D97706; }
                .sess-icon-web.afternoon { background: #E0F2FE; color: #0284C7; }
                .sess-icon-web.evening { background: #EDE9FE; color: #7C3AED; }
                
                .web-label-s { font-size: 11px; font-weight: 700; color: #94A3B8; margin-bottom: 8px; display: block; text-transform: uppercase; }
                .web-time-input-w { width: 100%; height: 50px; background: white; border: 1.5px solid #E2E8F0; border-radius: 12px; padding: 0 16px; font-size: 16px; font-weight: 700; color: #1E293B; outline: none; }
                .web-time-input-w:focus { border-color: #1BB85B; box-shadow: 0 0 0 4px rgba(27, 184, 91, 0.1); }
                
                .current-hint-w { font-size: 12px; font-weight: 700; color: ${isMorning ? '#D97706' : isEvening ? '#7C3AED' : '#0284C7'}; margin-top: 12px; display: block; }
            `}</style>
        </div>
    );
};

const ConfigSummaryCard = ({ sessions, holidaysCount, morningOnlyCount }) => (
    <div className="config-summary-card">
        <h3 className="text-16 font-800 text-slate-800 mb-24">Current Configuration Summary</h3>
        
        <div className="summary-section-w">
            <div className="sum-item">
                <span className="sum-label">Morning:</span>
                <span className="sum-val">{sessions.find(s => s.session_type === 'morning')?.enabled ? 
                    `${sessions.find(s => s.session_type === 'morning').open_time} - ${sessions.find(s => s.session_type === 'morning').close_time}` : 'Disabled'}</span>
            </div>
            <div className="sum-item">
                <span className="sum-label">Afternoon:</span>
                <span className={`sum-val ${!sessions.find(s => s.session_type === 'afternoon')?.enabled ? 'disabled' : ''}`}>
                    {sessions.find(s => s.session_type === 'afternoon')?.enabled ? 
                        `${sessions.find(s => s.session_type === 'afternoon').open_time} - ${sessions.find(s => s.session_type === 'afternoon').close_time}` : 'Disabled'}</span>
            </div>
            <div className="sum-item">
                <span className="sum-label">Evening:</span>
                <span className="sum-val">{sessions.find(s => s.session_type === 'evening')?.enabled ? 
                    `${sessions.find(s => s.session_type === 'evening').open_time} - ${sessions.find(s => s.session_type === 'evening').close_time}` : 'Disabled'}</span>
            </div>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-stats-grid">
            <div className="stat-box-w">
                <span className="stat-label-w">Holidays:</span>
                <span className="stat-val-w">{holidaysCount} day(s)</span>
            </div>
            <div className="stat-box-w">
                <span className="stat-label-w">Morning-Only:</span>
                <span className="stat-val-w">{morningOnlyCount} day(s)</span>
            </div>
        </div>

        <style jsx>{`
            .config-summary-card { background: #E8F5E9; border-radius: 24px; padding: 32px; border: 1px solid #C8E6C9; }
            .summary-section-w { display: flex; flex-direction: column; gap: 16px; }
            .sum-item { display: flex; flex-direction: column; gap: 4px; }
            .sum-label { font-size: 13px; font-weight: 800; color: #2E7D32; }
            .sum-val { font-size: 15px; font-weight: 700; color: #1BB85B; }
            .sum-val.disabled { color: #94A3B8; }
            
            .summary-divider { height: 1px; background: #C8E6C9; margin: 24px 0; }
            
            .summary-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .stat-label-w { display: block; font-size: 13px; font-weight: 800; color: #2E7D32; margin-bottom: 4px; }
            .stat-val-w { font-size: 15px; font-weight: 700; color: #1BB85B; }
        `}</style>
    </div>
);


/* --- SLOTS SECTION (WEB) --- */
const WebSlotsSection = ({ info }) => (
    <div className="web-slots-layout">
        <div className="card-web-white">
            <h3 className="web-title-admin">Gym Facility Profile</h3>
            <div className="web-profile-grid">
                <div className="profile-main-info">
                    <WebInfoRow label="Facility Name" val={info.gym_name} />
                    <WebInfoRow label="Public Gym ID" val={`GYM${info.gym_id?.toString().padStart(3, '0')}`} />
                    <WebInfoRow label="Contact" val={info.phone || info.email} />
                    <WebInfoRow label="Operating City" val={info.city} />
                    <WebInfoRow label="Full Address" val={info.address} />
                    <WebInfoRow label="Status" val="Verified Facility" badge />
                </div>
                <div className="profile-divider-v"></div>
                <div className="profile-equipment">
                    <h4 className="text-14 font-800 text-slate-800 mb-20 uppercase tracking-wider">Available Equipment</h4>
                    <div className="web-equipment-chips">
                        {["Treadmill", "Cycling", "Bench Press", "Lat Pulldown", "Leg Press", "Dumbbells", "Cross Trainer", "Rowing Machine"].map((e, i) => (
                            <div key={i} className="web-chip-premium">{e}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <style jsx>{`
            .web-profile-grid { display: grid; grid-template-columns: 1.5fr 1px 1fr; gap: 40px; padding: 10px 0; }
            .profile-divider-v { background: #E2E8F0; width: 1px; height: 100%; }
            .web-equipment-chips { display: flex; flex-wrap: wrap; gap: 10px; }
            .web-chip-premium { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px 18px; border-radius: 12px; font-size: 13px; font-weight: 700; color: #475569; }
        `}</style>
    </div>
);

const WebInfoRow = ({ label, val, badge }) => (
    <div className="flex items-center py-12 border-b border-slate-50 last:border-0">
        <span className="w-160 text-13 font-700 text-slate-400 uppercase">{label}</span>
        {badge ? (
            <span className="bg-green-100 text-green-600 px-12 py-4 rounded-full text-12 font-800">{val}</span>
        ) : (
            <span className="text-16 font-700 text-slate-800">{val}</span>
        )}
        <style jsx>{`
            .w-160 { width: 160px; }
        `}</style>
    </div>
);

/* --- UPLOAD SECTION (WEB) --- */
const WebUploadSection = ({ adminId }) => {
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('admin_user_id', adminId);
        formData.append('file', file);

        try {
            const response = await api.post('/upload-historical-data', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(response.data.message || "Data uploaded successfully");
        } catch (err) {
            alert(err.response?.data?.error || "Upload failed");
        }
    };

    return (
        <div className="web-upload-layout">
            <div className="card-web-white text-center">
                <h3 className="web-title-admin" style={{ marginBottom: '8px' }}>Sync Local Data</h3>
                <p className="text-14 text-slate-400 mb-40">Import your local booking records into the global cloud analytics system.</p>
                
                <label className="web-upload-dropzone cursor-pointer">
                    <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                    <div className="upload-circle-icon">
                        <Upload size={36} />
                    </div>
                    <h4 className="text-18 font-800 text-slate-800 mt-20">Click to upload Excel data</h4>
                    <p className="text-13 text-slate-400 mt-8">Supported formats: .xlsx, .xls, .csv (Max 5MB)</p>
                </label>
                
                <div className="spacer-40"></div>
                
                <div className="format-instruction-web">
                    <div className="flex items-center gap-12 mb-16">
                        <Info size={16} color="#3B82F6" />
                        <span className="text-14 font-700 text-slate-700">Required Column Headers</span>
                    </div>
                    <div className="table-preview-web">
                        <div className="tp-header">
                            <span>date</span>
                            <span>slot</span>
                            <span>bookingCount</span>
                        </div>
                        <div className="tp-row">
                            <span>2026-03-01</span>
                            <span>06:00 - 07:00</span>
                            <span>15</span>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .web-upload-dropzone { background: #F8FAFC; border: 2px dashed #CBD5E1; padding: 60px; border-radius: 32px; display: flex; flex-direction: column; align-items: center; transition: 0.2s; }
                .web-upload-dropzone:hover { border-color: #1BB85B; background: #E8F5E933; }
                .upload-circle-icon { width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #1BB85B; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .format-instruction-web { text-align: left; background: #F1F5F9; padding: 24px; border-radius: 20px; }
                .table-preview-web { background: white; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; }
                .tp-header { display: grid; grid-template-columns: repeat(3, 1fr); background: #F8FAFC; padding: 12px; font-size: 11px; font-weight: 800; color: #64748B; border-bottom: 1px solid #E2E8F0; text-transform: uppercase; }
                .tp-row { display: grid; grid-template-columns: repeat(3, 1fr); padding: 12px; font-size: 12px; color: #1E293B; font-weight: 600; }
                .hidden { display: none; }
                .cursor-pointer { cursor: pointer; }
            `}</style>
        </div>
    );
};

export default GymOwnerDashboardScreen;
