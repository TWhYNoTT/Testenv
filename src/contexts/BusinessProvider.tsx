import React from 'react';
import { BusinessProvider as BaseBusinessProvider } from './BusinessContext';
import { ErrorProvider } from './ErrorContext';

export const BusinessProviderWithRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ErrorProvider>
            <BaseBusinessProvider>
                {children}
            </BaseBusinessProvider>
        </ErrorProvider>
    );
};
