import React, { useState, useEffect } from 'react';
import InputField from '../../../components/InputField/InputField';
import Button from '../../../components/Button/Button';
import styles from './Profile.module.css';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useToast } from '../../../contexts/ToastContext';
import useNavigationPrompt from '../../../hooks/useNavigationPrompt';

const Profile: React.FC = () => {
    const { profile, loadProfile, updateProfile, changePassword } = useUserProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ fullName: '', email: '', phoneNumber: '', countryCode: '' });
    const [saving, setSaving] = useState(false);
    const [changePwMode, setChangePwMode] = useState(false);
    const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwSaving, setPwSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [hasUnsavedPasswordChanges, setHasUnsavedPasswordChanges] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        if (profile) {
            setForm({ fullName: profile.fullName || '', email: profile.email || '', phoneNumber: profile.phoneNumber || '', countryCode: profile.countryCode || '' });
        }
    }, [profile]);

    useEffect(() => {
        if (!profile) loadProfile();
    }, [profile, loadProfile]);

    // Track unsaved changes in profile form
    useEffect(() => {
        if (profile && isEditing) {
            const changed = form.fullName !== profile.fullName ||
                form.email !== profile.email ||
                form.phoneNumber !== profile.phoneNumber ||
                form.countryCode !== profile.countryCode;
            setHasUnsavedChanges(changed);
        } else {
            setHasUnsavedChanges(false);
        }
    }, [form, profile, isEditing]);

    // Track unsaved changes in password form
    useEffect(() => {
        if (changePwMode) {
            const hasPasswordData = pw.currentPassword !== '' || pw.newPassword !== '' || pw.confirmPassword !== '';
            setHasUnsavedPasswordChanges(hasPasswordData);
        } else {
            setHasUnsavedPasswordChanges(false);
        }
    }, [pw, changePwMode]);

    // Warn before leaving page with unsaved changes (profile or password)
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges || hasUnsavedPasswordChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges, hasUnsavedPasswordChanges]);

    // Prompt for in-app navigation when there are unsaved changes
    useNavigationPrompt((hasUnsavedChanges || hasUnsavedPasswordChanges));
    const handleChange = (name: string, value: string) => setForm(prev => ({ ...prev, [name]: value }));

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm('You have unsaved changes. Do you want to discard them?');
            if (!confirmed) return;
        }
        if (profile) setForm({ fullName: profile.fullName, email: profile.email, phoneNumber: profile.phoneNumber, countryCode: profile.countryCode });
        setIsEditing(false);
        setHasUnsavedChanges(false);
    };

    const parseApiErrors = (err: any) => {
        try {
            const errors = err?.response?.data?.errors;
            if (errors && typeof errors === 'object') {
                // errors values may be arrays
                const msgs = Object.values(errors).flat().join('. ');
                return msgs;
            }
            return err?.response?.data?.message || err?.message || 'An error occurred';
        } catch (ex) {
            return 'An error occurred';
        }
    };

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phone: string): boolean => {
        const phoneRegex = /^[0-9]*$/;
        return phoneRegex.test(phone) && phone.length >= 5 && phone.length <= 15;
    };

    const validateCountryCode = (code: string): boolean => {
        const codeRegex = /^\+?[0-9]{1,4}$/;
        return codeRegex.test(code);
    };

    const validateFullName = (name: string): boolean => {
        return name.length >= 5 && name.length <= 50;
    };

    const isFormValid = (): boolean => {
        return validateFullName(form.fullName) &&
            validateEmail(form.email) &&
            validatePhoneNumber(form.phoneNumber) &&
            validateCountryCode(form.countryCode);
    };

    const handleSave = async () => {
        // Validate before saving
        if (!isFormValid()) {
            showToast('Please ensure all fields are valid', 'error');
            return;
        }

        setSaving(true);
        try {
            await updateProfile({ fullName: form.fullName, email: form.email, phoneNumber: form.phoneNumber, countryCode: form.countryCode ?? '' });
            showToast('Profile updated successfully', 'success');
            setIsEditing(false);
            setHasUnsavedChanges(false);
            await loadProfile();
        } catch (err: any) {
            const msg = parseApiErrors(err);
            showToast(msg, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePwChange = async () => {
        if (pw.newPassword !== pw.confirmPassword) {
            showToast('New password and confirm password do not match', 'error');
            return;
        }

        setPwSaving(true);
        try {
            await changePassword({ currentPassword: pw.currentPassword, newPassword: pw.newPassword, confirmPassword: pw.confirmPassword });
            setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setChangePwMode(false);
            setHasUnsavedPasswordChanges(false);
            showToast('Password changed successfully', 'success');
        } catch (err: any) {
            const msg = parseApiErrors(err);
            showToast(msg, 'error');
        } finally {
            setPwSaving(false);
        }
    };

    const handleCancelPasswordChange = () => {
        if (hasUnsavedPasswordChanges) {
            const confirmed = window.confirm('You have unsaved changes. Do you want to discard them?');
            if (!confirmed) return;
        }
        setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setChangePwMode(false);
        setHasUnsavedPasswordChanges(false);
    };

    return (
        <div className={styles.profileCard}>
            {!isEditing && (
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>Profile Information</div>
                    <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                        <svg className={styles.editIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Edit
                    </button>
                </div>
            )}

            <div className={styles.cardRow}>
                <div>
                    <div className={styles.cardLabel}>Full Name</div>

                </div>
                <div className={styles.cardValue}>{profile?.fullName || ''}</div>
            </div>
            <div className={styles.cardRow}>
                <div>
                    <div className={styles.cardLabel}>Email</div>

                </div>
                <div className={styles.cardValue}>{profile?.email || ''}</div>
            </div>
            <div className={styles.cardRow}>
                <div>
                    <div className={styles.cardLabel}>Phone</div>

                </div>
                <div className={styles.phoneRow}>
                    <div className={styles.countryCodeBadge}>{profile?.countryCode || ''}</div>
                    <div className={styles.phoneValue}>{profile?.phoneNumber || ''}</div>
                </div>
            </div>
            <div className={styles.cardRow}>
                <div>
                    <div className={styles.cardLabel}>Password</div>

                </div>
                <div className={styles.cardValue}>{'••••••••'}</div>
            </div>

            {isEditing && (
                <div style={{ marginTop: 12 }}>
                    <div className={styles.gridInputs}>
                        <InputField name="fullName" placeholder="John Doe" label="Full Name" value={form.fullName} onChange={(v) => handleChange('fullName', v)} disabled={saving} required />
                        <InputField name="email" placeholder="user@example.com" label="Email" value={form.email} onChange={(v) => handleChange('email', v)} disabled={saving} type="email" required />
                        <div className={styles.phoneInputs}>
                            <InputField name="countryCode" placeholder="+1" label="Country code" value={form.countryCode} onChange={(v) => handleChange('countryCode', v)} disabled={saving} />
                            <InputField name="phoneNumber" placeholder="501234567" label="Phone Number" value={form.phoneNumber} onChange={(v) => handleChange('phoneNumber', v)} disabled={saving} />
                        </div>

                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                        <Button label={saving ? 'Saving...' : 'Save'} onClick={handleSave} variant={saving || !isFormValid() ? 'disabled' : 'primary'} disabled={saving || !isFormValid()} />
                        <Button label="Cancel" onClick={handleCancel} variant="ghost" disabled={saving} />
                    </div>
                </div>
            )}

            <div className={styles.changePasswordSection}>
                {!changePwMode ? (
                    <div className={styles.centered} style={{ marginTop: 8 }}>
                        <Button label="Change password" onClick={() => setChangePwMode(true)} variant="ghost" />
                    </div>
                ) : (
                    <div>
                        <div style={{ marginTop: 12 }}>
                            <InputField name="currentPassword" type="password" label="Current password" value={pw.currentPassword} onChange={(v) => setPw(p => ({ ...p, currentPassword: v }))} disabled={pwSaving} />
                            <InputField name="newPassword" type="password" label="New password" value={pw.newPassword} onChange={(v) => setPw(p => ({ ...p, newPassword: v }))} disabled={pwSaving} />
                            <InputField name="confirmPassword" type="password" label="Confirm password" value={pw.confirmPassword} onChange={(v) => setPw(p => ({ ...p, confirmPassword: v }))} disabled={pwSaving} />
                        </div>
                        <div className={styles.buttonRow}>
                            <Button label={pwSaving ? 'Saving...' : 'Save password'} onClick={handlePwChange} variant={pwSaving ? 'disabled' : 'primary'} disabled={pwSaving} />
                            <Button label="Cancel" onClick={handleCancelPasswordChange} variant="ghost" disabled={pwSaving} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
