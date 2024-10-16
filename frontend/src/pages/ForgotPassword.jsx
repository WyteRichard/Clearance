import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "../styles/ForgotPassword.module.css";
import rcBackground1 from '../assets/rc background 1.jpg';
import user from '../assets/rc_logo.png';
import eyeclose from '../assets/eyeclose.png';
import eyeopen from '../assets/eyeopen.png';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOtpAndPassword, setShowOtpAndPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
      if (/[^a-zA-Z0-9]/.test(value)) {
        setErrors({ ...errors, username: 'Username must be alphanumeric.' });
      } else {
        setErrors({ ...errors, username: '' });
      }
    } else if (name === 'otp') {
      setOtp(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsButtonDisabled(true);

    if (!showOtpAndPassword) {
      if (!username || /[^a-zA-Z0-9]/.test(username)) {
        setErrors({ ...errors, username: 'Please enter a valid alphanumeric username.' });
        setIsButtonDisabled(false);
        return;
      }
      try {
        const response = await axios.post('http://localhost:8080/user/forgot-password', { username });
        if (response.status === 200) {
          setShowOtpAndPassword(true);
        } else {
          setErrors({ form: 'Failed to send OTP. Please try again.' });
        }
      } catch (error) {
        setErrors({ form: error.response?.data?.message || 'An error occurred.' });
      } finally {
        setIsButtonDisabled(false);
      }
    } else {
      if (!otp || !newPassword) {
        setErrors({ otp: !otp ? 'OTP is required' : '', newPassword: !newPassword ? 'Password is required' : '' });
        setIsButtonDisabled(false);
        return;
      }
      try {
        const response = await axios.post('http://localhost:8080/user/verify-forgot-password', { username, otp, password: newPassword });
        if (response.status === 200) {
          navigate('/Login');
        } else {
          setErrors({ form: 'Failed to reset password. Please try again.' });
        }
      } catch (error) {
        setErrors({ form: error.response?.data?.message || 'An error occurred.' });
      } finally {
        setIsButtonDisabled(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${rcBackground1})` }}>
      <div className={styles.loginContainer}>
        <div className={styles.leftPanel}>
          <h2 className={styles.loginTitle}>{showOtpAndPassword ? "Reset Password" : "Forgot Password"}</h2>
          <p>{showOtpAndPassword ? "Please enter the OTP and your new password" : "Please enter your username to receive an OTP"}</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            {errors.form && <p className={styles.errorMessage}>{errors.form}</p>}

            <div className={styles.inputContainer}>
              <i className={`${styles.inputIcon} fas fa-user`}></i>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={handleChange}
                className={styles.inputField}
                disabled={showOtpAndPassword || isButtonDisabled}
              />
              {errors.username && <p className={styles.errorMessage}>{errors.username}</p>}
            </div>

            {showOtpAndPassword && (
              <>
                <div className={styles.inputContainer}>
                  <i className={`${styles.inputIcon} fas fa-key`}></i>
                  <input
                    type="text"
                    name="otp"
                    placeholder="OTP"
                    value={otp}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                  {errors.otp && <p className={styles.errorMessage}>{errors.otp}</p>}
                </div>
                <div className={styles.passwordContainer}>
                  <i className={`${styles.inputIcon} fas fa-lock`}></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={handleChange}
                    className={styles.inputField}
                  />
                  <img
                    src={showPassword ? eyeopen : eyeclose}
                    alt="Toggle visibility"
                    className={styles.eyeIcon}
                    onClick={togglePasswordVisibility}
                  />
                  {errors.newPassword && <p className={styles.errorMessage}>{errors.newPassword}</p>}
                </div>
              </>
            )}

            <div className={styles.buttonContainer}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isButtonDisabled}
              >
                {showOtpAndPassword ? 'Change Password' : 'Submit'}
              </button>
              {showOtpAndPassword && (
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowOtpAndPassword(false)}
                >
                  Cancel
                </button>
              )}
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
