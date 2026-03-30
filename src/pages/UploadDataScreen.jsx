import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, FileUp, Info, ChevronRight } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import WebLayout from '../components/WebLayout';

const UploadDataScreen = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [historicalFile, setHistoricalFile] = useState(null);
    const [membersFile, setMembersFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async () => {
        if (!historicalFile || !membersFile) return;
        setIsLoading(true);

        const formDataH = new FormData();
        formDataH.append('file', historicalFile);
        formDataH.append('admin_user_id', user.user_id);

        const formDataM = new FormData();
        formDataM.append('file', membersFile);
        formDataM.append('admin_user_id', user.user_id);

        try {
            // Upload historical
            await api.post('/upload-historical-data', formDataH, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Upload members
            await api.post('/upload-gym-members', formDataM, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            navigate('/set-capacity');
        } catch (err) {
            alert(err.response?.data?.message || 'Upload failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WebLayout>
            <div className="main-viewport">
                {/* Header */}
                <header className="app-header-premium">
                    <div className="header-content-flex">
                        <button onClick={() => navigate('/configure-hours')} className="back-btn-modern">
                            <ArrowLeft size={22} color="white" />
                        </button>
                        <div className="header-text-main">
                            <h1 className="header-title-premium">Import Data</h1>
                            <p className="header-subtitle-premium">Training the AI • Step 3/3</p>
                        </div>
                    </div>
                </header>

                <main className="content-area-premium">
                    <div className="section-px">
                        <div className="spacer-24"></div>

                        {/* Format Instructions Card */}
                        <div className="format-instruction-card">
                            <h3 className="format-title">
                                📋 Excel File Format Instructions
                            </h3>

                            {/* Historical Bookings Format */}
                            <div className="format-section">
                                <span className="format-subtitle">📅 Historical Bookings Format:</span>
                                <div className="format-table-container">
                                    <table className="format-table">
                                        <thead>
                                            <tr>
                                                <th>date</th>
                                                <th>slot</th>
                                                <th>bookingCount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>2026-02-01</td>
                                                <td>06:00-07:00</td>
                                                <td>8</td>
                                            </tr>
                                            <tr>
                                                <td>2026-02-01</td>
                                                <td>6 PM - 8 PM</td>
                                                <td>15</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Gym Members Format */}
                            <div className="format-section">
                                <span className="format-subtitle">👥 Gym Members Format:</span>
                                <div className="format-table-container">
                                    <table className="format-table">
                                        <thead>
                                            <tr>
                                                <th>memberId</th>
                                                <th>name</th>
                                                <th>email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>MEM001</td>
                                                <td>John Doe</td>
                                                <td>john@example.com</td>
                                            </tr>
                                            <tr>
                                                <td>MEM002</td>
                                                <td>Jane Smith</td>
                                                <td>jane@example.com</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <span className="text-optional">* email column is optional</span>

                            {/* Hint Box */}
                            <div className="hint-box">
                                <p className="hint-text">
                                    <span>💡</span>
                                    <span>Hint: Column headings in your Excel file must match the names in the first row of tables above exactly to avoid upload errors.</span>
                                </p>
                            </div>
                        </div>

                        {/* Historical Data */}
                        <div className="upload-section mb-24">
                            <h3 className="label-modern mb-12">1. Past Bookings (.xlsx)</h3>
                            <label className={`upload-card-modern ${historicalFile ? 'uploaded' : ''}`}>
                                <FileUp size={28} className="upload-icon" />
                                <div className="upload-text-content">
                                    <span className="upload-main-text">
                                        {historicalFile ? historicalFile.name : "Select Historical File"}
                                    </span>
                                    <span className="upload-sub-text">
                                        {historicalFile ? "File selected successfully" : "Required columns: date, slot, bookingCount"}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    className="hidden-input"
                                    onChange={(e) => setHistoricalFile(e.target.files[0])}
                                />
                                {historicalFile && <div className="success-dot"><Check size={12} color="white" /></div>}
                            </label>
                        </div>

                        {/* Members Data */}
                        <div className="upload-section mb-32">
                            <h3 className="label-modern mb-12">2. Members List (.xlsx)</h3>
                            <label className={`upload-card-modern ${membersFile ? 'uploaded' : ''}`}>
                                <FileUp size={28} className="upload-icon" />
                                <div className="upload-text-content">
                                    <span className="upload-main-text">
                                        {membersFile ? membersFile.name : "Select Members File"}
                                    </span>
                                    <span className="upload-sub-text">
                                        {membersFile ? "File selected successfully" : "Required columns: memberId, name"}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    className="hidden-input"
                                    onChange={(e) => setMembersFile(e.target.files[0])}
                                />
                                {membersFile && <div className="success-dot"><Check size={12} color="white" /></div>}
                            </label>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={handleUpload}
                            disabled={isLoading || !historicalFile || !membersFile}
                            className={`btn btn-primary btn-xl w-full ${(!historicalFile || !membersFile) ? 'btn-disabled' : ''}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-12">
                                    <div className="spinner-small"></div>
                                    <span>Processing Data...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-8">
                                    <span>Proceed to Capacity</span>
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
                
                .format-instruction-card { 
                    background: #F0F9F5; border: 1.5px solid var(--primary); 
                    border-radius: 20px; padding: 24px; margin-bottom: 32px;
                }
                .format-title { 
                    font-size: 16px; font-weight: 800; color: var(--primary); 
                    margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
                }
                .format-section { margin-bottom: 20px; }
                .format-subtitle { 
                    font-size: 13px; font-weight: 700; color: #1E293B; 
                    margin-bottom: 10px; display: block; 
                }
                .format-table-container { 
                    background: white; border-radius: 12px; padding: 12px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03); overflow-x: auto;
                }
                .format-table { width: 100%; border-collapse: collapse; }
                .format-table th { 
                    text-align: left; padding: 8px 12px; background: #F8FAFC; 
                    font-size: 11px; font-weight: 800; color: #64748B; border-radius: 6px;
                }
                .format-table td { padding: 8px 12px; font-size: 12px; color: #334155; font-weight: 500; }
                
                .text-optional { font-size: 11px; color: #94A3B8; font-style: italic; display: block; margin-bottom: 16px; }
                
                .hint-box { 
                    background: #FFFBEB; border: 1px solid #FEF3C7; 
                    border-radius: 12px; padding: 16px; 
                }
                .hint-text { 
                    font-size: 12px; font-weight: 700; color: #92400E; 
                    line-height: 1.5; display: flex; gap: 8px; margin: 0;
                }

                .bg-soft-blue { background: #EFF6FF; border: 1.5px solid #DBEAFE; }
                .info-icon-box-blue { background: white; width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.05); }

                .label-modern { font-size: 13px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; }

                .upload-card-modern { 
                    display: flex; align-items: center; gap: 16px; padding: 20px; 
                    background: white; border: 2px dashed #E2E8F0; border-radius: 20px; 
                    cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .upload-card-modern:hover { border-color: var(--primary); background: #F8FAFC; transform: translateY(-2px); }
                .upload-card-modern.uploaded { border-style: solid; border-color: var(--primary); background: #F0FDF4; }

                .upload-icon { color: #94A3B8; transition: color 0.3s; }
                .uploaded .upload-icon { color: var(--primary); }

                .upload-text-content { display: flex; flex-direction: column; gap: 2px; }
                .upload-main-text { font-size: 15px; font-weight: 700; color: #1E293B; }
                .upload-sub-text { font-size: 11px; font-weight: 600; color: #94A3B8; }

                .hidden-input { display: none; }

                .success-dot { 
                    position: absolute; right: 20px; width: 24px; height: 24px; 
                    background: var(--primary); border-radius: 50%; 
                    display: flex; align-items: center; justify-content: center;
                    animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

                .btn-disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(1); }
                .btn-xl { height: 56px; border-radius: 16px; font-size: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; }

                .spinner-small { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .line-15 { line-height: 1.5; }
            `}</style>
        </WebLayout>
    );
};

export default UploadDataScreen;
