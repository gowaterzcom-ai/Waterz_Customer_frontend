// hooks/useUserStatus.ts

import { useAppSelector } from '../redux/store/hook';
import { UserDetails } from '../types/user';

export const useUserStatus = () => {
  const userDetails: UserDetails = useAppSelector(state => state.user.userDetails);
  const isLoggedIn = !!userDetails.id;


  return { isLoggedIn, userDetails };
};
