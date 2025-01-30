import React, { useState, useRef, useEffect } from 'react';
import styles from './menu.module.css';

interface MenuComponentProps {
    profileName?: string;
    profileImage?: string;
    onSettingsClick?: () => void;
    onFaqClick?: () => void;
    onLogoutClick?: () => void;
    onLanguageChange?: (language: string) => void;
}

const Menu: React.FC<MenuComponentProps> = ({
    profileName = 'Abdo Mostafa',
    profileImage = '/assets/icons/avatar.png',
    onSettingsClick = () => { },
    onFaqClick = () => { },
    onLogoutClick = () => { },
    onLanguageChange = () => { },
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={styles.menuContainer} ref={menuRef}>
            <div className={`${styles.menuTrigger} arrowUpDown ${isOpen ? 'isOpen' : ''}`} onClick={handleToggle}>
                <img src={profileImage} alt="Profile" />
            </div>
            {isOpen && (
                <div className={styles.menuContent}>
                    <div className={styles.menuProfile}>
                        <img src={profileImage} alt="Profile" />
                        <div className={styles.profileDetails}>
                            <div className={styles.profileName}>{profileName}</div>
                            <a href='\' className={styles.profileSettings} onClick={onSettingsClick}>Account settings</a>
                        </div>
                    </div>
                    <div className={styles.menuDivider}></div>
                    <span className={styles.languagesTitle}>Languages</span>
                    <div className={styles.menuLanguages}>
                        <span className={styles.activeLanguage} onClick={() => onLanguageChange('English')}>English</span>
                        <span className={styles.inactiveLanguage} onClick={() => onLanguageChange('Arabic')}>العربية</span>
                    </div>
                    <div className={styles.menuDivider}></div>
                    <span>
                        <span className={styles.menuItem} onClick={onFaqClick}>FAQ</span>
                    </span>
                    <span>
                        <span className={styles.menuItem} onClick={onLogoutClick}>Logout</span>
                    </span>
                </div>
            )}
        </div>
    );
};

export default Menu;
