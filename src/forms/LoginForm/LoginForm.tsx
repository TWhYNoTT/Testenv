import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import {
    useLoginMutation,
    useGetProfileQuery,
    useGetMyBusinessesQuery,
    useGetCategoriesQuery
} from '../../store/api';
import { setCredentials, setUser } from '../../store/slices/authSlice';
import { setBusinesses, setCategories } from '../../store/slices/businessSlice';
import { ProfileType } from '../../types/enums';
import styles from './loginForm.module.css';

// Define the type for the toggleForm prop
type ToggleFormFunction = (formType: 'forgetPassword' | 'register') => void;

// Add type annotation for the props
interface LoginFormProps {
    toggleForm: ToggleFormFunction;
}

const LoginForm: React.FC<LoginFormProps> = ({ toggleForm }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loginStep, setLoginStep] = useState<'idle' | 'login' | 'fetchProfile' | 'fetchBusinesses' | 'done'>('idle');

    // RTK Query hooks
    const [login, { isLoading: isLoginLoading }] = useLoginMutation();

    // Conditional queries based on login step
    const {
        data: profile,
        isLoading: isProfileLoading,
        isSuccess: isProfileSuccess,
        error: profileError
    } = useGetProfileQuery(undefined, {
        skip: loginStep !== 'fetchProfile'
    });

    const {
        data: businesses,
        isLoading: isBusinessLoading,
        isSuccess: isBusinessSuccess,
        error: businessError
    } = useGetMyBusinessesQuery(undefined, {
        skip: loginStep !== 'fetchBusinesses'
    });

    const {
        data: categories,
        isLoading: isCategoriesLoading,
        isSuccess: isCategoriesSuccess,
        error: categoriesError
    } = useGetCategoriesQuery(true, {
        skip: loginStep !== 'fetchBusinesses'
    });

    // Combine loading states
    const isLoading = isLoginLoading ||
        (loginStep === 'fetchProfile' && isProfileLoading) ||
        (loginStep === 'fetchBusinesses' && (isBusinessLoading || isCategoriesLoading));

    // Combined error handling
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            // Perform login
            const result = await login({
                identifier: email,
                password,
                userType: ProfileType.SalonOwner
            }).unwrap();

            // Store tokens in Redux and storage
            dispatch(setCredentials({
                accessToken: result.accessToken,
                refreshToken: result.refreshToken
            }));

            // Store tokens in appropriate storage based on remember me
            if (rememberMe) {
                localStorage.setItem('accessToken', result.accessToken);
                localStorage.setItem('refreshToken', result.refreshToken);
            } else {
                sessionStorage.setItem('accessToken', result.accessToken);
                sessionStorage.setItem('refreshToken', result.refreshToken);
            }

            // Move to next step: fetching profile
            setLoginStep('fetchProfile');

        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Invalid email or password');
        }
    };

    // Manage login flow steps
    useEffect(() => {
        if (loginStep === 'fetchProfile' && isProfileSuccess) {
            // Store user profile in Redux
            dispatch(setUser(profile));

            // Move to next step: fetching businesses
            setLoginStep('fetchBusinesses');
        } else if (loginStep === 'fetchProfile' && profileError) {
            console.error('Failed to fetch profile:', profileError);
            setErrorMessage('Failed to fetch profile. Please try again.');
            // Reset to idle state
            setLoginStep('idle');
        }
    }, [loginStep, isProfileSuccess, profileError, dispatch, profile]);

    useEffect(() => {
        if (loginStep === 'fetchBusinesses' && isBusinessSuccess && isCategoriesSuccess) {
            // Store businesses and categories in Redux
            dispatch(setBusinesses(businesses));
            dispatch(setCategories(categories));

            // Mark login process as complete
            setLoginStep('done');

            // Navigate to wizard
            navigate('/wizard');
        } else if (loginStep === 'fetchBusinesses' && (businessError || categoriesError)) {
            console.error('Failed to fetch businesses or categories:', businessError, categoriesError);
            setErrorMessage('Failed to load business data. Please try again.');
            // Reset to idle state
            setLoginStep('idle');
        }
    }, [
        loginStep,
        isBusinessSuccess,
        isCategoriesSuccess,
        businessError,
        categoriesError,
        dispatch,
        businesses,
        categories,
        navigate
    ]);

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
                    disabled={loginStep !== 'idle'}
                    required
                />
                <InputField
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    type="password"
                    disabled={loginStep !== 'idle'}
                    required
                />
            </div>

            {errorMessage && (
                <div className={styles.errorMessage}>
                    {errorMessage}
                </div>
            )}

            <div className={styles.buttonWrpr}>
                <Button
                    type="submit"
                    label={isLoading ?
                        (isLoginLoading ? "Signing in..." : "Loading data...")
                        : "Sign In"}
                    variant="primary"
                    disabled={isLoading}
                />
            </div>

            <div className={styles.loginOptions}>
                <div>
                    <Checkbox
                        label="Remember me"
                        onChange={setRememberMe}
                        checked={rememberMe}
                        disabled={isLoading}
                    />
                </div>
                <span className={styles.link}>
                    <Button
                        label="Forgot password?"
                        onClick={() => toggleForm('forgetPassword')}
                        noAppearance={true}
                        size="small"
                        disabled={isLoading}
                    />
                </span>
            </div>

            <h3 className={styles.socialText}>Or continue with your social profile</h3>
            <div className={styles.socialProfile}>
                <div className={styles.socialProfile}>
                    <div className={styles.socialIcon}>
                        <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="24.5" cy="24.5" r="24" stroke="#8191AB" />
                            <g clipPath="url(#clip0_504_845)">
                                <path d="M29.2 19.8H25.4V17.3C25.4 16.4 26 16.1 26.5 16.1C26.9 16.1 29.2 16.1 29.2 16.1V12H25.4C21.3 12 20.4 15.1 20.4 17V19.7H18V24H20.4C20.4 29.4 20.4 36 20.4 36H25.4C25.4 36 25.4 29.4 25.4 24H28.8L29.2 19.8Z" fill="#8191AB" />
                            </g>
                        </svg>
                    </div>
                    <div className={styles.socialIcon}><svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M33.8002 22.0506H33.0002V22.0006H24.0001V26.0006H29.6502C28.8502 28.3507 26.6001 30.0007 24.0001 30.0007C20.7001 30.0007 18 27.3006 18 24.0006C18 20.7006 20.7001 18.0005 24.0001 18.0005C25.5501 18.0005 26.9001 18.6005 28.0002 19.5006L30.8502 16.6505C29.0002 15.0505 26.6501 14.0005 24.0001 14.0005C18.5001 14.0005 14 18.5005 14 24.0006C14 29.5007 18.5001 34.0007 24.0001 34.0007C29.5002 34.0007 34.0002 29.5007 34.0002 24.0006C34.0002 23.3506 33.9502 22.7006 33.8002 22.0506Z" fill="#8191AB" />
                        <path d="M15.15 19.3501L18.4501 21.7501C19.3501 19.5501 21.5001 18 24.0001 18C25.5501 18 26.9002 18.6001 28.0002 19.5001L30.8502 16.65C29.0002 15.05 26.6502 14 24.0001 14C20.1501 14 16.85 16.15 15.15 19.3501Z" fill="#8191AB" />
                        <path d="M23.9998 34.0001C26.5998 34.0001 28.9499 33.0001 30.6999 31.4001L27.5998 28.8001C26.5998 29.5501 25.3498 30.0001 23.9998 30.0001C21.3998 30.0001 19.1997 28.3501 18.3497 26.05L15.0997 28.5501C16.7497 31.8001 20.0997 34.0001 23.9998 34.0001Z" fill="#8191AB" />
                        <path d="M33.8001 22.05H33.0001V22H24V26H29.6501C29.2501 27.1001 28.5501 28.1001 27.6 28.8001L30.7001 31.4001C30.5001 31.6001 34.0001 29.0001 34.0001 24C34.0001 23.35 33.9501 22.7 33.8001 22.05Z" fill="#8191AB" />
                        <circle cx="24.5" cy="24.5" r="24" stroke="#8191AB" />
                    </svg>
                    </div>
                </div>
            </div>

            <div className={styles.registerOption}>
                <span>Don't have an account?</span>
                <span className={styles.link}>
                    <Button
                        onClick={() => toggleForm('register')}
                        label="Register"
                        noAppearance={true}
                        size="small"
                        disabled={loginStep !== 'idle'}
                    />
                </span>
            </div>
        </form>
    );
};

export default LoginForm;