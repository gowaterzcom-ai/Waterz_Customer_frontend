import React from 'react';
import { authAPI } from '../../api/auth';
import googleIcon from "../../assets/LoginSignUp/google.svg";
import styles from "../../styles/LoginSignup/Login.module.css";

interface GoogleAuthButtonProps {
  text?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  text = "Continue with Google"
}) => {
  const handleGoogleAuth = () => {
    authAPI.initiateGoogleAuth();
  };

  return (
    <button 
      type="button" 
      className={styles.googleButton}
      onClick={handleGoogleAuth}
    >
      <img src={googleIcon} alt="Google" className={styles.googleIcon} />
      {text}
    </button>
  );
};

export default GoogleAuthButton;