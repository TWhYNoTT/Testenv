import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Branches from './pages/Branches/Branches';
import FormLayout from './forms/FormLayout';
import LoginForm from './forms/LoginForm/LoginForm';
import RegisterForm from './forms/RegisterForm/RegisterForm';
import ForgetPasswordForm from './forms/ForgetPasswordForm/ForgetPasswordForm';
import PartnerRequestForm from './forms/PartnerRequestForm/PartnerRequestForm';
import Wizard from './components/CreateBusinessWizard/Wizard';
import AppointmentsPage from './pages/Appointments/Appointments';
import Services from './pages/Services/Services';

import './styles/global.css';
import Employee from './pages/Employee/Employee';
import Promotion from './pages/Promotion/Promotion';
import Settings from './pages/Settings/Settings';
import AccountSettings from './pages/Settings/AccountSettings/AccountSettings';
import UserRoles from './pages/Settings/UserRoles/UserRoles';
import PaymentSettings from './pages/Settings/PaymentSettings/PaymentSettings';
import Help from './pages/Help/Help';

type FormType = 'login' | 'register' | 'forgetPassword' | 'partner';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <MainLayout>
                        <Dashboard />
                    </MainLayout>
                } />
                <Route path="/appointments" element={
                    <MainLayout>
                        <AppointmentsPage />
                    </MainLayout>
                } />
                <Route path="/services" element={
                    <MainLayout>
                        <Services />
                    </MainLayout>
                } />
                <Route path="/employee" element={
                    <MainLayout>
                        <Employee />
                    </MainLayout>
                } />
                <Route path="/promotion" element={
                    <MainLayout>
                        <Promotion />
                    </MainLayout>
                } />
                <Route path="/settings" element={
                    <MainLayout>
                        <Settings />
                    </MainLayout>
                } />
                <Route path="/settings/accountsettings" element={
                    <MainLayout>
                        <AccountSettings />
                    </MainLayout>
                } />
                <Route path="/settings/branches" element={
                    <MainLayout>
                        <Branches />
                    </MainLayout>
                } />
                <Route path="/settings/userroles" element={
                    <MainLayout>
                        <UserRoles />
                    </MainLayout>
                } />
                <Route path="/settings/paymentsettings" element={
                    <MainLayout>
                        <PaymentSettings />
                    </MainLayout>
                } />
                <Route path="/help" element={
                    <MainLayout>
                        <Help />
                    </MainLayout>
                } />

                <Route path="/form/*" element={<FormWrapper />} />
                <Route path="/wizard" element={<Wizard />} />
            </Routes>
        </Router>
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
                    <Route path="login" element={<LoginForm toggleForm={toggleForm} />} />
                    <Route path="register" element={<RegisterForm toggleForm={toggleForm} />} />
                    <Route path="forgetPassword" element={<ForgetPasswordForm toggleForm={toggleForm} />} />
                    <Route path="partner" element={<PartnerRequestForm toggleForm={toggleForm} />} />
                </Routes>
            </div>
        </FormLayout>
    );
};

export default App;
