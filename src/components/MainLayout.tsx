import React, { useState } from 'react';
import Sidebar from './Layout/Sidebar/Sidebar';
import Header from './Layout/Header/Header';


import styles from './mainlayout.module.css'



interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {


    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <Header toggleSidebar={toggleSidebar} />
            <div className={styles.layout}>
                <div className={`${styles.mainContent} ${isSidebarOpen ? '' : styles.fullWidth}`}>
                    <Sidebar isOpen={isSidebarOpen} />
                    <main className={styles.content}>
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default MainLayout;
