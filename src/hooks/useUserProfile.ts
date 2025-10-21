import { useUserProfileContext } from '../contexts/UserProfileContext';

export const useUserProfile = () => {
    const ctx = useUserProfileContext();
    return {
        profile: ctx.profile,
        loading: ctx.loading,
        error: ctx.error,
        loadProfile: ctx.loadProfile,
        updateProfile: ctx.updateProfile,
        changePassword: ctx.changePassword,
    };
};

export default useUserProfile;
