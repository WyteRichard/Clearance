import React from "react";
import '../styles/Login.css';
import rcLogo from '../assets/rc_logo.png';

const Login = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <img src={rcLogo} alt="RC LOGO"/>
                <h1>Sign In</h1>
                <div className="input-box">
                    <label htmlFor="userType">User Type</label>
                    <select className="filter-button" defaultValue="Filter Type" id="userType">
                        <option disabled>Filter Type</option>
                        <option>Employee</option>
                        <option>Student</option>
                    </select>
                </div>
                <div className="input-box">
                    <label>Username</label>
                    <input type="text" required/>
                </div>
                <div className="input-box">
                    <label>Password</label>
                    <input type="password" required/>
                </div>
                <div className="forgot-password">
                    <a href="#">Forgot Password</a>
                </div>
                <button type="submit">Sign In</button>
                <div className="create-account">
                    <a href="#">Don't have an account? Click here.</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
