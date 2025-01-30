import React, { useState } from 'react';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import styles from './registerForm.module.css';
import { useRegisterMutation } from '../../store/api';
import { ProfileType } from '../../types/enums';

interface RegisterFormProps {
    toggleForm: (form: 'login' | 'register' | 'forgetPassword' | 'partner') => void;
}

interface FormFields {
    fullname: string;
    email: string;
    password: string;
}

type FieldName = keyof FormFields;

interface ValidationErrors {
    fullname?: string;
    email?: string;
    password?: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleForm }) => {
    // Form state
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<Record<FieldName, boolean>>({
        fullname: false,
        email: false,
        password: false
    });
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    // RTK Query hook
    const [register, { isLoading }] = useRegisterMutation();

    // Validation functions
    const validateField = (name: FieldName, value: string): string => {
        switch (name) {
            case 'fullname':
                if (!value.trim()) return 'Full name is required';
                if (value.length < 5) return 'Full name must be at least 5 characters';
                if (!/^[a-zA-Z\s]*$/.test(value)) return 'Full name can only contain letters';
                return '';

            case 'email':
                if (!value) return 'Email is required';
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                    return 'Invalid email address';
                }
                return '';

            case 'password':
                if (!value) return 'Password is required';
                if (value.length < 8) return 'Password must be at least 8 characters';
                if (!/(?=.*[a-z])/.test(value)) return 'Password must include a lowercase letter';
                if (!/(?=.*[A-Z])/.test(value)) return 'Password must include an uppercase letter';
                if (!/(?=.*\d)/.test(value)) return 'Password must include a number';
                if (!/(?=.*[\W_])/.test(value)) return 'Password must include a special character'; // Ensures special char
                return '';

        }
    };

    const handleBlur = (field: FieldName) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field,
            field === 'fullname' ? fullname :
                field === 'email' ? email : password
        );
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {
            fullname: validateField('fullname', fullname),
            email: validateField('email', email),
            password: validateField('password', password),
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Mark all fields as touched
        setTouched({
            fullname: true,
            email: true,
            password: true,
        });

        if (!validateForm()) {
            return;
        }

        try {
            await register({
                email,
                password,
                fullName: fullname,
                termsAccepted: true,
                userType: ProfileType.SalonOwner
            }).unwrap();

            // Show success message and reset form
            setRegistrationSuccess(true);

            // Switch to login form after 2 seconds
            setTimeout(() => {
                toggleForm('login');
            }, 2000);

        } catch (error) {
            // You might want to show an error message
            console.error('Registration failed:', error);
        }
    };

    const getFeedbackType = (field: FieldName): 'error' | 'success' | undefined => {
        if (!touched[field]) return undefined;
        return errors[field] ? 'error' : 'success';
    };

    if (registrationSuccess) {
        return (
            <div className={styles.successMessage}>
                <h2>Registration Successful!</h2>
                <p>Redirecting to login...</p>
            </div>
        );
    }

    return (
        <form className={styles.registerForm} onSubmit={handleRegister}>
            <div>
                <h2 className={styles.registerText}>Create an</h2>
                <h2 className={styles.registerText}>account</h2>
            </div>
            <div className={styles.registerFields}>
                <InputField
                    label="Full name"
                    value={fullname}
                    onChange={(value) => {
                        setFullname(value);
                        if (touched.fullname) {
                            setErrors(prev => ({
                                ...prev,
                                fullname: validateField('fullname', value)
                            }));
                        }
                    }}
                    onBlur={() => handleBlur('fullname')}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    required
                    feedback={getFeedbackType('fullname')}
                    feedbackMessage={touched.fullname ? errors.fullname : undefined}
                />
                <InputField
                    label="Email"
                    value={email}
                    onChange={(value) => {
                        setEmail(value);
                        if (touched.email) {
                            setErrors(prev => ({
                                ...prev,
                                email: validateField('email', value)
                            }));
                        }
                    }}
                    onBlur={() => handleBlur('email')}
                    placeholder="Enter your email"
                    type="email"
                    disabled={isLoading}
                    required
                    feedback={getFeedbackType('email')}
                    feedbackMessage={touched.email ? errors.email : undefined}
                />
                <InputField
                    label="Password"
                    value={password}
                    onChange={(value) => {
                        setPassword(value);
                        if (touched.password) {
                            setErrors(prev => ({
                                ...prev,
                                password: validateField('password', value)
                            }));
                        }
                    }}
                    onBlur={() => handleBlur('password')}
                    placeholder="Enter your password"
                    type="password"
                    disabled={isLoading}
                    required
                    feedback={getFeedbackType('password')}
                    feedbackMessage={touched.password ? errors.password : undefined}
                />
            </div>
            <div className={styles.buttonWrpr}>
                <Button
                    type="submit"
                    label={isLoading ? "Creating..." : "Create"}
                    variant="primary"
                    disabled={isLoading || Object.keys(errors).some(key => !!errors[key as keyof ValidationErrors])}
                />
            </div>
            <h3 className={styles.socialText}>Or continue with your social profile</h3>
            <div className={styles.socialProfile}>

                <div className={styles.socialIcon}>
                    <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="24.5" cy="24.5" r="24" stroke="#8191AB" />
                        <g clip-path="url(#clip0_504_845)">
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
            <div className={styles.loginOption}>
                <span>Already have an account?</span>
                <span className={styles.link}>
                    <Button
                        label='Sign in'
                        onClick={() => toggleForm('login')}
                        noAppearance={true}
                        size='small'
                        disabled={isLoading}
                    />
                </span>
            </div>
        </form>
    );
};

export default RegisterForm;