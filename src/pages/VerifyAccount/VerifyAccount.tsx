import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const VerifyAccount: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const token = searchParams.get('token');
                const userId = searchParams.get('userId');

                if (!token || !userId) {
                    setErrorMessage('Invalid verification link');
                    setVerificationStatus('error');
                    setTimeout(() => navigate('/form/login'), 3000);
                    return;
                }

                await apiService.verifyAccount({
                    userId: parseInt(userId),
                    userType: 2,
                    verificationToken: token
                });

                setVerificationStatus('success');
                showToast('Account verified successfully!', 'success');
                setTimeout(() => navigate('/form/login'), 3000);
            } catch (error: any) {
                setErrorMessage(error.response?.data?.message || 'Verification failed');
                setVerificationStatus('error');
                setTimeout(() => navigate('/form/login'), 3000);
            }
        };

        verifyAccount();
    }, [navigate, searchParams, showToast]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                {verificationStatus === 'verifying' && (
                    <h2 className="text-xl text-gray-700">Verifying your account...</h2>
                )}
                {verificationStatus === 'success' && (
                    <div>
                        <h2 className="text-xl text-green-600">Account verified successfully!</h2>
                        <p className="mt-2 text-gray-600">Redirecting to login page...</p>
                    </div>
                )}
                {verificationStatus === 'error' && (
                    <div>
                        <h2 className="text-xl text-red-600">Verification failed</h2>
                        <p className="mt-2 text-gray-600">{errorMessage}</p>
                        <p className="mt-2 text-gray-600">Redirecting to login page...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyAccount;
