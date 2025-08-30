export interface UserDetails {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  role?: string;
  isVerified?: boolean;
}

export interface UserState {
  userDetails: UserDetails;
  isAuthenticated: boolean;
}


// export interface UserDetails {
//     id?: string;
//     name?: string;
//     email?: string;
//     phone?: string;
//     type?: string;
//     role?: string;
//   }
  
// export interface UserState {
//   userDetails: UserDetails;
//   isAuthenticated: boolean;
// }