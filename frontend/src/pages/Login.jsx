import React, { useState } from 'react';
import styles from "../styles/Login.module.css";
import rcBackground1 from '../assets/rc background 1.jpg';
import user from '../assets/rc_logo.png';
import eyeclose from '../assets/eyeclose.png';
import eyeopen from '../assets/eyeopen.png';

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const [passwordShown, setPasswordShown] = useState(false);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      setErrorMessage('');
    
      const userData = { username, password };
    
      try {
        const response = await axios.post('http://localhost:8080/user/login', userData);
        if (response.status === 200) {
          const token = response.headers['jwt-token'];
          const decodedToken = jwtDecode(token);
          const authorities = decodedToken.authorities;
    
          if (token) {
            localStorage.setItem('token', token);
            localStorage.setItem('exp', decodedToken.exp);
    
            const roleMap = {
              "ROLE_STUDENT": "/student-dashboard",
              "ROLE_ADVISER": "/adviser-dashboard",
              "ROLE_CASHIER": "/cashier-dashboard",
              "ROlE_CLINIC": "/clinic-dashboard",
              "ROLE_CLUSTER_COORDINATOR": "/cluster-dashboard",
              "ROLE_DEAN": "/dean-dashboard",
              "ROLE_GUIDANCE": "/guidance-dashboard",
              "ROLE_LABORATORY": "/laboratory-dashboard",
              "ROLE_LIBRARY": "/library-dashboard",
              "ROLE_REGISTRAR": "/registrar-dashboard",
              "ROLE_SPIRITUAL_AFFAIRS": "/spiritual-dashboard",
              "ROLE_STUDENT_AFFAIRS": "/student-affairs-dashboard",
              "ROLE_STUDENT_DISCIPLINE": "/discipline-dashboard",
              "ROLE_STUDENT_COUNCIL": "/discipline-dashboard",
              "ROLE_ADMIN": "/student-council-dashboard"
            };
    
            const role = authorities.find(auth => roleMap[auth]);
            if (role) {
              localStorage.setItem('role', role);
              localStorage.setItem('userId', response.data.userId);
              navigate(roleMap[role]);
            } else {
              setErrorMessage('Unauthorized role.');
              navigate('/login');
            }
          }
        }
      } catch (error) {
        console.error('Login failed:', error.message);
        setErrorMessage(error.response?.data?.message || 'An error occurred during login.');
      }
    };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${rcBackground1})` }}>
      <div className={styles.loginContainer}>
        <div className={styles.leftPanel}>
          <h2 className={styles.loginTitle}>LOGIN</h2>
          <p>Access your Student Clearance System</p>

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputContainer}>
              <i className={`${styles.inputIcon} fas fa-user`}></i>
              <input
                type="text"
                placeholder="Username"
                className={styles.inputField}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles.passwordContainer}>
              <i className={`${styles.inputIcon} fas fa-lock`}></i>
              <input
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={passwordShown ? eyeopen : eyeclose}
                alt="Toggle visibility"
                className={styles.eyeIcon}
                onClick={togglePasswordVisibility}
              />
            </div>

            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

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
