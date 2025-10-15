// Lightweight Google Sign-In helper using Google Identity Services
// Exports a function `googleSignIn` which returns a Promise resolving to the ID token or rejects with structured errors

export const loadGoogleSdk = (): Promise<void> => {
    return new Promise((resolve) => {
        if ((window as any).google && (window as any).google.accounts) return resolve();

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
    });
};

export const googleSignIn = async (clientId?: string): Promise<any> => {
    await loadGoogleSdk();

    return new Promise((resolve, reject) => {
        try {
            const cb = (response: any) => {
                if (response?.credential) {
                    resolve({ idToken: response.credential });
                } else {
                    reject({ cancelled: true, message: 'Google sign-in process was canceled. You can try signing in again or use another method.' });
                }
            };

            (window as any).google.accounts.id.initialize({
                client_id: clientId || process.env.REACT_APP_GOOGLE_CLIENT_ID,
                callback: cb
            });

            // Prompt the user; this will show a popup or one-tap prompt depending on browser state
            (window as any).google.accounts.id.prompt();
        } catch (err: any) {
            reject({ cancelled: false, message: 'Google authentication failed. Please check your credentials or try again later.' });
        }
    });
};
