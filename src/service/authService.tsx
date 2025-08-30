import { apiClient } from '../api/apiClient';

export const authService = {
  async handleGoogleAuth(token: string) {
    try {
      const response = await apiClient.post('/auth/google/callback', { token });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/customer/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};