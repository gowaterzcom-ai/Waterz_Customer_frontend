import React, { useState, useEffect } from "react";
import styles from "../../styles/LoginSignup/Signup.module.css";
import signPic from "../../assets/LoginSignUp/signup.webp";
import OTPVerification from "./OTP";
import { authAPI } from "../../api/auth";
import SuccessScreen from "./OTPVerified";
import { useNavigate } from "react-router-dom";
import GoogleAuthButton from "./GoogleAuth";

interface OTPData {
  otp: string;
  token: string;
  role: string;
}

type ViewState = 'signup' | 'otp' | 'success';

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  agreeToTerms: boolean;
}

interface SignupResponse {
  token: string;
}

// Email validation using an RFC 5322–inspired regex (good compromise)
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Password must contain at least one uppercase letter and one special character
const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
  return passwordRegex.test(password);
};

const SignupForm = ({ onSubmit, apiError }: { 
  onSubmit: (formData: SignupData) => Promise<void>; 
  apiError: string;
}) => {
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer',
    agreeToTerms: false
  });

  // We'll use a single error string for simplicity
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Update local error state when apiError changes
  useEffect(() => {
    if (apiError) {
      setError(apiError);
    }
  }, [apiError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic required field check
    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.agreeToTerms) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate email using RFC5322–inspired regex
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password format
    if (!validatePassword(formData.password)) {
      setError('Password must contain at least one uppercase letter and one special character');
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container_body}>
      <div className={styles.container}>
        <div className={styles.contentSection}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formHeader}>
            <span className={styles.userType}>Customer</span>
            <h1 className={styles.formTitle}>Get Started Now</h1>
            <p className={styles.formSubtitle}>Enter your Credentials to get access to your account</p>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => {
                  const email = e.target.value;
                  setFormData({ ...formData, email });
                  // Provide immediate feedback if desired
                  if (email && !validateEmail(email)) {
                    setError('Please enter a valid email address');
                  } else {
                    setError('');
                  }
                }}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => {
                  const password = e.target.value;
                  setFormData({ ...formData, password });
                  if (password && !validatePassword(password)) {
                    setError('Password must contain at least one uppercase letter and one special character');
                  } else {
                    setError('');
                  }
                }}
              />
            </div>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
              />
              <label htmlFor="terms">
                I agree to the <a href="#" className={styles.link}>terms & conditions</a>
              </label>
            </div>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
            <div className={styles.divider}><span>or</span></div>
            
            <GoogleAuthButton text="Sign Up with Google" />
            
            <p className={styles.loginPrompt}>
              Already have an account? <a href="/login" className={styles.link}>Log in</a>
            </p>
          </form>
        </div>
        <div className={styles.imageSection}>
          <img src={signPic} alt="People enjoying on yacht" className={styles.SyachtImage} />
        </div>
      </div>
    </div>
  );
};

const SignUp: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('signup');
  const [formData, setFormData] = useState<SignupData | null>(null);
  const [signupToken, setSignupToken] = useState<string>('');
  const [apiError, setApiError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentView === 'success') {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentView, navigate]);

  const handleSignupComplete = async (data: SignupData) => {
    try {
      setApiError(''); // Clear any previous errors
      // @ts-ignore
      const response: SignupResponse = await authAPI.signup(data);
      setFormData(data);
      setSignupToken(response.token);
      setCurrentView('otp');
    } catch (err: any) {
      // Extract the error message from the API response
      const errorMessage = err.response?.data?.message || err.response?.message || err.message || 'Failed to sign up. Please try again.';
      setApiError(errorMessage);
      throw err; // Re-throw to handle in the form component if needed
    }
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      setApiError(''); // Clear any previous errors
      if (!formData || !signupToken) {
        throw new Error('Missing required data for verification');
      }
      
      const otpData: OTPData = {
        otp: otp,
        token: signupToken,
        role: formData.role
      };
      
      await authAPI.verifyOTP(otpData);
      setCurrentView('success');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to verify OTP. Please try again.';
      setApiError(errorMessage);
      throw err;
    }
  };

  return (
    <>
      {currentView === 'signup' && <SignupForm onSubmit={handleSignupComplete} apiError={apiError} />}
      {currentView === 'otp' && formData && (
        <OTPVerification 
          email={formData.email} 
          onVerify={handleOTPVerify} 
          onBack={() => setCurrentView('signup')} 
          // error={apiError}
        />
      )}
      {currentView === 'success' && <SuccessScreen />}
    </>
  );
};

export default SignUp;

// import React, { useState, useEffect } from "react";
// import styles from "../../styles/LoginSignup/Signup.module.css";
// import signPic from "../../assets/LoginSignUp/signup.webp";
// import OTPVerification from "./OTP";
// import { authAPI } from "../../api/auth";
// import SuccessScreen from "./OTPVerified";
// import { useNavigate } from "react-router-dom";
// import GoogleAuthButton from "./GoogleAuth";

// interface OTPData {
//   otp: string;
//   token: string;
//   role: string;
// }

// type ViewState = 'signup' | 'otp' | 'success';

// interface SignupData {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   role: string;
//   agreeToTerms: boolean;
// }

// interface SignupResponse {
//   token: string;
// }

// // Email validation using an RFC 5322–inspired regex (good compromise)
// const validateEmail = (email: string): boolean => {
//   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//   return emailRegex.test(email);
// };

// // Password must contain at least one uppercase letter and one special character
// const validatePassword = (password: string): boolean => {
//   const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
//   return passwordRegex.test(password);
// };

// const SignupForm = ({ onSubmit }: { onSubmit: (formData: SignupData) => Promise<void>; }) => {
//   const [formData, setFormData] = useState<SignupData>({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     role: 'customer',
//     agreeToTerms: false
//   });

//   // We'll use a single error string for simplicity
//   const [error, setError] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     // Basic required field check
//     if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.agreeToTerms) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     // Validate email using RFC5322–inspired regex
//     if (!validateEmail(formData.email)) {
//       setError('Please enter a valid email address');
//       return;
//     }

//     // Validate password format
//     if (!validatePassword(formData.password)) {
//       setError('Password must contain at least one uppercase letter and one special character');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       await onSubmit(formData);
//     } catch (err: any) {
//       setError(err.message || 'Failed to sign up. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container_body}>
//       <div className={styles.container}>
//         <div className={styles.contentSection}>
//           {error && <p className={styles.error}>{error}</p>}
//           <div className={styles.formHeader}>
//             <span className={styles.userType}>Customer</span>
//             <h1 className={styles.formTitle}>Get Started Now</h1>
//             <p className={styles.formSubtitle}>Enter your Credentials to get access to your account</p>
//           </div>
//           <form onSubmit={handleSubmit} className={styles.form}>
//             <div className={styles.formGroup}>
//               <label>Name</label>
//               <input
//                 type="text"
//                 placeholder="Enter your name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label>Email Address</label>
//               <input
//                 type="email"
//                 placeholder="Enter your email address"
//                 value={formData.email}
//                 onChange={(e) => {
//                   const email = e.target.value;
//                   setFormData({ ...formData, email });
//                   // Provide immediate feedback if desired
//                   if (email && !validateEmail(email)) {
//                     setError('Please enter a valid email address');
//                   } else {
//                     setError('');
//                   }
//                 }}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label>Phone Number</label>
//               <input
//                 type="tel"
//                 placeholder="Enter your phone number"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//               />
//             </div>
//             <div className={styles.formGroup}>
//               <label>Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={(e) => {
//                   const password = e.target.value;
//                   setFormData({ ...formData, password });
//                   if (password && !validatePassword(password)) {
//                     setError('Password must contain at least one uppercase letter and one special character');
//                   } else {
//                     setError('');
//                   }
//                 }}
//               />
//             </div>
//             <div className={styles.checkboxGroup}>
//               <input
//                 type="checkbox"
//                 id="terms"
//                 checked={formData.agreeToTerms}
//                 onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
//               />
//               <label htmlFor="terms">
//                 I agree to the <a href="#" className={styles.link}>terms & conditions</a>
//               </label>
//             </div>
//             <button type="submit" className={styles.submitButton} disabled={isLoading}>
//               {isLoading ? 'Signing up...' : 'Sign Up'}
//             </button>
//             <div className={styles.divider}><span>or</span></div>
            
//             <GoogleAuthButton text="Sign Up with Google" />
            
//             <p className={styles.loginPrompt}>
//               Already have an account? <a href="/login" className={styles.link}>Log in</a>
//             </p>
//           </form>
//         </div>
//         <div className={styles.imageSection}>
//           <img src={signPic} alt="People enjoying on yacht" className={styles.SyachtImage} />
//         </div>
//       </div>
//     </div>
//   );
// };

// const SignUp: React.FC = () => {
//   const [currentView, setCurrentView] = useState<ViewState>('signup');
//   const [formData, setFormData] = useState<SignupData | null>(null);
//   const [signupToken, setSignupToken] = useState<string>('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (currentView === 'success') {
//       const timer = setTimeout(() => {
//         navigate('/login');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [currentView, navigate]);

//   const handleSignupComplete = async (data: SignupData) => {
//     try {
//       // @ts-ignore
//       const response: SignupResponse = await authAPI.signup(data);
//       setFormData(data);
//       setSignupToken(response.token);
//       setCurrentView('otp');
//     } catch (err: any) {
      
//       console.log("error", err.response.message);
//       throw err;
//     }
//   };

//   const handleOTPVerify = async (otp: string) => {
//     try {
//       if (!formData || !signupToken) {
//         throw new Error('Missing required data for verification');
//       }
      
//       const otpData: OTPData = {
//         otp: otp,
//         token: signupToken,
//         role: formData.role
//       };
      
//       await authAPI.verifyOTP(otpData);
//       setCurrentView('success');
//     } catch (err: any) {
//       throw err;
//     }
//   };

//   return (
//     <>
//       {currentView === 'signup' && <SignupForm onSubmit={handleSignupComplete} />}
//       {currentView === 'otp' && formData && (
//         <OTPVerification 
//           email={formData.email} 
//           onVerify={handleOTPVerify} 
//           onBack={() => setCurrentView('signup')} 
//         />
//       )}
//       {currentView === 'success' && <SuccessScreen />}
//     </>
//   );
// };

// export default SignUp;
