import { useEffect } from 'react';

// Fallback navigation prompt that does NOT rely on unstable react-router APIs.
// It intercepts in-app link clicks and browser history popstate (back/forward)
// and shows a confirmation dialog when `when` is true. This covers common
// user navigations (internal links, back button). It does not intercept
// programmatic `navigate()` calls from code.
export default function useNavigationPrompt(when: boolean, message = 'You have unsaved changes. Do you want to leave this page?') {
    useEffect(() => {
        if (!when) return;

        // Intercept link clicks in the document capture phase
        const onClick = (e: MouseEvent) => {
            try {
                const target = e.target as HTMLElement | null;
                if (!target) return;
                const anchor = target.closest && (target.closest('a') as HTMLAnchorElement | null);
                if (!anchor) return;

                const href = anchor.getAttribute('href');
                if (!href) return;

                // Ignore same-page anchors, mailto, tel, and external links
                if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
                const isExternal = href.startsWith('http') && !href.startsWith(window.location.origin);
                if (isExternal) return;

                // If user cancels, prevent navigation
                const allow = window.confirm(message);
                if (!allow) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            } catch (ex) {
                // swallow errors to avoid breaking the app
            }
        };

        // Handle browser back/forward (popstate). We push a state so we can detect
        // the back event and restore the state if user cancels.
        const onPopstate = (e: PopStateEvent) => {
            try {
                const allow = window.confirm(message);
                if (!allow) {
                    // Re-push current URL to keep user on the page
                    window.history.pushState(null, '', window.location.href);
                }
            } catch (ex) {
                // ignore
            }
        };

        document.addEventListener('click', onClick, true);
        // Push an extra history entry so popstate fires when user clicks back
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', onPopstate);

        return () => {
            document.removeEventListener('click', onClick, true);
            window.removeEventListener('popstate', onPopstate);
            // No cleanup required; leaving history entries as-is is safer than manipulating history on unmount
        };
    }, [when, message]);
}
