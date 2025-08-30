// components/Account/Account.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/store/hook';
import { clearUserDetails } from '../../redux/slices/userSlice';
import styles from '../../styles/Account/Account.module.css';
// import { PencilIcon } from 'lucide-react';

const Account: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userDetails } = useAppSelector((state) => state.user);
  
  const [isAccountTypeOpen, setIsAccountTypeOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    console.log('User logged out');
    dispatch(clearUserDetails());
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Account</h1>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Personal Details</h2>
          {/* <PencilIcon className={styles.editIcon} size={20} /> */}
        </div>
        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <span className={styles.label}>Name:</span>
            <span className={styles.value}>{userDetails.name}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Phone Number:</span>
            <span className={styles.value}>{userDetails.phone || ''}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.label}>Email Id:</span>
            <span className={styles.value}>{userDetails.email}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div 
          className={styles.dropdownHeader}
          onClick={() => setIsAccountTypeOpen(!isAccountTypeOpen)}
        >
          <h2 className={styles.sectionTitle}>Account Type</h2>
          <span className={`${styles.arrow} ${isAccountTypeOpen ? styles.open : ''}`}>▼</span>
        </div>
        {isAccountTypeOpen && (
          <div className={styles.dropdownContent}>
            <p>{userDetails.role || 'Customer'}</p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div 
          className={styles.dropdownHeader}
          onClick={() => setIsTermsOpen(!isTermsOpen)}
        >
          <h2 className={styles.sectionTitle}>Terms & Conditions</h2>
          <span className={`${styles.arrow} ${isTermsOpen ? styles.open : ''}`}>▼</span>
        </div>
        {isTermsOpen && (
          <div className={styles.dropdownContent}>
            <p>Our terms and conditions...</p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div 
          className={styles.dropdownHeader}
          onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
        >
          <h2 className={styles.sectionTitle}>Security & Privacy Policy</h2>
          <span className={`${styles.arrow} ${isPrivacyOpen ? styles.open : ''}`}>▼</span>
        </div>
        {isPrivacyOpen && (
          <div className={styles.dropdownContent}>
            <p>Our privacy policy...</p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div 
          className={styles.dropdownHeader}
          onClick={() => setIsHelpOpen(!isHelpOpen)}
        >
          <h2 className={styles.sectionTitle}>Help & Contact Us</h2>
          <span className={`${styles.arrow} ${isHelpOpen ? styles.open : ''}`}>▼</span>
        </div>
        {isHelpOpen && (
          <div className={styles.dropdownContent}>
            <p>Contact support at support@example.com</p>
          </div>
        )}
      </section>

      <button 
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};

export default Account;