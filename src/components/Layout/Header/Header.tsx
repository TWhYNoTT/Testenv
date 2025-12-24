
import React from 'react';

import styles from './Header.module.css';
import SearchBar from '../../SearchBar/SearchBar';
import Menu from './Menu/Menu';
import NotificationBell from '../../Notifications/NotificationBell';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {

    return (

        <header className={styles.header}>
            <div className={styles.leftSection}>
                <div className={styles.iconSection}>
                    {/* <img src="./assets/icons/layout/menu.png" alt="menuicon"  /> */}
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.burgerIcon} onClick={toggleSidebar}>
                        <rect width="38" height="38" rx="14" fill="white" />
                        <path d="M13 18.8366H20.0745" stroke="#909FBA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 23.3191H24.3192" stroke="#909FBA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M13 14.3537H24.3192" stroke="#909FBA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <img src="/assets/icons/layout/logo.png" alt="Devonza" className={styles.logo} />

                </div>
                <div className={styles.searchSection}>
                    <SearchBar placeholder='Search' />
                </div>
            </div>
            <div className={styles.rightSection}>
                <NotificationBell className={styles.notificationBell} />

                <Menu />

            </div>
        </header >
    );
};

export default Header;
