import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import styles from './registerForm.module.css';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';
import { fbLogin } from '../../lib/facebook';
import { googleSignIn } from '../../lib/google';


interface RegisterFormProps {
    toggleForm: (form: 'login' | 'register' | 'forgetPassword' | 'partner') => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleForm }) => {
    const navigate = useNavigate();
    const { register, loading, socialLogin } = useAuth();
    const { showToast } = useToast();


    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [formErrors, setFormErrors] = useState<{
        fullName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const validateForm = () => {
        const errors: typeof formErrors = {};

        if (!formData.fullName) {
            errors.fullName = 'Full name is required';
        } else if (formData.fullName.length < 5) {
            errors.fullName = 'Full name must be at least 5 characters';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
            errors.password = 'Password must contain uppercase, lowercase, number and special character';
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await register({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                termsAccepted: true,
                userType: 2
            });

            showToast('Registration successful!', 'success');

            navigate('/form/login');

        } catch (err) {

        }
    };

    const handleFacebookRegister = async () => {
        try {
            const response: any = await fbLogin();
            const accessToken = response.authResponse.accessToken;

            // Sign up via social login endpoint (Facebook provider = 2). TermsAccepted = true for sign-up.
            await socialLogin(2, accessToken, 2, true);

            showToast('Signed up successfully using Facebook.', 'success');
            // navigate to login or dashboard depending on flow — reuse existing flow by redirecting to login
            // in many cases backend returns tokens and you may want to refresh user and navigate; adjust as necessary.
        } catch (err: any) {
            // Handle structured errors from fbLogin or backend
            if (err?.cancelled) {
                showToast(err.message || 'Facebook sign-up process was canceled. You can try signing up again or use another method.', 'info');
            } else if (err?.response?.data?.errors?.Service) {
                showToast('Facebook authentication service is currently unavailable. Please try again later.', 'error');
            } else if (err?.response?.data?.errors?.Account) {
                showToast(err.response.data.errors.Account.join('. '), 'error');
            } else if (err?.response?.data?.errors?.Email) {
                showToast(err.response.data.errors.Email.join('. '), 'error');
            } else {
                showToast(err?.message || 'Facebook authentication failed. Please check your credentials or try again later.', 'error');
            }
        }
    };

    const handleGoogleRegister = async () => {
        try {
            const resp: any = await googleSignIn(process.env.REACT_APP_GOOGLE_CLIENT_ID);
            const idToken = resp.idToken;

            // Sign up via social login endpoint (Google provider = 1). TermsAccepted = true for sign-up.
            await socialLogin(1, idToken, 2, true);

            showToast('Signed up successfully using Google.', 'success');
        } catch (err: any) {
            if (err?.cancelled) {
                showToast(err.message || 'Google sign-up process was canceled. You can try signing up again or use another method.', 'info');
            } else if (err?.response?.data?.errors?.Service) {
                showToast('Google authentication service is currently unavailable. Please try again later.', 'error');
            } else if (err?.response?.data?.errors?.Account) {
                showToast(err.response.data.errors.Account.join('. '), 'error');
            } else if (err?.response?.data?.errors?.Email) {
                showToast(err.response.data.errors.Email.join('. '), 'error');
            } else {
                showToast(err?.message || 'Google authentication failed. Please check your credentials or try again later.', 'error');
            }
        }
    };

    return (
        <form className={styles.registerForm} onSubmit={handleRegister}>
            <div>
                <h2 className={styles.registerText}>Create an</h2>
                <h2 className={styles.registerText}>account</h2>
            </div>

            <div className={styles.registerFields}>
                <InputField
                    label="Full name"
                    value={formData.fullName}
                    onChange={handleInputChange('fullName')}
                    placeholder="Enter your full name"
                    required
                    feedback={formErrors.fullName ? 'error' : undefined}
                    feedbackMessage={formErrors.fullName}
                />

                <InputField
                    label="Email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="Enter your email"
                    type="email"
                    required
                    feedback={formErrors.email ? 'error' : undefined}
                    feedbackMessage={formErrors.email}
                />

                <InputField
                    label="Password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="Enter your password"
                    type="password"
                    required
                    feedback={formErrors.password ? 'error' : undefined}
                    feedbackMessage={formErrors.password}
                />

                <InputField
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder="Confirm your password"
                    type="password"
                    required
                    feedback={formErrors.confirmPassword ? 'error' : undefined}
                    feedbackMessage={formErrors.confirmPassword}
                />
            </div>

            <div className={styles.buttonWrpr}>
                <Button
                    type="submit"
                    label={loading ? "Creating..." : "Create"}
                    variant={loading ? "disabled" : "primary"}
                    disabled={loading}
                />
            </div>

            <h3 className={styles.socialText}>Or continue with your social profile</h3>
            <div className={styles.socialProfile}>
                <div className={styles.socialIcon} onClick={handleFacebookRegister}>
                    <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24.5" cy="24.5" r="24" stroke="#8191AB" />
                        <g clipPath="url(#clip0_504_845)">
                            <path d="M29.2 19.8H25.4V17.3C25.4 16.4 26 16.1 26.5 16.1C26.9 16.1 29.2 16.1 29.2 16.1V12H25.4C21.3 12 20.4 15.1 20.4 17V19.7H18V24H20.4C20.4 29.4 20.4 36 20.4 36H25.4C25.4 36 25.4 29.4 25.4 24H28.8L29.2 19.8Z" fill="#8191AB" />
                        </g>
                    </svg>
                </div>
                <div className={styles.socialIcon} onClick={handleGoogleRegister}>
                    <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24.5" cy="24.5" r="24" stroke="#8191AB" />
                        <g>
                            <path d="M24 17v6h9c-.5 3-3 8-9 8-6 0-11-5-11-11s5-11 11-11c3 0 5 1 6 2l-4 3c-.5-.5-1.5-1-2-1-2 0-4 2-4 5s2 5 4 5c2 0 3-1 3-2h-3v-3h6z" fill="#8191AB" />
                        </g>
                    </svg>
                </div>
            </div>

            <div className={styles.loginOption}>
                <span>Already have an account?</span>
                <span className={styles.link}>
                    <Button
                        label='Sign in'
                        onClick={() => toggleForm('login')}
                        noAppearance={true}
                        size='small'
                    />
                </span>
            </div>
        </form>
    );
};

export default RegisterForm;