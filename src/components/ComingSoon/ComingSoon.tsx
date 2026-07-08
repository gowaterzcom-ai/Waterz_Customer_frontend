import React from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/ComingSoon/ComingSoon.module.css";

const ComingSoon: React.FC = () => {
  return (
    <div className={styles.comp_body}>
      <p className={styles.eyebrow}>Coming Soon</p>
      <h1 className={styles.heading}>We're launching here soon</h1>
      <p className={styles.subhead}>
        We're not in this location just yet, but we're working on it.
        Check back soon, or explore the yachts already available.
      </p>
      <Link to="/discover" className={styles.btn}>
        Explore Available Yachts
      </Link>
    </div>
  );
};

export default ComingSoon;
