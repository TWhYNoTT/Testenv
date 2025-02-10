// src/contexts/ErrorContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useToast } from './ToastContext';
import { setToastService } from '../services/api';

interface ErrorContextType {
    clearErrors: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const toast = useToast();

    useEffect(() => {
        setToastService(toast);
    }, [toast]);

    const clearErrors = () => {
        // Add any additional error clearing logic if needed
    };

    return (
        <ErrorContext.Provider value={{ clearErrors }}>
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => {
    const context = useContext(ErrorContext);
    if (!context) {
        throw new Error('useError must be used within ErrorProvider');
    }
    return context;
};