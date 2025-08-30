import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store/hook";
import { setUserDetails } from "../../redux/slices/userSlice";
import styles from "../../styles/LoginSignup/Login.module.css";
import loginPic from "../../assets/LoginSignUp/signup.webp";
import GoogleAuthButton from "./GoogleAuth";
import { authAPI } from "../../api/auth";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'customer',
  });

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authAPI.login(formData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        
        dispatch(setUserDetails({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role
        }));
      }
      
      navigate('/discover');
      
    } catch (err: any) {
      const errorMessage = err.type === 'AUTH_ERROR' 
        ? 'Invalid email or password'
        : err.message || 'Failed to login. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container_body}>
      <div className={styles.container}>
        <div className={styles.contentSection}>
          {error && (
            <p className={styles.error}>{error}</p>
          )}

          <div className={styles.formHeader}>
            <span className={styles.userType}>Customer</span>
            <h1 className={styles.formTitle}>Welcome Back!</h1>
            <p className={styles.formSubtitle}>Enter your Credentials to get access to your account</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <GoogleAuthButton text="Sign in with Google" />

            <p className={styles.loginPrompt}>
              Don't have an account? <a href="/signup" className={styles.link}>Sign Up</a>
            </p>
          </form>
        </div>

        <div className={styles.imageSection}>
          <img 
            src={loginPic}
            alt="People enjoying on yacht"
            className={styles.SyachtImage}
          />
        </div>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  return <LoginForm />;
};

export default Login;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAppDispatch } from "../../redux/store/hook";
// import { setUserDetails } from "../../redux/slices/userSlice";
// import styles from "../../styles/LoginSignup/Login.module.css";
// import loginPic from "../../assets/LoginSignUp/signup.webp";
// import GoogleAuthButton from '../Button/AuthButton';

// import { authAPI } from "../../api/auth";

// const LoginForm = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
  
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     role: 'customer',
//   });

//   const [error, setError] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(false);

//   // const handleGoogleLogin = () => {
//   //   window.location.href = 'https://www.backend.wavezgoa.com/auth/google';
//   // };
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     if (!formData.email || !formData.password) {
//       setError('Please fill in all required fields');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await authAPI.login(formData);
      
//       if (response.token) {
//         localStorage.setItem('token', response.token);
//         localStorage.setItem('userData', JSON.stringify(response.user));
        
//         dispatch(setUserDetails({
//           id: response.user.id,
//           email: response.user.email,
//           name: response.user.name,
//           role: response.user.role
//         }));
//       }
      
//       navigate('/discover');
      
//     } catch (err: any) {
//       const errorMessage = err.type === 'AUTH_ERROR' 
//         ? 'Invalid email or password'
//         : err.message || 'Failed to login. Please try again.';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container_body}>
//       <div className={styles.container}>
//         <div className={styles.contentSection}>
//           {error && (
//             <p className={styles.error}>{error}</p>
//           )}

//           <div className={styles.formHeader}>
//             <span className={styles.userType}>Customer</span>
//             <h1 className={styles.formTitle}>Welcome Back!</h1>
//             <p className={styles.formSubtitle}>Enter your Credentials to get access to your account</p>
//           </div>

//           <form onSubmit={handleSubmit} className={styles.form}>
//             <div className={styles.formGroup}>
//               <label>Email Address</label>
//               <input
//                 type="email"
//                 placeholder="Enter your email address"
//                 value={formData.email}
//                 onChange={(e) => setFormData({...formData, email: e.target.value})}
//                 disabled={isLoading}
//               />
//             </div>

//             <div className={styles.formGroup}>
//               <label>Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({...formData, password: e.target.value})}
//                 disabled={isLoading}
//               />
//             </div>

//             <button 
//               type="submit" 
//               className={styles.submitButton}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Logging in...' : 'Log In'}
//             </button>

//             <div className={styles.divider}>
//               <span>or</span>
//             </div>

//             <GoogleAuthButton text="Sign in with Google" />

//             <p className={styles.loginPrompt}>
//               Don't have an account? <a href="/signup" className={styles.link}>Sign Up</a>
//             </p>
//           </form>
//         </div>

//         <div className={styles.imageSection}>
//           <img 
//             src={loginPic}
//             alt="People enjoying on yacht"
//             className={styles.SyachtImage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const Login: React.FC = () => {
//   return <LoginForm />;
// };

// export default Login;

