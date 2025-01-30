import React, { useState } from 'react';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import styles from './ForgetPasswordForm.module.css';

interface ForgetFormProps {
    toggleForm: (form: 'login' | 'register' | 'forgetPassword' | 'partner') => void;
}

type Step = 'step1' | 'step2' | 'step3';

const ForgetPasswordForm: React.FC<ForgetFormProps> = ({ toggleForm }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState<Step>('step1');

    const handleForgetPassword = () => {
        if (step === 'step1')
            setStep('step2')
        else if (step === 'step2')
            setStep('step3')
        else if (step === 'step3')
            setStep('step1')
    };

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
                    <div className={styles.buttonWrpr}>
                        <Button
                            type="submit"
                            label="Submit"
                            onClick={handleForgetPassword}
                            variant="primary"
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
                        <span>Didn't receive an Email yet?</span><span className={styles.link}><Button onClick={handleForgetPassword} label='Resend email' noAppearance={true} size='small' /></span>
                    </div>
                </div>
            }
            {
                step === 'step3' &&


                <form className={styles.ForgetPasswordForm} onSubmit={(e) => e.preventDefault()}>

                    <h2 className={styles.forgetTextH}>Let’s choose a new Password</h2>
                    <div>
                        <h3 className={styles.forgetTextP}>Enter your new password</h3>

                    </div>
                    <div className={styles.forgetFields}>
                        <InputField
                            label="Enter your new passwor"
                            value={password}
                            onChange={setPassword}
                            placeholder="Password"
                            type="password"

                        />
                        <InputField
                            label="Confrim your new password "
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            placeholder="Password"
                            type="password"

                        />
                    </div>
                    <div className={styles.buttonWrpr}>
                        <Button
                            type="submit"
                            label="Reset password"
                            onClick={() => { toggleForm('partner') }}
                            variant="primary"
                        />
                    </div>
                </form>
            }
        </>
    );
};

export default ForgetPasswordForm;
