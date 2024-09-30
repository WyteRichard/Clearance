import React from 'react';
import styles from "../styles/ForgotPassword.module.css";
import rcBackground1 from '../assets/rc background 1.jpg';
import user from '../assets/rc_logo.png';

const ForgotPassword = () => {
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${rcBackground1})` }}>
      <div className={styles.loginContainer}>
        <div className={styles.leftPanel}>
          <h2 className={styles.loginTitle}>Forgot Password</h2>
          <p>Please enter your username to reset your password</p>
          <form className={styles.form}>
            <div className={styles.inputContainer}>
              <i className={`${styles.inputIcon} fas fa-user`}></i>
              <input type="text" placeholder="Username" className={styles.inputField} />
            </div>
            <button type="submit" className={styles.loginButton}>Submit</button>
          </form>
        </div>

        <div className={styles.rightPanel}>
          <img src={user} alt="Logo" className={styles.logo} />
          <h2 className={styles.systemTitle}>Student Clearance System</h2>
          <p>Manage your academic clearance with ease</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
