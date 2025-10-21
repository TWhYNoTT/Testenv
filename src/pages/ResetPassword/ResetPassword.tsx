import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import styles from '../../forms/ForgetPasswordForm/ForgetPasswordForm.module.css';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [userId, setUserId] = useState<number | null>(null);
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const uid = searchParams.get('userId');
        const t = searchParams.get('token');
        if (uid) setUserId(Number(uid));
        if (t) setToken(t);
    }, [searchParams]);

    const handleReset = async () => {
        setError(null);
        if (!password || !confirmPassword) {
            const msg = 'Please fill in all password fields';
            setError(msg);
            showToast(msg, 'error');
            return;
        }
        if (password !== confirmPassword) {
            const msg = 'Passwords do not match';
            setError(msg);
            showToast(msg, 'error');
            return;
        }
        if (!token) {
            const msg = 'Missing reset token';
            setError(msg);
            showToast(msg, 'error');
            return;
        }
        setLoading(true);
        try {
            const payload = { userId: userId || 0, resetToken: token, newPassword: password };
            const success = await apiService.resetPassword(payload);
            if (success) {
                showToast('Password reset successful', 'success');
                navigate('/form/login');
            } else {
                const msg = 'Failed to reset password';
                setError(msg);
                showToast(msg, 'error');
            }
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Failed to reset password';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.ForgetPasswordForm} onSubmit={(e) => e.preventDefault()}>

            <h2 className={styles.forgetTextH}>Let’s choose a new Password</h2>
            <div>
                <h3 className={styles.forgetTextP}>Enter your new password</h3>

            </div>
            <div className={styles.forgetFields}>
                <InputField
                    label="Enter your new password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Password"
                    type="password"
                />
                <InputField
                    label="Confirm your new password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Password"
                    type="password"
                />
            </div>
            {/* errors are shown via toast */}
            <div className={styles.buttonWrpr}>
                <Button
                    type="button"
                    label={loading ? 'Resetting...' : 'Reset password'}
                    onClick={handleReset}
                    variant="primary"
                    disabled={loading}
                />
            </div>
        </form>
    );
};

export default ResetPassword;
