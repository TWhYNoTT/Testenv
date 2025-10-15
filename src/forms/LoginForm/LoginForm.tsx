import React, { useState } from 'react';

import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import styles from './loginForm.module.css';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { useBizContext } from '../../contexts/BusinessContext';
import { useLoading } from '../../contexts/LoadingContext';
import { useUser } from '../../contexts/UserContext'; // Add this import
import { fbLogin } from '../../lib/facebook';
import { googleSignIn } from '../../lib/google';

interface LoginFormProps {
    toggleForm: (form: 'login' | 'register' | 'forgetPassword' | 'partner') => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ toggleForm }) => {

    const { login, loading, socialLogin } = useAuth();
    const { showToast } = useToast();
    const { checkAndNavigate } = useBizContext();
    const { showLoadingScreen } = useLoading();
    const { refreshUser } = useUser(); // Add this line

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMeChecked, setRememberMeChecked] = useState(false);

    const validateForm = () => {
        if (!email) {
            showToast('Email is required', 'error');
            return false;
        }
        if (!password) {
            showToast('Password is required', 'error');
            return false;
        }
        return true;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await login({
                identifier: email,
                password: password,
                userType: 2
            });


            await refreshUser();


            showLoadingScreen(() => {
                checkAndNavigate();
            });

        } catch (err) {
            // ...error handling
        }
    };

    const handleFacebookLogin = async () => {
        try {
            const response: any = await fbLogin();
            const accessToken = response.authResponse.accessToken;
            // Backend expects provider enum: Facebook = 2, and IdToken field contains the token
            // For sign-in flows, TermsAccepted = false
            await socialLogin(2, accessToken, 2, false);

            // refresh user data and navigate
            await refreshUser();
            showLoadingScreen(() => {
                checkAndNavigate();
            });
        } catch (err: any) {
            if (err?.cancelled) {
                showToast(err.message || 'Facebook sign-in process was canceled. You can try signing in again or use another method.', 'info');
            } else if (err?.response?.data?.errors?.Service) {
                showToast('Facebook authentication service is currently unavailable. Please try again later.', 'error');
            } else if (err?.response?.data?.errors?.Email) {
                showToast(err.response.data.errors.Email.join('. '), 'error');
            } else {
                showToast('Facebook authentication failed. Please check your credentials or try again later.', 'error');
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const resp: any = await googleSignIn(process.env.REACT_APP_GOOGLE_CLIENT_ID);
            const idToken = resp.idToken;

            // For sign-in flows, TermsAccepted = false
            await socialLogin(1, idToken, 2, false);

            // refresh user data and navigate
            await refreshUser();
            showLoadingScreen(() => {
                checkAndNavigate();
            });
        } catch (err: any) {
            if (err?.cancelled) {
                showToast(err.message || 'Google sign-in process was canceled. You can try signing in again or use another method.', 'info');
            } else if (err?.response?.data?.errors?.Service) {
                showToast('Google authentication service is currently unavailable. Please try again later.', 'error');
            } else if (err?.response?.data?.errors?.Email) {
                showToast(err.response.data.errors.Email.join('. '), 'error');
            } else {
                showToast('Google authentication failed. Please try again.', 'error');
            }
        }
    };

    return (
        <form className={styles.loginForm} onSubmit={handleLogin}>
            <div>
                <h2 className={styles.loginText}>Login to your</h2>
                <h2 className={styles.loginText}>account</h2>
            </div>

            <div className={styles.loginFields}>
                <InputField
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter your email"
                    type="email"
                    required
                />

                <InputField
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    type="password"
                    required
                />
            </div>

            <div className={styles.buttonWrpr}>
                <Button
                    type="submit"
                    label={loading ? "Signing in..." : "Sign In"}
                    variant={loading ? "disabled" : "primary"}

                    disabled={loading}
                />
            </div>

            <div className={styles.loginOptions}>
                <div>
                    <Checkbox
                        label='Remember me'
                        onChange={setRememberMeChecked}
                        checked={rememberMeChecked}
                    />
                </div>
                <span className={styles.link}>
                    <Button
                        label='Forgot password?'
                        onClick={() => toggleForm('forgetPassword')}
                        noAppearance={true}
                        size='small'
                    />
                </span>
            </div>

            <h3 className={styles.socialText}>Or continue with your social profile</h3>

            <div className={styles.socialProfile}>
                <div className={styles.socialIcon} onClick={handleFacebookLogin}>
                    <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24.5" cy="24.5" r="24" stroke="#8191AB" />
                        <g clipPath="url(#clip0_504_845)">
                            <path d="M29.2 19.8H25.4V17.3C25.4 16.4 26 16.1 26.5 16.1C26.9 16.1 29.2 16.1 29.2 16.1V12H25.4C21.3 12 20.4 15.1 20.4 17V19.7H18V24H20.4C20.4 29.4 20.4 36 20.4 36H25.4C25.4 36 25.4 29.4 25.4 24H28.8L29.2 19.8Z" fill="#8191AB" />
                        </g>
                    </svg>
                </div>
                <div className={styles.socialIcon} onClick={handleGoogleLogin}>
                    <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M33.8002 22.0506H33.0002V22.0006H24.0001V26.0006H29.6502C28.8502 28.3507 26.6001 30.0007 24.0001 30.0007C20.7001 30.0007 18 27.3006 18 24.0006C18 20.7006 20.7001 18.0005 24.0001 18.0005C25.5501 18.0005 26.9001 18.6005 28.0002 19.5006L30.8502 16.6505C29.0002 15.0505 26.6501 14.0005 24.0001 14.0005C18.5001 14.0005 14 18.5005 14 24.0006C14 29.5007 18.5001 34.0007 24.0001 34.0007C29.5002 34.0007 34.0002 29.5007 34.0002 24.0006C34.0002 23.3506 33.9502 22.7006 33.8002 22.0506Z" fill="#8191AB" />
                        <circle cx="24.5" cy="24.5" r="24" stroke="#8191AB" />
                    </svg>
                </div>
            </div>

            <div className={styles.registerOption}>
                <span>Don't have an account?</span>
                <span className={styles.link}>
                    <Button
                        onClick={() => toggleForm('register')}
                        label='Register'
                        noAppearance={true}
                        size='small'
                    />
                </span>
            </div>
        </form>
    );
};

export default LoginForm;