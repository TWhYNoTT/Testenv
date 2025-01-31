import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Settings.module.css';

const Settings: React.FC = () => {
    const navigate = useNavigate();

    const handleSettingCardClick = (route: string) => {
        navigate(route);
    };
    return (
        <div className={styles.settingsPage}>
            <h2 className="xH1">Settings</h2>
            <div className={styles.settingSection}>
                <h3>Account management</h3>
                <div className={styles.horR}></div>

                <div className={styles.settingCards}>
                    <div onClick={() => handleSettingCardClick('accountsettings')} className={styles.settingCard}>
                        <svg width="47" height="38" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2503 18.5C23.0341 18.5 26.9481 14.5625 26.9481 9.75C26.9481 4.9375 23.0341 1 18.2503 1C13.4666 1 9.55262 4.9375 9.55262 9.75C9.69758 14.5625 13.6116 18.5 18.2503 18.5Z" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M35.6459 36.0006C35.6459 26.3756 27.818 18.6465 18.3954 18.6465C8.97291 18.6465 1 26.3756 1 36.0006" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <div className={styles.cardContent}>
                            <h4>Account settings</h4>
                            <p>Manage account settings and payment information</p>
                        </div>
                    </div>
                    <div onClick={() => handleSettingCardClick('paymentsettings')} className={styles.settingCard}>
                        <svg width="42" height="29" viewBox="0 0 42 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M38.0002 1C39.4868 1 40.643 2.16649 40.643 3.66626V24.6631C40.643 26.1628 39.4868 27.3293 38.0002 27.3293H3.64287C2.15625 27.3293 1 26.1628 1 24.6631V3.66626C1 2.16649 2.15625 1 3.64287 1H38.0002Z" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M1.33038 9.16504H40.1475" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M27.7591 17.498H35.6877" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <div className={styles.cardContent}>
                            <h4>Payment settings</h4>
                            <p>Manage payment method</p>
                        </div>
                    </div>
                    <div onClick={() => handleSettingCardClick('branches')} className={styles.settingCard}>
                        <svg width="47" height="38" viewBox="0 0 47 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.7 1.90039H8.73999C8.01999 1.90039 7.29999 2.26039 6.93999 2.80039L2.79999 9.82039C1.71999 11.8004 1.53999 13.9604 2.43999 15.9404C3.33999 18.1004 5.13999 18.6404 5.13999 18.6404C9.27999 20.2604 12.7 14.5004 12.7 14.5004C16.12 19.5404 18.46 18.6404 18.46 18.6404C21.88 18.6404 23.5 14.5004 23.5 14.5004C23.5 14.5004 26.02 18.6404 28.72 18.6404C28.72 18.6404 31.24 19.5404 34.48 14.5004C34.48 14.5004 37.9 20.2604 42.04 18.6404C42.04 18.6404 43.66 18.2804 44.74 15.9404C45.46 13.9604 45.28 11.8004 44.2 9.82039L40.06 2.80039C39.7 2.26039 38.98 1.90039 38.26 1.90039H25.12H21.7Z" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" />
                            <path d="M40.96 18.6406V34.3006C40.96 35.3806 40.06 36.1006 39.16 36.1006H7.83999C6.75999 36.1006 6.03999 35.2006 6.03999 34.3006V18.6406" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" />
                            <path d="M6.03999 26.0205H40.96" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" />
                        </svg>

                        <div className={styles.cardContent}>
                            <h4>Branches</h4>
                            <p>Manage multiple branches</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.settingSection}>
                <h3>Employees</h3>
                <div className={styles.horR}></div>
                <div className={styles.settingCards}>
                    <div onClick={() => handleSettingCardClick('userroles')} className={styles.settingCard}>
                        <svg width="54" height="33" viewBox="0 0 54 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M42.472 8.74178C42.472 12.8941 39.016 16.3908 34.912 16.3908C30.808 16.3908 27.352 12.8941 27.352 8.74178C27.352 4.58946 30.808 1.09277 34.912 1.09277C39.016 1.09277 42.472 4.58946 42.472 8.74178Z" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M17.632 31.9074C17.632 22.073 25.408 20.7617 35.128 20.7617C44.848 20.7617 52.624 22.073 52.624 31.9074" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M18.28 9.6169C18.28 12.6765 15.904 15.0805 12.88 15.0805C9.856 15.0805 7.48 12.6765 7.48 9.6169C7.48 6.55729 9.856 4.15332 12.88 4.15332C15.904 4.15332 18.28 6.55729 18.28 9.6169Z" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M1 25.7884C1 18.7951 6.616 17.9209 13.312 17.9209C17.632 17.9209 21.304 18.358 23.464 20.3249C23.896 20.762 24.328 21.199 24.544 21.6361" stroke="#6138E0" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <div className={styles.cardContent}>
                            <h4>User roles</h4>
                            <p>Manage user roles and permission access roles</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;