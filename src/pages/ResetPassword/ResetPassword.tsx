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

    const validatePassword = (pwd: string): boolean => {
        if (!pwd || pwd.length < 8 || pwd.length > 20) {
            return false;
        }

        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasLowerCase = /[a-z]/.test(pwd);
        const hasDigit = /[0-9]/.test(pwd);
        const hasSpecialChar = /[^a-zA-Z0-9]/.test(pwd);

        return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
    };

    const handleReset = async () => {
        setError(null);

        // Validate required fields
        if (!password) {
            const msg = 'New Password is required';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        if (!confirmPassword) {
            const msg = 'Confirm New Password is required';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        // Validate password format
        if (!validatePassword(password)) {
            const msg = 'Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character.';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            const msg = 'Passwords do not match. Please try again.';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        if (!token) {
            const msg = 'Reset link expired or invalid. Please request a new link.';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        setLoading(true);
        try {
            const payload = { userId: userId || 0, resetToken: token, newPassword: password };
            const success = await apiService.resetPassword(payload);
            if (success) {
                showToast('Password updated successfully.', 'success');
                navigate('/form/login');
            } else {
                const msg = 'Failed to reset password';
                setError(msg);
                showToast(msg, 'error');
            }
        } catch (err: any) {
            // Check for expired or invalid token
            const serverErrors = err?.response?.data?.errors;
            const serverMessage = err?.response?.data?.message;

            if (serverErrors?.Reset && Array.isArray(serverErrors.Reset)) {
                const errorMsg = serverErrors.Reset[0];
                if (errorMsg.toLowerCase().includes('expired') || errorMsg.toLowerCase().includes('invalid')) {
                    const msg = 'Reset link expired or invalid. Please request a new link.';
                    setError(msg);
                    showToast(msg, 'error');
                } else {
                    setError(errorMsg);
                    showToast(errorMsg, 'error');
                }
            } else if (serverMessage) {
                if (serverMessage.toLowerCase().includes('expired') || serverMessage.toLowerCase().includes('invalid')) {
                    const msg = 'Reset link expired or invalid. Please request a new link.';
                    setError(msg);
                    showToast(msg, 'error');
                } else {
                    setError(serverMessage);
                    showToast(serverMessage, 'error');
                }
            } else {
                const msg = 'Failed to reset password';
                setError(msg);
                showToast(msg, 'error');
            }
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
                    label="New Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter New Password"
                    type="password"
                />
                <InputField
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Re-Enter New Password"
                    type="password"
                />
            </div>
            {/* errors are shown via toast */}
            <div className={styles.buttonWrpr}>
                <Button
                    type="button"
                    label={loading ? 'Resetting...' : 'Reset Password'}
                    onClick={handleReset}
                    variant="primary"
                    disabled={loading}
                />
            </div>
        </form>
    );
};

export default ResetPassword;
