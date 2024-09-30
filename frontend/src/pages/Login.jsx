import React, { useState } from 'react';
import styles from "../styles/Login.module.css";
import rcBackground1 from '../assets/rc background 1.jpg';
import user from '../assets/rc_logo.png';
import eyeclose from '../assets/eyeclose.png';
import eyeopen from '../assets/eyeopen.png';

const Login = () => {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${rcBackground1})` }}>
      <div className={styles.loginContainer}>
        <div className={styles.leftPanel}>
          <h2 className={styles.loginTitle}>LOGIN</h2>
          <p>Access your Student Clearance System</p>

          {/* Input Field with Icon for Username */}
          <form className={styles.form}>
            <div className={styles.inputContainer}>
              <i className={`${styles.inputIcon} fas fa-user`}></i> {/* Username icon */}
              <input type="text" placeholder="Username" className={styles.inputField} />
            </div>

            {/* Input Field with Eye Icon for Password */}
            <div className={styles.passwordContainer}>
              <i className={`${styles.inputIcon} fas fa-lock`}></i> {/* Password icon */}
              <input
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
                className={styles.inputField}
              />
              <img
                src={passwordShown ? eyeopen : eyeclose}
                alt="Toggle visibility"
                className={styles.eyeIcon}
                onClick={togglePasswordVisibility}
              />
            </div>

            <div className={styles.forgotPassword}>
              <a href="/forgot-password">Forgot Password?</a>
            </div>
            <button type="submit" className={styles.loginButton}>Login</button>
          </form>

          <p className={styles.signupPrompt}>
            Don't have an Account? <a href="/create-account">Click here</a>
          </p>
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

export default Login;
