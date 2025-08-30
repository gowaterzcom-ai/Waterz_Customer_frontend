import { apiClient, nonAuthApiClient } from './apiClient';
import paths from './paths';
import { UserDetails } from '../types/user';


const GOOGLE_REDIRECT_URI = 'https://www.wavezgoa.com/discover';


interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  type: string;
}

interface OTPData {
  otp: string;
}

interface EmailData {
  otp: string;
}

interface GoogleProfileData {
  phone: string;
  role: string;
}

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await nonAuthApiClient.post(paths.login, credentials);
    return response.data;
  },

  signup: async (userData: SignupData) => {
    const response = await nonAuthApiClient.post(paths.signupCustomer, userData);
    return response.data;
  },

  generateOTP: async (email: EmailData) => {
    const response = await nonAuthApiClient.post(paths.generateOtp, email);
    return response.data;
  },

  verifyOTP: async (otp: OTPData) => {
    const response = await nonAuthApiClient.post(paths.verifyOtp, otp);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post(paths.logout);
    return response.data;
  },

  getUserProfile: async (): Promise<UserDetails> => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get(paths.getUserProfile,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  },


  updateUserProfile: async (userData: Partial<UserDetails>) => {
    const response = await apiClient.post(paths.updateUserProfile, userData);
    return response.data;
  },
  initiateGoogleAuth: () => {
    window.location.href = `${paths.googleAuth}?redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}`;
  },
  // Google authentication
  completeGoogleProfile: async (data: GoogleProfileData) => {
    const response = await apiClient.post('/auth/complete-profile', data);
    return response.data;
  },
  
  checkGoogleAuth: async (email: string) => {
    const response = await nonAuthApiClient.post('/auth/check-google-auth', { email });
    return response.data;
  },
};