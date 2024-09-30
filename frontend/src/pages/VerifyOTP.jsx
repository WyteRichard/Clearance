import React, { useState } from 'react';
import styles from '../styles/VerifyOTP.module.css';
import backgroundImage from '../assets/rc background 1.jpg';
import logo from '../assets/rc_logo.png';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');

  const handleVerify = () => {
    alert('Verification in progress...');
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={styles.verifyContainer}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Verify OTP</h2>
          <p>Please enter your username and OTP to proceed.</p>
          <form className={styles.form}>
            <div className={styles.inputContainer}>
              <i className={`${styles.inputIcon} fas fa-user`}></i>
              <input 
                type="text" 
                placeholder="Username" 
                className={styles.inputField} 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
            <div className={styles.inputContainer}>
              <i className={`${styles.inputIcon} fas fa-key`}></i>
              <input 
                type="text" 
                placeholder="OTP" 
                className={styles.inputField} 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
              />
            </div>
            <div className={styles.buttonContainer}>
              <button type="button" className={styles.verifyButton} onClick={handleVerify}>
                Verify
              </button>
            </div>
          </form>
        </div>
        <div className={styles.infoPanel}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <h2 className={styles.systemTitle}>Student Clearance System</h2>
          <p>Manage your academic clearance with ease</p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
