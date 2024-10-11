import React, { useState } from 'react';
import styles from "../styles/ForgotPassword.module.css";
import rcBackground1 from '../assets/rc background 1.jpg';
import user from '../assets/rc_logo.png';
import eyeclose from '../assets/eyeclose.png';
import eyeopen from '../assets/eyeopen.png';

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${rcBackground1})` }}>
      <div className={styles.loginContainer}>
        <div className={styles.leftPanel}>
          <h2 className={styles.loginTitle}>{isSubmitted ? "Reset Password" : "Forgot Password"}</h2>
          <p>{isSubmitted ? "Please enter your details" : "Please enter your username to reset your password"}</p>
          <form className={styles.form} onSubmit={isSubmitted ? undefined : handleForgotSubmit}>
            {!isSubmitted ? (
              <div className={styles.inputContainer}>
                <i className={`${styles.inputIcon} fas fa-user`}></i>
                <input type="text" placeholder="Username" className={styles.inputField} />
              </div>
            ) : (
              <>
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
                  <button type="button" className={styles.cancelButton} onClick={() => setIsSubmitted(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.loginButton}>
                    Change Password
                  </button>
                </div>
              </>
            )}
            {!isSubmitted && (
              <button type="submit" className={styles.submitButton}>
                Submit
              </button>
            )}
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
