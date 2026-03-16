import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Calendar,
    History,
    User as UserIcon,
    Settings,
    LogOut,
    LayoutDashboard,
    Dumbbell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="layout-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo-container">
                    <Dumbbell className="text-primary" size={32} />
                    <span className="logo-text">fit<span className="text-primary">Zone</span></span>
                </div>

                <nav className="nav-menu">
                    <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem to="/book-slot" icon={<Calendar size={20} />} label="Book Slot" />
                    <NavItem to="/history" icon={<History size={20} />} label="Booking History" />
                    <NavItem to="/profile" icon={<UserIcon size={20} />} label="Profile" />
                    <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="user-info">
                            <p className="user-name">{user?.name || 'Guest'}</p>
                            <p className="user-role">{user?.role?.replace('_', ' ') || 'User'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="content-header">
                    <h2 className="page-title">Gym fitZone</h2>
                    <div className="header-actions">
                        <div className="gym-badge">
                            <Calendar size={16} />
                            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                        </div>
                    </div>
                </header>
                <div className="page-content">
                    {children}
                </div>
            </main>

            <style jsx>{`
        .layout-container {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 280px;
          background: var(--secondary);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          position: fixed;
          height: 100vh;
          z-index: 100;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3rem;
          padding-left: 0.5rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.05em;
        }

        .nav-menu {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          padding: 2rem 3rem;
          background-color: var(--bg-dark);
        }

        @media (max-width: 991px) {
          .sidebar { width: 80px; padding: 2rem 1rem; }
          .logo-text, .user-info, .sidebar-footer span, .nav-label { display: none; }
          .main-content { margin-left: 80px; }
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
        }

        .gym-badge {
          background: var(--bg-card);
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sidebar-footer {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.5rem;
          margin-top: auto;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 0.5rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: var(--primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.25rem;
        }

        .user-name {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .user-role {
          font-size: 0.75rem;
          color: var(--text-secondary);
          text-transform: capitalize;
        }

        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          color: var(--danger);
          cursor: pointer;
          transition: var(--transition);
          border-radius: 0.75rem;
          font-family: var(--font-main);
          font-weight: 600;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
        }
      `}</style>
        </div>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
    >
        {icon}
        <span className="nav-label">{label}</span>
        <style jsx>{`
      .nav-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1.25rem;
        border-radius: 0.75rem;
        color: var(--text-secondary);
        text-decoration: none;
        transition: var(--transition);
        font-weight: 500;
      }

      .nav-item:hover {
        background: rgba(255, 255, 255, 0.05);
        color: white;
      }

      .nav-item.active {
        background: var(--primary);
        color: white;
        box-shadow: 0 4px 15px rgba(255, 77, 0, 0.3);
      }
    `}</style>
    </NavLink>
);

export default Layout;
