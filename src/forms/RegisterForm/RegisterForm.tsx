import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import styles from './registerForm.module.css';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../contexts/ToastContext';


interface RegisterFormProps {
    toggleForm: (form: 'login' | 'register' | 'forgetPassword' | 'partner') => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleForm }) => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();
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
                {/* Your social icons here */}
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