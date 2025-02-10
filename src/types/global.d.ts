
declare global {
    interface Window {
        __loadingCallback?: () => void;
    }
}

export { };