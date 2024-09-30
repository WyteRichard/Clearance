import React, { useState } from 'react';
import styles from "../styles/ForgotPassword.module.css";
import rcBackground1 from '../assets/rc background 1.jpg';
import user from '../assets/rc_logo.png';
import eyeclose from '../assets/eyeclose.png';
import eyeopen from '../assets/eyeopen.png';

const ForgotPassword = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${rcBackground1})` }}>
      <div className={styles.loginContainer}>
        <div className={styles.leftPanel}>
          <h2 className={styles.loginTitle}>Reset Password</h2>
          <p>Please enter your details</p>
          <form className={styles.form}>
            <div className={styles.inputContainer}>
              <i className={`${styles.inputIcon} fas fa-user`}></i>
              <input type="text" placeholder="Username" className={styles.inputField} />
            </div>
            <div className={styles.inputContainer}>
              <i className={`${styles.inputIcon} fas fa-lock`}></i>
              <input type="text" placeholder="OTP" className={styles.inputField} />
            </div>
            <div className={styles.passwordContainer}>
              <i className={`${styles.inputIcon} fas fa-lock`}></i>
              <input
                type={passwordShown ? "text" : "password"}
                placeholder="New Password"
                className={styles.inputField}
              />
              <img
                src={passwordShown ? eyeopen : eyeclose}
                alt="Toggle visibility"
                className={styles.eyeIcon}
                onClick={togglePasswordVisibility}
              />
            </div>

            <div className={styles.buttonContainer}>
                <button type="button" className={styles.cancelButton}>Cancel</button>
                <button type="submit" className={styles.loginButton}>Change Password</button>
            </div>

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
