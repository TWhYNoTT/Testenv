import React, { useState } from 'react';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import styles from './ForgetPasswordForm.module.css';
import { apiService } from '../../services/api';
import { ProfileType } from '../../types/enums';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

interface ForgetFormProps {
    toggleForm: (form: 'login' | 'register' | 'forgetPassword' | 'partner') => void;
}

type Step = 'step1' | 'step2' | 'step3';

const ForgetPasswordForm: React.FC<ForgetFormProps> = ({ toggleForm }) => {
    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [resetToken, setResetToken] = useState('');
    const [step, setStep] = useState<Step>('step1');
    const { showToast } = useToast();

    const handleRequestReset = async () => {
        setError(null);
        if (!email) {
            const msg = 'Invalid email format. Please enter a valid email.';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        // simple email regex
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            const msg = 'Invalid email format. Please enter a valid email.';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        setLoading(true);
        try {
            // Only salon owner (ProfileType.SalonOwner === 2)
            const response = await apiService.requestPasswordReset({ identifier: email, userType: ProfileType.SalonOwner as 2 });
            if (response?.userId) setUserId(response.userId);
            showToast('A password reset link has been sent if the account exists', 'info');
            setStep('step2');
        } catch (err: any) {
            // Map backend validation errors to user-friendly messages
            const serverErrors = err?.response?.data?.errors;
            const serverMessage = err?.response?.data?.message;

            if (serverErrors && serverErrors.PasswordReset && Array.isArray(serverErrors.PasswordReset)) {
                const first = serverErrors.PasswordReset[0] || '';
                if (first.toLowerCase().includes('user not found')) {
                    const msg = 'No account found for this email. Please try again.';
                    setError(msg);
                    showToast(msg, 'error');
                } else {
                    setError(first);
                    showToast(first, 'error');
                }
            } else if (serverMessage) {
                // If server sends a descriptive message, show it
                if (serverMessage.toLowerCase().includes('user not found')) {
                    const msg = 'No account found for this email. Please try again.';
                    setError(msg);
                    showToast(msg, 'error');
                } else {
                    setError(serverMessage);
                    showToast(serverMessage, 'error');
                }
            } else {
                const msg = 'Failed to send reset request';
                setError(msg);
                showToast(msg, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const navigate = useNavigate();

    // step3 removed; reset is handled on the dedicated /reset-password page

    return (
        <>
            {step === 'step1' &&
                <form className={styles.ForgetPasswordForm} onSubmit={(e) => e.preventDefault()}>

                    <h2 className={styles.forgetTextH}>Let’s reset your Password</h2>
                    <div>
                        <h3 className={styles.forgetTextP}>Enter your mobile number so we can reset</h3>
                        <h3 className={styles.forgetTextP}>your password</h3>
                    </div>
                    <div className={styles.forgetFields}>
                        <InputField
                            label="Email"
                            value={email}
                            onChange={setEmail}
                            placeholder="Enter your email"
                            type="email"
                        />
                    </div>
                    {error && <div style={{ color: 'var(--color-danger)' }}>{error}</div>}
                    <div className={styles.buttonWrpr}>
                        <Button
                            type="button"
                            label={loading ? 'Sending...' : 'Submit'}
                            onClick={handleRequestReset}
                            variant="primary"
                            disabled={loading}
                        />
                    </div>
                </form>
            }
            {step === 'step2' &&
                <div className={styles.informAndResend}>
                    <h2 className={styles.forgetTextH}>Email has been sent</h2>
                    <div>
                        <h3 className={styles.forgetTextP}>Click on the verification link sent to your</h3>
                        <h3 className={styles.forgetTextP}>email so we can reset your password</h3>
                    </div>
                    <div className={styles.resendOption}>
                        <span>Didn't receive an Email yet?</span><span className={styles.link}><Button onClick={handleRequestReset} label='Resend email' noAppearance={true} size='small' /></span>
                    </div>
                </div>
            }

        </>
    );
};

export default ForgetPasswordForm;
