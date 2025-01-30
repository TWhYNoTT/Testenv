
import React from 'react';



import styles from './Header.module.css';
import SearchBar from '../../SearchBar/SearchBar';
import Menu from './Menu/Menu';

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
                        <path d="M13 18.8366H20.0745" stroke="#909FBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13 23.3191H24.3192" stroke="#909FBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13 14.3537H24.3192" stroke="#909FBA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <img src="/assets/icons/layout/logo.png" alt="Devonza" className={styles.logo} />

                </div>
                <div className={styles.searchSection}>
                    <SearchBar placeholder='Search' />
                </div>
            </div>
            <div className={styles.rightSection}>
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.notificationBell} >
                    <path d="M18.538 14.8979C18.0376 14.2266 17.4537 13.5553 17.1201 12.8001C16.4528 11.2897 16.3694 9.61146 16.286 7.93323C16.2026 7.09412 16.1192 6.25501 15.8689 5.4998C15.1182 3.15028 12.7828 1.38815 10.3639 1.30423C7.69474 1.22032 5.19244 2.47899 4.27493 4.82851C3.94129 5.66763 3.77447 6.59065 3.77447 7.51368C3.60765 10.2828 3.44083 13.0518 1.27217 15.2335C0.688303 15.8209 1.10535 16.5761 1.93945 16.66C2.18968 16.66 2.3565 16.66 2.60673 16.66C5.10903 16.66 7.52793 16.66 10.0302 16.66C12.6159 16.66 15.2851 16.66 17.8708 16.66C18.2878 16.66 18.7049 16.5761 18.9551 16.0726C19.1219 15.5692 18.7883 15.3174 18.538 14.8979Z" stroke="#909FBA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.1991 19.3451C11.6986 20.0164 10.948 20.3521 10.0305 20.436C9.11298 20.3521 8.3623 20.0164 7.77844 19.2612" stroke="#909FBA" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                </svg>


                <Menu />

            </div>
        </header >
    );
};

export default Header;
