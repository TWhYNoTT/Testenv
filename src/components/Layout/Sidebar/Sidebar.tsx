// src/components/Sidebar/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {





    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.collapsed}`}>
            <nav className={styles.navMenu}>
                <ul>
                    <li>
                        <NavLink
                            to='/'
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <div className={styles.iconWraper}>
                                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.29197 14.4172H1.41803C1.20901 14.4172 1 14.15 1 13.8829V1.46009C1 1.19294 1.20901 0.925781 1.41803 0.925781H4.29197C4.50099 0.925781 4.71 1.19294 4.71 1.46009V13.8829C4.71 14.15 4.55324 14.4172 4.29197 14.4172Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M16.4023 7.06247H8.63464C8.36908 7.06247 8.10352 6.83306 8.10352 6.60365V1.3846C8.10352 1.15519 8.36908 0.925781 8.63464 0.925781H16.4687C16.7342 0.925781 16.9998 1.15519 16.9998 1.3846V6.60365C16.9334 6.89041 16.6678 7.06247 16.4023 7.06247Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M16.4023 14.4172H8.63464C8.36908 14.4172 8.10352 14.1501 8.10352 13.8829V11.0778C8.10352 10.8106 8.36908 10.5435 8.63464 10.5435H16.4687C16.7342 10.5435 16.9998 10.8106 16.9998 11.0778V13.8829C16.9334 14.1501 16.6678 14.4172 16.4023 14.4172Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <span className={styles.linkText}>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/appointments'
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.active : ''}`
                            }
                        >

                            <div className={styles.iconWraper}>
                                <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.7998 5.60222V1.22607" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M14.2002 5.60222V1.22607" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M17.875 3.18799C18.475 3.18799 19 3.79159 19 4.47065V15.8637C19 16.6937 18.475 17.2973 17.8 17.2973H2.2C1.525 17.2973 1 16.6182 1 15.8637V4.47065C1 3.71614 1.525 3.18799 2.125 3.18799H17.875V3.18799Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M1.2998 8.46924H18.6998" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <span className={styles.linkText}>Appointments</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/services'
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <div className={styles.iconWraper}>
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.5 8.31742C8.5 8.77013 8.2 9.07193 7.75 9.07193H1.75C1.375 9.07193 1 8.77013 1 8.31742V2.28136C1 1.90411 1.375 1.52686 1.75 1.52686H7.75C8.2 1.52686 8.5 1.90411 8.5 2.28136V8.31742Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M19 8.31742C19 8.77013 18.625 9.07193 18.25 9.07193H12.25C11.8 9.07193 11.5 8.77013 11.5 8.31742V2.28136C11.5 1.90411 11.8 1.52686 12.25 1.52686H18.25C18.625 1.52686 19 1.90411 19 2.28136V8.31742Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M8.5 18.8804C8.5 19.2577 8.2 19.6349 7.75 19.6349H1.75C1.375 19.6349 1 19.2577 1 18.8804V12.8444C1 12.3916 1.375 12.0898 1.75 12.0898H7.75C8.2 12.0898 8.5 12.3916 8.5 12.8444V18.8804Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M19 18.8804C19 19.2577 18.625 19.6349 18.25 19.6349H12.25C11.8 19.6349 11.5 19.2577 11.5 18.8804V12.8444C11.5 12.3916 11.8 12.0898 12.25 12.0898H18.25C18.625 12.0898 19 12.3916 19 12.8444V18.8804Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <span className={styles.linkText}>Services</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/employee'
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <div className={styles.iconWraper}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.96218 10.1037C12.4475 10.1037 14.481 8.058 14.481 5.55771C14.481 3.05741 12.4475 1.01172 9.96218 1.01172C7.47683 1.01172 5.44336 3.05741 5.44336 5.55771C5.51867 8.058 7.55214 10.1037 9.96218 10.1037Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M19 19.1959C19 14.1953 14.9331 10.1797 10.0377 10.1797C5.14226 10.1797 1 14.1953 1 19.1959" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <span className={styles.linkText}>Employees</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to='/promotion'
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <div className={styles.iconWraper}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.89844 13.2432L13.0917 7.0127" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.55698 9.02158C8.28952 9.02158 8.88887 8.41863 8.88887 7.68169C8.88887 6.94475 8.28952 6.3418 7.55698 6.3418C6.82445 6.3418 6.2251 6.94475 6.2251 7.68169C6.2251 8.41863 6.82445 9.02158 7.55698 9.02158Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.557 14.0518C13.2895 14.0518 13.8889 13.4489 13.8889 12.712C13.8889 11.975 13.2895 11.3721 12.557 11.3721C11.8244 11.3721 11.2251 11.975 11.2251 12.712C11.2251 13.4489 11.8244 14.0518 12.557 14.0518Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M18.3706 9.10847C17.7696 8.65507 17.1687 8.27723 16.5678 7.82383C16.2673 7.59712 16.1922 7.37042 16.2673 7.06815C16.4176 6.23691 16.5678 5.40567 16.6429 4.72556C16.6429 3.81876 16.1171 3.36535 15.441 3.44092C14.6899 3.51649 13.8636 3.66762 13.1125 3.81876C12.7369 3.89432 12.5115 3.74319 12.2862 3.44092C11.9106 2.83638 11.4599 2.23184 11.0092 1.6273C10.4834 0.871628 9.582 0.871628 9.05619 1.6273C8.60549 2.23184 8.1548 2.76081 7.77922 3.36535C7.55387 3.74319 7.32852 3.89432 6.87783 3.81876C6.20178 3.66762 5.45062 3.51649 4.77458 3.44092C3.72295 3.28978 3.12203 3.81876 3.34737 4.95227C3.49761 5.63237 3.57272 6.38805 3.72295 7.06815C3.79807 7.44599 3.72295 7.67269 3.42249 7.82383C2.82156 8.27723 2.22063 8.65507 1.61971 9.10847C0.793431 9.71301 0.793431 10.5443 1.61971 11.1488C2.22063 11.6022 2.82156 11.98 3.34737 12.4334C3.64784 12.6601 3.79807 12.8868 3.72295 13.2647C3.57272 14.0204 3.42249 14.776 3.34737 15.6073C3.27226 16.4385 3.87319 16.9675 4.62435 16.8163C5.37551 16.6652 6.12666 16.5896 6.95294 16.4385C7.32852 16.3629 7.55387 16.4385 7.77922 16.7408C8.22991 17.3453 8.60549 17.9499 9.05619 18.5544C9.65712 19.3856 10.4834 19.3856 11.0843 18.5544C11.535 17.9499 11.9857 17.3453 12.3613 16.7408C12.5115 16.4385 12.7369 16.3629 13.1125 16.4385C13.7885 16.5896 14.5397 16.6652 15.2157 16.8163C16.3424 17.043 16.9434 16.4385 16.718 15.305C16.5678 14.6249 16.4927 13.8692 16.3424 13.1891C16.2673 12.8113 16.3424 12.6601 16.6429 12.4334C17.2438 11.98 17.8448 11.6022 18.4457 11.1488C19.1968 10.5443 19.1968 9.71301 18.3706 9.10847Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <span className={styles.linkText}>Promotions</span>
                        </NavLink>
                    </li>

                    <div className={styles.dividerContainer}>
                        <div className={styles.divider}></div>
                    </div>
                    <li>
                        <NavLink
                            to='/settings'
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <div className={styles.iconWraper}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.375 12.175C16.525 11.8 16.975 11.425 17.35 11.35L18.25 11.2C18.625 11.125 19 10.75 19 10.375V9.475C19 9.025 18.7 8.65 18.25 8.65L17.35 8.5C16.975 8.425 16.525 8.05 16.375 7.675L16.075 6.925C15.85 6.55 15.925 6.025 16.15 5.65L16.675 4.9C16.975 4.675 16.975 4.15 16.675 3.85L16.075 3.25C15.775 2.95 15.25 2.95 14.95 3.175L14.2 3.775C13.9 4 13.3 4.075 12.925 3.925C12.55 3.775 11.5 3.1 11.425 2.65L11.275 1.75C11.2 1.375 10.825 1 10.45 1H9.55C9.1 1 8.725 1.3 8.725 1.75L8.65 2.65C8.575 3.025 8.2 3.475 7.825 3.625L7.075 3.925C6.7 4.075 6.175 4.075 5.8 3.775L5.05 3.175C4.75 3.025 4.225 3.025 3.925 3.325L3.325 3.925C3.1 4.225 3.025 4.75 3.325 5.05L3.85 5.8C4.075 6.1 4.15 6.7 3.925 7.075L3.625 7.825C3.475 8.2 3.025 8.575 2.65 8.65H1.75C1.375 8.725 1 9.1 1 9.475V10.375C1 10.75 1.3 11.2 1.75 11.2L2.65 11.275C3.025 11.35 3.475 11.725 3.625 12.1L3.925 12.85C4.15 13.225 4.075 13.825 3.85 14.125L3.325 14.875C3.1 15.175 3.1 15.7 3.4 16L4 16.6C4.3 16.9 4.825 16.9 5.125 16.675L5.875 16.15C6.175 15.925 6.775 15.85 7.15 16.075C7.525 16.3 8.575 16.9 8.65 17.35L8.8 18.25C8.875 18.625 9.25 19 9.625 19H10.525C10.975 19 11.35 18.7 11.35 18.25L11.5 17.35C11.575 16.975 11.95 16.525 12.325 16.375L13 16.075C13.375 15.85 13.9 15.925 14.275 16.15L15.025 16.675C15.325 16.9 15.85 16.9 16.15 16.6L16.75 16C17.05 15.7 17.05 15.175 16.825 14.875L16.3 14.125C16.075 13.825 16 13.225 16.225 12.85C16.3 12.55 16.375 12.175 16.375 12.175Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
                                    <path d="M10.0752 13.375C11.9392 13.375 13.4502 11.864 13.4502 10C13.4502 8.13604 11.9392 6.625 10.0752 6.625C8.21123 6.625 6.7002 8.13604 6.7002 10C6.7002 11.864 8.21123 13.375 10.0752 13.375Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
                                </svg>
                            </div>
                            <span className={styles.linkText}>Settings</span>
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to='/help'
                            className={({ isActive }) =>
                                `${styles.navLink} ${isActive ? styles.active : ''}`
                            }
                        >
                            <div className={styles.iconWraper}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M9.9998 15.15C10.4554 15.15 10.8248 14.7806 10.8248 14.325C10.8248 13.8694 10.4554 13.5 9.9998 13.5C9.54417 13.5 9.1748 13.8694 9.1748 14.325C9.1748 14.7806 9.54417 15.15 9.9998 15.15Z" fill="#909FBA" />
                                    <path d="M9.8502 11.7998C9.6252 11.6498 9.4752 11.3498 9.4752 11.1248C9.4752 9.6998 12.3252 9.4748 12.3252 7.2998C12.3252 6.0248 11.2752 5.0498 9.4752 5.0498C8.1252 5.0498 7.0002 5.6498 6.3252 6.5498" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <span className={styles.linkText}>Help</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
