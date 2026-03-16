import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

import logoLeft from '../assets/logo_left.jpg';
import logoRight from '../assets/logo_right.jpg';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/login', { email, password });
      login(response.data);

      const { next_page } = response.data;
      if (next_page === 'gym_dashboard') {
        navigate('/admin-dashboard');
      } else if (next_page === 'user_dashboard') {
        navigate('/dashboard');
      } else if (next_page === 'setup_gym') {
        navigate('/setup-gym');
      } else if (next_page === 'select_gym') {
        navigate('/select-gym');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      <div className="login-viewport">
        <div className="spacer-40"></div>

        {/* Animated Background Elements */}
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>

        <div className="login-card-container">
          <div className="login-header text-center">
            <div className="logos-wrapper">
              <img src={logoLeft} alt="Saveetha Logo" className="side-logo" />
              <div className="logo-box">
                <span className="logo-icon">💪</span>
              </div>
              <img src={logoRight} alt="SES Logo" className="side-logo" />
            </div>
            <div className="spacer-24"></div>
            <h1 className="login-title">FitZone</h1>
            <p className="login-subtitle">Elevate Your Fitness Experience</p>
          </div>

          <div className="spacer-40"></div>

          <form onSubmit={handleLogin} className="login-form-premium">
            <div className="input-group-modern">
              <label className="label-modern">Email or Mobile</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="text"
                  className="input-modern"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="spacer-20"></div>

            <div className="input-group-modern">
              <label className="label-modern">Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  className="input-modern"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="forgot-password-link">
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-primary-link">Forgot Password?</button>
            </div>

            {error && (
              <div className="error-alert">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="spacer-32"></div>

            <button type="submit" className="btn btn-primary btn-xl" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-8"><RefreshCw className="animate-spin" size={20} /> Authenticating...</span>
              ) : (
                <span className="flex items-center gap-8">Login <LogIn size={20} /></span>
              )}
            </button>
          </form>

          <div className="spacer-32"></div>

          <div className="register-prompt text-center">
            <span>New to FitZone?</span>
            <button onClick={() => navigate('/register')} className="text-primary-bold">Create Account</button>
          </div>
        </div>

        <div className="spacer-40"></div>

        <div className="login-footer">
          <p>powered by SIMATS ENGINEERING</p>
        </div>
      </div>

      <style jsx>{`
        .login-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 24px;
          position: relative;
          overflow: hidden;
          background: #FAFAFA;
        }

        @media (min-width: 1024px) {
          .login-viewport {
            justify-content: center;
            align-items: center;
            background: #F1F5F9;
          }
          .login-card-container {
            width: 100%;
            max-width: 450px;
            background: white;
            padding: 40px;
            border-radius: 32px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.05);
            margin-top: 0 !important;
          }
          .bg-blob { width: 500px; height: 500px; opacity: 0.15; }
        }

        .bg-blob { position: absolute; width: 300px; height: 300px; border-radius: 50%; filter: blur(60px); z-index: 0; opacity: 0.1; }
        .blob-1 { top: -100px; right: -100px; background: #1BB85B; }
        .blob-2 { bottom: -100px; left: -100px; background: #1976D2; }

        .login-card-container { position: relative; z-index: 1; margin-top: 20px; }
        
        .logos-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 8px;
        }

        .side-logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
          border-radius: 12px;
          background: white;
          padding: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .logo-box { 
          width: 80px; height: 80px; background: white; border-radius: 24px; 
          display: flex; align-items: center; justify-content: center; font-size: 40px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          z-index: 2;
        }

        .login-title { font-size: 36px; font-weight: 800; color: #111; margin: 0; }
        .login-subtitle { font-size: 15px; color: #888; margin-top: 4px; }

        .form-premium { width: 100%; }
        
        .input-group-modern { display: flex; flex-direction: column; gap: 8px; }
        .label-modern { font-size: 14px; font-weight: 600; color: #444; }
        
        .input-with-icon { position: relative; }
        .input-icon { position: absolute; left: 18px; top: 19px; color: #AAA; z-index: 10; }
        .input-modern { 
          width: 100%; height: 56px; padding: 0 20px 0 50px; background: white; 
          border: 1.5px solid #F0F0F0; border-radius: 16px; font-size: 15px; 
          transition: all 0.2s; 
        }
        .input-modern:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(27, 184, 91, 0.1); outline: none; }

        .forgot-password-link { text-align: right; margin-top: 12px; }
        .text-primary-link { background: none; border: none; font-size: 13px; font-weight: 600; color: var(--primary); cursor: pointer; }

        .error-alert { 
          display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #FEF2F2; 
          border: 1px solid #FCA5A5; border-radius: 12px; color: #B91C1C; font-size: 13px; margin-top: 20px;
        }

        .btn-xl { height: 56px; border-radius: 16px; font-size: 16px; letter-spacing: 0.5px; }

        .register-prompt { font-size: 14px; color: #666; }
        .text-primary-bold { background: none; border: none; font-size: 14px; font-weight: 700; color: var(--primary); cursor: pointer; margin-left: 6px; }

        .server-status-tag { 
          display: flex; align-items: center; gap: 8px; background: #F0F0F0; 
          padding: 6px 14px; border-radius: 20px; font-size: 11px; color: #888;
          width: fit-content; margin: 0 auto;
        }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ADE80; }
        .pulse { animation: pulseAnim 2s infinite; }
        @keyframes pulseAnim { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .login-footer {
          margin-top: auto;
          padding: 24px 0;
          text-align: center;
          color: #888;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;
