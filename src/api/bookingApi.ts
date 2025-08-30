import { apiClient } from './apiClient';
import { paths } from './paths';

export interface Booking {
  _id: string;
  name: string;
  capacity: number;
  startDate: string;
  images: string[];
}

export const bookingAPI = {
  getCurrentBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get(paths.currentRides);
    return response.data.AllCurrentRides || [];
  },
  
  getPreviousBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get(paths.prevRides);
    return response.data.AllPreviousRides || [];
  }
};