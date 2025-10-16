// Popup-only Google sign-in helper.
// Opens a popup to Google's OAuth2 endpoint and waits for a postMessage from
// /oauth2callback.html. Resolves with { idToken, accessToken } or rejects on error/timeout.

export const googleSignIn = async (clientId?: string): Promise<{ idToken?: string; accessToken?: string }> => {
    const client = clientId || process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!client) throw new Error('Google client id not provided');

    return new Promise((resolve, reject) => {
        const redirectUri = `${window.location.origin}/oauth2callback.html`;
        const scope = encodeURIComponent('openid email profile');
        const nonce = Math.random().toString(36).slice(2);
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
            client
        )}&response_type=token%20id_token&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&nonce=${encodeURIComponent(
            nonce
        )}&prompt=select_account`;

        let popup: Window | null = null;
        try {
            popup = window.open(url, 'google_oauth_popup', 'width=500,height=600');
        } catch (e) {
            return reject(new Error('Failed to open authentication popup'));
        }

        if (!popup) return reject(new Error('Failed to open authentication popup'));

        let timeoutId: number | null = null;

        const cleanup = () => {
            try {
                window.removeEventListener('message', messageHandler);
            } catch (_) {
                // ignore
            }
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        };

        const messageHandler = (ev: MessageEvent) => {
            try {
                if (ev.origin !== window.location.origin) return; // only accept same-origin
                const data = ev.data as any;
                if (!data || data.type !== 'oauth2callback' || data.provider !== 'google') return;
                cleanup();
                try {
                    if (popup && !popup.closed) popup.close();
                } catch (_) {
                    // ignore
                }
                if (data.error) return reject(new Error(data.error));
                return resolve({ idToken: data.id_token, accessToken: data.access_token });
            } catch (e) {
                // ignore
            }
        };

        window.addEventListener('message', messageHandler);

        timeoutId = window.setTimeout(() => {
            cleanup();
            try {
                if (popup && !popup.closed) popup.close();
            } catch (_) {
                // ignore
            }
            reject(new Error('Timed out waiting for OAuth response'));
        }, 2 * 60 * 1000);
    });
};
let popup: Window | null = null;
