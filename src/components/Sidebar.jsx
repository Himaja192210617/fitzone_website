import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    Home, 
    Calendar, 
    Dumbbell, 
    Activity, 
    History, 
    User, 
    LogOut,
    ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isSuperAdmin = window.location.pathname === '/super-admin-dashboard';
    const isGymOwner = user?.role === 'gym_owner' || user?.role === 'gym_administrator' || user?.next_page === 'gym_dashboard' || window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/setup') || window.location.pathname.startsWith('/configure');

    const memberNavItems = [
        { icon: <Home size={20} />, label: 'Home', path: '/dashboard' },
        { icon: <Calendar size={20} />, label: 'Book Slot', path: '/book-slot' },
        { icon: <Dumbbell size={20} />, label: 'Workouts', path: '/workout-guide' },
        { icon: <Activity size={20} />, label: 'BMI Calculator', path: '/bmi' },
        { icon: <History size={20} />, label: 'History', path: '/history' },
        { icon: <User size={20} />, label: 'Profile', path: '/profile' },
    ];

    const ownerNavItems = [
        { icon: <Home size={20} />, label: 'Admin Home', path: '/admin-dashboard' },
        { icon: <Activity size={20} />, label: 'Import Data', path: '/upload-data' },
        { icon: <History size={20} />, label: 'Gym Profile', path: '/setup-gym' },
    ];

    const superAdminNavItems = [
        { icon: <Home size={20} />, label: 'Master View', path: '/super-admin-dashboard' },
    ];

    const navItems = isSuperAdmin ? superAdminNavItems : isGymOwner ? ownerNavItems : memberNavItems;

    return (
        <aside className="sidebar-web">
            <div className="sidebar-header">
                <div className="logo-box">
                    <Dumbbell color="white" size={24} />
                </div>
                <span className="logo-text">Fit<span className="text-primary">Zone</span> Master</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item, index) => (
                    <NavLink 
                        key={index} 
                        to={item.path} 
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="link-icon">{item.icon}</span>
                        <span className="link-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-pill">
                    <div className="user-avatar-small">
                        {user?.name?.charAt(0) || 'S'}
                    </div>
                    <div className="user-details">
                        <span className="user-name-small">{user?.name || 'Super Admin'}</span>
                        <span className="user-role-small">{isSuperAdmin ? 'Master Admin' : isGymOwner ? 'Gym Owner' : 'Member'}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn-web">
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>



            <style jsx>{`
                .sidebar-web {
                    width: 280px;
                    background: white;
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid #F0F0F0;
                    padding: 32px 20px;
                    z-index: 1000;
                }

                @media (max-width: 1023px) {
                    .sidebar-web { display: none; }
                }

                .sidebar-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 40px;
                    padding: 0 12px;
                }

                .logo-box {
                    background: var(--primary);
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 16px rgba(27, 184, 91, 0.2);
                }

                .logo-text {
                    font-size: 22px;
                    font-weight: 800;
                    color: #111;
                    letter-spacing: -0.5px;
                }

                .sidebar-nav {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 16px;
                    border-radius: 14px;
                    color: #666;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .sidebar-link:hover {
                    background: #F8F9FA;
                    color: #111;
                }

                .sidebar-link.active {
                    background: #E8F5E9;
                    color: var(--primary);
                }

                .link-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .sidebar-footer {
                    margin-top: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    padding-top: 24px;
                    border-top: 1px solid #F0F0F0;
                }

                .user-pill {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px;
                }

                .user-avatar-small {
                    width: 36px;
                    height: 36px;
                    background: var(--primary);
                    color: white;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                }

                .user-details {
                    display: flex;
                    flex-direction: column;
                }

                .user-name-small {
                    font-size: 14px;
                    font-weight: 700;
                    color: #111;
                }

                .user-role-small {
                    font-size: 11px;
                    color: #999;
                    font-weight: 500;
                }

                .logout-btn-web {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 16px;
                    border-radius: 12px;
                    color: #D32F2F;
                    border: 1px solid #FFEBEE;
                    background: #FFF8F8;
                    cursor: pointer;
                    font-weight: 700;
                    font-family: inherit;
                    transition: all 0.2s;
                }

                .logout-btn-web:hover {
                    background: #FFEBEE;
                    transform: translateY(-2px);
                }
            `}</style>
        </aside>
    );
};

export default Sidebar;
