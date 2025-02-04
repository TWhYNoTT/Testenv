import React from 'react';
import { ToastProvider } from './ToastContext';
import { ErrorProvider } from './ErrorContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ToastProvider>
            <ErrorProvider>
                {children}s
            </ErrorProvider>
        </ToastProvider>
    );
};
