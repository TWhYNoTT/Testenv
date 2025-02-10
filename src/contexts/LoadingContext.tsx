import React, { createContext, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoadingContextType {
    showLoadingScreen: (nextAction: () => void) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();

    const showLoadingScreen = useCallback((nextAction: () => void) => {
        // Store the next action directly in sessionStorage
        sessionStorage.setItem('nextAction', 'true');
        // Store the intended action as a custom event
        window.addEventListener('loadingComplete', nextAction, { once: true });
        navigate('/dashboard');
    }, [navigate]);

    return (
        <LoadingContext.Provider value={{ showLoadingScreen }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within LoadingProvider');
    }
    return context;
};
