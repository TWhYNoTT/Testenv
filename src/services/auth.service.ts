import { apiService } from './api';

export interface LogoutRequest {
    refreshToken: string;
    logoutFromAllDevices: boolean;
}

class AuthService {
    async logout(logoutFromAllDevices: boolean = false): Promise<boolean> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) return true;

        try {
            const response = await apiService.logout({
                refreshToken,
                logoutFromAllDevices
            });

            if (response.success) {
                apiService.clearTokens();
                return true;
            }
            return false;
        } catch (error) {
            // Even if the API call fails, clear tokens locally
            apiService.clearTokens();
            return true;
        }
    }
}

export const authService = new AuthService();
