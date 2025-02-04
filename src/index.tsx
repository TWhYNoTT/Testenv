import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App';
import { ThemeProvider } from './ThemeContext';
import { BrowserRouter } from 'react-router-dom';

import './styles/global.css'

let root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);