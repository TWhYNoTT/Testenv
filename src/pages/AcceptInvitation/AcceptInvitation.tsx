import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import styles from './AcceptInvitation.module.css';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import type { InvitationDetailsResponse } from '../../services/api';

const AcceptInvitation: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(true);
    const [invitationDetails, setInvitationDetails] = useState<InvitationDetailsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const t = searchParams.get('token');
        if (t) {
            setToken(t);
            validateToken(t);
        } else {
            setError('Invalid invitation link');
            setValidating(false);
        }
    }, [searchParams]);

    const validateToken = async (invitationToken: string) => {
        try {
            const details = await apiService.validateInvitationToken(invitationToken);
            setInvitationDetails(details);
            setValidating(false);
        } catch (err: any) {
            const errorMsg = err?.response?.data?.Token?.[0] || 'Invalid or expired invitation link';
            setError(errorMsg);
            showToast(errorMsg, 'error');
            setValidating(false);
        }
    };

    const validatePassword = (pwd: string): boolean => {
        if (!pwd || pwd.length < 8) {
            return false;
        }

        const hasUpperCase = /[A-Z]/.test(pwd);
        const hasLowerCase = /[a-z]/.test(pwd);
        const hasDigit = /[0-9]/.test(pwd);

        return hasUpperCase && hasLowerCase && hasDigit;
    };

    const handleAcceptInvitation = async () => {
        setError(null);

        // Validate required fields
        if (!password) {
            const msg = 'Password is required';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        if (!confirmPassword) {
            const msg = 'Please confirm your password';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        // Validate password format
        if (!validatePassword(password)) {
            const msg = 'Password must be at least 8 characters and contain uppercase, lowercase, and a number.';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            const msg = 'Passwords do not match';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.acceptInvitation({
                token,
                password,
                confirmPassword
            });

            showToast(response.message, 'success');
            navigate('/form/login');
        } catch (err: any) {
            const serverErrors = err?.response?.data;
            let errorMsg = 'Failed to accept invitation. Please try again.';

            if (serverErrors?.Token) {
                errorMsg = serverErrors.Token[0];
            } else if (serverErrors?.Password) {
                errorMsg = serverErrors.Password[0];
            } else if (serverErrors?.Error) {
                errorMsg = serverErrors.Error[0];
            }

            setError(errorMsg);
            showToast(errorMsg, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2>Validating Invitation...</h2>
                    <p>Please wait while we verify your invitation link.</p>
                </div>
            </div>
        );
    }

    if (error && !invitationDetails) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2>Invalid Invitation</h2>
                    <p className={styles.error}>{error}</p>
                    <Button
                        label="Back to Login"
                        onClick={() => navigate('/form/login')}
                        size="medium"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2>Welcome to {invitationDetails?.businessName}!</h2>
                <p className={styles.subtitle}>
                    Hi <strong>{invitationDetails?.fullName}</strong>, please set your password to complete your account setup.
                </p>

                <div className={styles.info}>
                    <p><strong>Position:</strong> {invitationDetails?.position}</p>
                    <p><strong>Email:</strong> {invitationDetails?.email}</p>
                </div>

                <div className={styles.form}>
                    <InputField
                        label="New Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        placeholder="Enter your password"
                        required
                    />

                    <InputField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        placeholder="Confirm your password"
                        required
                    />

                    {error && <p className={styles.error}>{error}</p>}

                    <p className={styles.hint}>
                        Password must be at least 8 characters and include uppercase, lowercase, and a number.
                    </p>

                    <Button
                        label={loading ? 'Setting Up...' : 'Complete Setup'}
                        onClick={handleAcceptInvitation}
                        disabled={loading}
                        size="medium"
                    />
                </div>
            </div>
        </div>
    );
};

export default AcceptInvitation;
