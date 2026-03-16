import React from 'react';
import Sidebar from './Sidebar';

const WebLayout = ({ children }) => {
    return (
        <div className="main-container">
            <Sidebar />
            <div className="main-content-wrapper shadow-sm">
                {children}
            </div>

            <style jsx>{`
                .main-content-wrapper {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    background: #F8F9FA;
                    overflow-x: hidden;
                }

                @media (max-width: 1023px) {
                    .main-content-wrapper {
                        background: white;
                    }
                }
            `}</style>
        </div>
    );
};

export default WebLayout;
