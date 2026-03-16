import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
        const timer = setTimeout(() => {
            navigate('/login');
        }, 2500); // 2.5 seconds splash

        return () => clearTimeout(timer);
    }, [user, navigate]);

    return (
        <div className="splash-screen">
            <div className={`splash-content ${animate ? 'animate' : ''}`}>
                {/* Logo Circle */}
                <div className="logo-circle">
                    <span className="logo-emoji">💪</span>
                </div>

                <div className="spacer-60"></div>

                {/* App Name */}
                <h1 className="brand-name">FitZone</h1>
                <p className="brand-subtitle">Smart Gym Management System</p>

                <div className="spacer-80"></div>

                {/* Feature Icons */}
                <div className="feature-row">
                    <div className="feature-icon-item">
                        <div className="feature-icon-box">⚡</div>
                        <span className="feature-label">AI Powered</span>
                    </div>
                    <div className="feature-icon-item">
                        <div className="feature-icon-box">📈</div>
                        <span className="feature-label">Real-time Tracking</span>
                    </div>
                </div>

                <div className="spacer-60"></div>

                {/* Dot Indicators */}
                <div className="dot-row">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>

            <style jsx>{`
        .splash-screen {
          height: 100vh;
          width: 100vw;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .splash-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.8s ease-out;
        }
        .splash-content.animate {
          opacity: 1;
          transform: scale(1);
        }
        
        .logo-circle {
          width: 200px;
          height: 200px;
          background-color: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(27, 184, 91, 0.2);
        }
        .logo-emoji {
          font-size: 80px;
        }
        
        .brand-name {
          font-size: 56px;
          font-weight: 800;
          color: var(--primary);
          margin: 0;
        }
        .brand-subtitle {
          font-size: 16px;
          color: #666666;
          margin: 4px 0 0;
          font-weight: 500;
        }
        
        .feature-row {
          display: flex;
          gap: 40px;
        }
        .feature-icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .feature-icon-box {
          width: 60px;
          height: 60px;
          background: rgba(27, 184, 91, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }
        .feature-label {
          font-size: 12px;
          color: #666666;
          font-weight: 600;
        }
        
        .dot-row {
          display: flex;
          gap: 12px;
        }
        .dot {
          width: 12px;
          height: 12px;
          background-color: var(--primary);
          border-radius: 50%;
        }
        
        .spacer-60 { height: 60px; }
        .spacer-80 { height: 80px; }
      `}</style>
        </div>
    );
};

export default Home;
