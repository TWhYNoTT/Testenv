import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

// Layout Components
import MainLayout from './components/MainLayout';
import FormLayout from './forms/FormLayout';

// Page Components 
import Dashboard from './pages/Dashboard/Dashboard';
import Branches from './pages/Branches/Branches';
import AppointmentsPage from './pages/Appointments/Appointments';
import Services from './pages/Services/Services';
import Employee from './pages/Employee/Employee';
import Promotion from './pages/Promotion/Promotion';
import Settings from './pages/Settings/Settings';
import AccountSettings from './pages/Settings/AccountSettings/AccountSettings';
import UserRoles from './pages/Settings/UserRoles/UserRoles';
import PaymentSettings from './pages/Settings/PaymentSettings/PaymentSettings';
import Help from './pages/Help/Help';
import VerifyAccount from './pages/VerifyAccount/VerifyAccount';
import LoadingScreen from './pages/LoadingScreen/LoadingScreen';

// Form Components
import LoginForm from './forms/LoginForm/LoginForm';
import RegisterForm from './forms/RegisterForm/RegisterForm';
import ForgetPasswordForm from './forms/ForgetPasswordForm/ForgetPasswordForm';
import PartnerRequestForm from './forms/PartnerRequestForm/PartnerRequestForm';
import Wizard from './components/CreateBusinessWizard/Wizard';

// Context Providers
import { BusinessProviderWithRouter } from './contexts/BusinessProvider';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorProvider } from './contexts/ErrorContext';

import { LoadingProvider } from './contexts/LoadingContext';
import { UserProvider } from './contexts/UserContext';

// Styles
import './styles/global.css';

// Types
type FormType = 'login' | 'register' | 'forgetPassword' | 'partner';

const App: React.FC = () => {
    return (
        <ToastProvider>
            <ErrorProvider>
                <AuthProvider>
                    <UserProvider>
                        <BusinessProviderWithRouter>
                            <LoadingProvider>

                                <Routes>
                                    {/* Add LoadingScreen route */}
                                    <Route path="/dashboard" element={<LoadingScreen />} />

                                    {/* Add this new route before existing routes */}
                                    <Route path="/verify-account" element={<VerifyAccount />} />

                                    {/* Dashboard Route */}
                                    <Route
                                        path="/"
                                        element={
                                            <MainLayout>
                                                <Dashboard />
                                            </MainLayout>
                                        }
                                    />

                                    {/* Main Feature Routes */}
                                    <Route
                                        path="/appointments"
                                        element={
                                            <MainLayout>
                                                <AppointmentsPage />
                                            </MainLayout>
                                        }
                                    />
                                    <Route
                                        path="/services"
                                        element={
                                            <MainLayout>
                                                <Services />
                                            </MainLayout>
                                        }
                                    />
                                    <Route
                                        path="/employee"
                                        element={
                                            <MainLayout>
                                                <Employee />
                                            </MainLayout>
                                        }
                                    />
                                    <Route
                                        path="/promotion"
                                        element={
                                            <MainLayout>
                                                <Promotion />
                                            </MainLayout>
                                        }
                                    />

                                    {/* Settings Routes */}
                                    <Route
                                        path="/settings"
                                        element={
                                            <MainLayout>
                                                <Settings />
                                            </MainLayout>
                                        }
                                    />
                                    <Route
                                        path="/settings/accountsettings"
                                        element={
                                            <MainLayout>
                                                <AccountSettings />
                                            </MainLayout>
                                        }
                                    />
                                    <Route
                                        path="/settings/branches"
                                        element={
                                            <MainLayout>
                                                <Branches />
                                            </MainLayout>
                                        }
                                    />
                                    <Route
                                        path="/settings/userroles"
                                        element={
                                            <MainLayout>
                                                <UserRoles />
                                            </MainLayout>
                                        }
                                    />
                                    <Route
                                        path="/settings/paymentsettings"
                                        element={
                                            <MainLayout>
                                                <PaymentSettings />
                                            </MainLayout>
                                        }
                                    />

                                    {/* Help Route */}
                                    <Route
                                        path="/help"
                                        element={
                                            <MainLayout>
                                                <Help />
                                            </MainLayout>
                                        }
                                    />

                                    {/* Authentication Routes */}
                                    <Route path="/form/*" element={<FormWrapper />} />

                                    {/* Business Setup Route */}
                                    <Route path="/wizard" element={<Wizard />} />
                                </Routes>

                            </LoadingProvider>
                        </BusinessProviderWithRouter>
                    </UserProvider>
                </AuthProvider>
            </ErrorProvider>
        </ToastProvider>
    );
};

const FormWrapper: React.FC = () => {
    const [transition, setTransition] = useState(false);
    const navigate = useNavigate();

    const toggleForm = (form: FormType) => {
        setTransition(true);
        setTimeout(() => {
            navigate(`/form/${form}`);
            setTransition(false);
        }, 300);
    };

    return (
        <FormLayout>
            <div className={`form-transition ${transition ? 'fade-out' : 'fade-in'}`}>
                <Routes>
                    <Route
                        path="login"
                        element={<LoginForm toggleForm={toggleForm} />}
                    />
                    <Route
                        path="register"
                        element={<RegisterForm toggleForm={toggleForm} />}
                    />
                    <Route
                        path="forgetPassword"
                        element={<ForgetPasswordForm toggleForm={toggleForm} />}
                    />
                    <Route
                        path="partner"
                        element={<PartnerRequestForm toggleForm={toggleForm} />}
                    />
                </Routes>
            </div>
        </FormLayout>
    );
};

export default App;