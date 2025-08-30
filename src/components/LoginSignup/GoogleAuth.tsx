import React from 'react';
import styles from '../../styles/LoginSignup/Login.module.css';
import googleIcon from '../../assets/LoginSignUp/google.svg';

interface GoogleAuthButtonProps {
  text: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ text }) => {
  const handleGoogleAuth = () => {
    const currentOrigin = window.location.origin;
    window.location.href = `https://www.backend.wavezgoa.com/auth/google?redirect_uri=${encodeURIComponent(currentOrigin)}`;
  };

  return (
    <button 
      type="button" 
      className={styles.googleButton}
      onClick={handleGoogleAuth}
    >
      <img src={googleIcon} alt="Google" />
      {text}
    </button>
  );
};

export default GoogleAuthButton;