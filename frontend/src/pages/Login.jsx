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
                const tokenDecoded = jwtDecode(token);
                const authorities = tokenDecoded.authorities || [];

                console.log("Token Decoded:", tokenDecoded);
                console.log("Authorities:", authorities);

                if (token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('exp', tokenDecoded.exp);
                    localStorage.setItem('userId', response.data.userId);

                    if (authorities.includes("ROLE_ROLE_STUDENT")) {
                        localStorage.setItem('role', "ROLE_ROLE_STUDENT");
                        navigate('/student-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_ADVISER")) {
                        localStorage.setItem('role', "ROLE_ROLE_ADVISER");
                        navigate('/adviser-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_CASHIER")) {
                        localStorage.setItem('role', "ROLE_ROLE_CASHIER");
                        navigate('/cashier-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_CLINIC")) {
                        localStorage.setItem('role', "ROLE_ROLE_CLINIC");
                        navigate('/clinic-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_COORDINATOR")) {
                        localStorage.setItem('role', "ROLE_ROLE_COORDINATOR");
                        navigate('/cluster-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_DEAN")) {
                        localStorage.setItem('role', "ROLE_ROLE_DEAN");
                        navigate('/dean-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_GUIDANCE")) {
                        localStorage.setItem('role', "ROLE_ROLE_GUIDANCE");
                        navigate('/guidance-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_LABORATORY")) {
                        localStorage.setItem('role', "ROLE_ROLE_LABORATORY");
                        navigate('/laboratory-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_LIBRARY")) {
                        localStorage.setItem('role', "ROLE_ROLE_LIBRARY");
                        navigate('/library-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_REGISTRAR")) {
                        localStorage.setItem('role', "ROLE_ROLE_REGISTRAR");
                        navigate('/registrar-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_SPIRITUAL")) {
                        localStorage.setItem('role', "ROLE_ROLE_SPIRITUAL");
                        navigate('/spiritual-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_AFFAIRS")) {
                        localStorage.setItem('role', "ROLE_ROLE_AFFAIRS");
                        navigate('/student-affairs-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_DISCIPLINE")) {
                        localStorage.setItem('role', "ROLE_ROLE_DISCIPLINE");
                        navigate('/discipline-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_COUNCIL")) {
                        localStorage.setItem('role', "ROLE_ROLE_COUNCIL");
                        navigate('/student-council-dashboard');
                    } else if (authorities.includes("ROLE_ROLE_ADMIN")) {
                        localStorage.setItem('role', "ROLE_ROLE_ADMIN");
                        navigate('/admin-dashboard');
                    } else {
                        setErrorMessage("Unauthorized role");
                        navigate('/login');
                    }
                }
            } else {
                console.error('Login failed:', response.statusText);
                alert('Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('Error:', error.message);
            if (error.response && error.response.data && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('An error occurred while processing your request.');
            }
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
