import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../../contexts/UserContext';
import { useToast } from '../../../../contexts/ToastContext';
import LoadingOverlay from '../../../LoadingOverlay/LoadingOverlay';
import styles from './menu.module.css';

interface MenuComponentProps {
    onSettingsClick?: () => void;
    onFaqClick?: () => void;
    onLanguageChange?: (language: string) => void;
}

const Menu: React.FC<MenuComponentProps> = ({
    onSettingsClick = () => { },
    onFaqClick = () => { },
    onLanguageChange = () => { },
}) => {
    const { user, logout, loading } = useUser();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const defaultAvatar = '/assets/icons/avatar.png';

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const success = await logout();
            if (success) {
                showToast('Logged out successfully', 'success');
                navigate('/form/login');
            }
        } catch (error) {

        } finally {
            setIsLoggingOut(false);
        }
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
        <>
            {(isLoggingOut || loading) && (
                <LoadingOverlay message={loading ? "Loading user info..." : "Logging out..."} />
            )}
            <div className={styles.menuContainer} ref={menuRef}>
                <div className={`${styles.menuTrigger} arrowUpDown ${isOpen ? 'isOpen' : ''}`} onClick={handleToggle}>
                    <img src={defaultAvatar} alt="Profile" />
                </div>
                {isOpen && (
                    <div className={styles.menuContent}>
                        <div className={styles.menuProfile}>
                            <img src={defaultAvatar} alt="Profile" />
                            <div className={styles.profileDetails}>
                                <div className={styles.profileName}>{user?.fullName || 'User'}</div>
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
                            <span className={styles.menuItem} onClick={handleLogout}>Logout</span>
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};

export default Menu;
