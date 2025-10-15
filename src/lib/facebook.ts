// Shared Facebook SDK loader and helpers
export const loadFacebookSdk = (): Promise<void> => {
    return new Promise<void>((resolve) => {
        if ((window as any).FB) return resolve();

        (window as any).fbAsyncInit = function () {
            (window as any).FB.init({
                appId: process.env.REACT_APP_FACEBOOK_APP_ID || '',
                cookie: true,
                xfbml: true,
                version: 'v16.0'
            });
            resolve();
        };

        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    });
};

export const fbLogin = async (scope = 'email,public_profile'): Promise<any> => {
    await loadFacebookSdk();

    return new Promise((resolve, reject) => {
        (window as any).FB.login((response: any) => {
            if (response.authResponse && response.authResponse.accessToken) {
                resolve(response);
            } else if (response.status === 'not_authorized' || response.status === 'unknown') {
                // user cancelled or not authorized
                reject({ cancelled: true, message: 'Facebook sign-in process was canceled. You can try signing in again or use another method.' });
            } else {
                // generic failure
                reject({ cancelled: false, message: 'Facebook authentication failed. Please check your credentials or try again later.' });
            }
        }, { scope });
    });
};
