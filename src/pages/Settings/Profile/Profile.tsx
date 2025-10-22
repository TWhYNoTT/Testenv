import React, { useState, useEffect } from 'react';
import InputField from '../../../components/InputField/InputField';
import Button from '../../../components/Button/Button';
import styles from './Profile.module.css';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useToast } from '../../../contexts/ToastContext';

const Profile: React.FC = () => {
    const { profile, loadProfile, updateProfile, changePassword } = useUserProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ fullName: '', phoneNumber: '', countryCode: '' });
    const [saving, setSaving] = useState(false);
    const [changePwMode, setChangePwMode] = useState(false);
    const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwSaving, setPwSaving] = useState(false);

    const { showToast } = useToast();

    useEffect(() => {
        if (profile) {
            setForm({ fullName: profile.fullName || '', phoneNumber: profile.phoneNumber || '', countryCode: profile.countryCode || '' });
        }
    }, [profile]);

    useEffect(() => {
        if (!profile) loadProfile();
    }, [profile, loadProfile]);

    const handleChange = (name: string, value: string) => setForm(prev => ({ ...prev, [name]: value }));

    const handleCancel = () => {
        if (profile) setForm({ fullName: profile.fullName, phoneNumber: profile.phoneNumber, countryCode: profile.countryCode });
        setIsEditing(false);
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

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile({ fullName: form.fullName, phoneNumber: form.phoneNumber, countryCode: form.countryCode ?? '' });
            showToast('Profile updated successfully', 'success');
            setIsEditing(false);
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
            showToast('Password changed successfully', 'success');
        } catch (err: any) {
            const msg = parseApiErrors(err);
            showToast(msg, 'error');
        } finally {
            setPwSaving(false);
        }
    };

    return (
        <div className={styles.profileCard}>
            <div className={styles.cardRow}>
                <div>
                    <div className={styles.cardLabel}>Full Name</div>
                    <div className={styles.smallNote}>Shown to customers when they book or see receipts.</div>
                </div>
                <div className={styles.cardValue}>{profile?.fullName || ''}</div>
            </div>
            <div className={styles.cardRow}>
                <div>
                    <div className={styles.cardLabel}>Email</div>
                    <div className={styles.smallNote}>Used for account notifications and password resets.</div>
                </div>
                <div className={styles.cardValue}>{profile?.email || ''}</div>
            </div>
            <div className={styles.cardRow}>
                <div>
                    <div className={styles.cardLabel}>Phone</div>
                    <div className={styles.smallNote}>Used for SMS notifications and to contact you about appointments.</div>
                </div>
                <div className={styles.phoneRow}>
                    <div className={styles.countryCodeBadge}>{profile?.countryCode || ''}</div>
                    <div className={styles.phoneValue}>{profile?.phoneNumber || ''}</div>
                </div>
            </div>
            <div className={styles.cardRow}>
                <div>
                    <div className={styles.cardLabel}>Password</div>
                    <div className={styles.smallNote}>Password is hidden for security. Use Change password to update it.</div>
                </div>
                <div className={styles.cardValue}>{'••••••••'}</div>
            </div>

            {!isEditing ? (
                <div className={styles.editButtonWrapper}>
                    <div className={styles.centered} style={{ width: '100%' }}>
                        <div style={{ width: '100%' }}>
                            <Button label="Edit Profile" onClick={() => setIsEditing(true)} variant="primary" size="large" />
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ marginTop: 12 }}>
                    <div className={styles.gridInputs}>
                        <InputField name="fullName" placeholder="John Doe" label="Full Name" value={form.fullName} onChange={(v) => handleChange('fullName', v)} disabled={saving} required feedbackMessage="This name will be visible to customers on bookings and receipts." />
                        <div className={styles.phoneInputs}>
                            <InputField name="countryCode" placeholder="+1" label="Country code" value={form.countryCode} onChange={(v) => handleChange('countryCode', v)} disabled={saving} feedbackMessage="Include leading + (e.g. +1)" />
                            <InputField name="phoneNumber" placeholder="501234567" label="Phone Number" value={form.phoneNumber} onChange={(v) => handleChange('phoneNumber', v)} disabled={saving} feedbackMessage="Enter phone number without the country code (numbers only)." />
                        </div>
                        <div className={styles.smallNote} style={{ marginTop: 8 }}>
                            Country code should include the leading + and phone number should be without the country code.
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                        <Button label={saving ? 'Saving...' : 'Save'} onClick={handleSave} variant={saving ? 'disabled' : 'primary'} disabled={saving} />
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
                            <InputField name="newPassword" type="password" label="New password" value={pw.newPassword} onChange={(v) => setPw(p => ({ ...p, newPassword: v }))} disabled={pwSaving} feedbackMessage="Password should be at least 8 characters." />
                            <InputField name="confirmPassword" type="password" label="Confirm password" value={pw.confirmPassword} onChange={(v) => setPw(p => ({ ...p, confirmPassword: v }))} disabled={pwSaving} feedbackMessage="Re-enter the new password to confirm." />
                        </div>
                        <div className={styles.buttonRow}>
                            <Button label={pwSaving ? 'Saving...' : 'Save password'} onClick={handlePwChange} variant={pwSaving ? 'disabled' : 'primary'} disabled={pwSaving} />
                            <Button label="Cancel" onClick={() => setChangePwMode(false)} variant="ghost" disabled={pwSaving} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
