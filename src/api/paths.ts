const URL = "https://www.backend.gowaterz.com"; 
// const URL = "http://localhost:8000"; //local server
const userBaseURL = URL + "/user";
const signUp = URL + "/auth";
const customer = URL + "/customer";
export const paths = {
  // Auth endpoints
  login: `${signUp}/signin`,
  signupCustomer: `${signUp}/signup/customer`,
  generateOtp: `${signUp}/generate-otp`,
  verifyOtp: `${signUp}/verify-otp`,
  logout: `${userBaseURL}/logout`,
  googleAuth: `${userBaseURL}/google`,
  
  // User endpoints
  getUserProfile: `${customer}/me`,
  updateUserProfile: `${customer}/profile/update`,
  
  // yacht
  getYachtList: `${customer}/listAll`,
  getTopYachts: `${customer}/topYatch`,
  getYachtById: `${customer}/yatch-detail`,
  getBookingSlots: `${customer}/booking-slots`,

  // query
  userQuery: `${URL}/query`,

  // filter
  locationFilter: `${customer}/idealYatchs`,
  bookYacht: `${customer}/create`,

  // Booking endpoints
    currentRides: `${customer}/current/rides`,
    prevRides: `${customer}/prev/rides`,
    prevRidesId: `${customer}/rides`,
    couponCode: `${customer}/validatePromoCode`
};

export default paths;

