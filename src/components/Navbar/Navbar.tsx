import React, { useEffect, useState, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import styles from "../../styles/Navbar/Navbar.module.css";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store/hook";
import { setUserDetails, clearUserDetails } from "../../redux/slices/userSlice";
import logo from "../../assets/Home/logo.png"
const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for token in localStorage when component mounts
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        dispatch(setUserDetails(parsedUserData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        dispatch(clearUserDetails());
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both the menu and hamburger button
      if (
        menuRef.current && 
        hamburgerRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    // Add click event listener to the document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Toggle menu for mobile
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Plain nav links, shared between desktop and mobile
  const navLinks = (
    <>
      <Link to="/" onClick={() => setMenuOpen(false)}>
        <div className={styles.item}>Home</div>
      </Link>
      <Link to="/discover" onClick={() => setMenuOpen(false)}>
        <div className={styles.item}>Discover</div>
      </Link>
      <Link to="/bookings" onClick={() => setMenuOpen(false)}>
        <div className={styles.item}>My Bookings</div>
      </Link>
      <Link to="/location" onClick={() => setMenuOpen(false)}>
        <div className={styles.item}>Location</div>
      </Link>
    </>
  );

  // Account/SignUp call-to-action, styled as a standalone pill button
  const authAction = isAuthenticated ? (
    <Link to="/account" className={styles.authPill} onClick={() => setMenuOpen(false)}>
      <span>Account</span>
      <span className={styles.authPillIcon}>
        <ArrowUpRight size={16} />
      </span>
    </Link>
  ) : (
    <Link to="/signup" className={styles.authPill} onClick={() => setMenuOpen(false)}>
      <span>SignUp</span>
      <span className={styles.authPillIcon}>
        <ArrowUpRight size={16} />
      </span>
    </Link>
  );

  return (
    <header className={styles.comp_body}>
      <div className={styles.content}>
        <div className={styles.navBox}>
          <div className={styles.brand}>
            <Link to="/">
              {/* <div className={styles.logobox}> */}
                  <img src={logo} width="100%" style={{paddingTop:"8px"}} alt="GoWaterz home" />
              {/* </div> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktop_nav} aria-label="Main">{navLinks}</nav>
        </div>

        <div className={styles.desktop_auth}>{authAction}</div>

        {/* Hamburger icon for mobile */}
        <div
          ref={hamburgerRef}
          className={styles.hamburger}
          onClick={toggleMenu}
          role="button"
          tabIndex={0}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleMenu();
            }
          }}
        >
          <span aria-hidden="true">&#9776;</span>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <nav ref={menuRef} className={styles.mobile_menu} aria-label="Mobile">
          {navLinks}
          <div className={styles.mobile_auth}>{authAction}</div>
        </nav>
      )}
    </header>
  );
};


export default Navbar;

