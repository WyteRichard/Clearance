import React, { useState } from 'react';
import styles from "../styles/RegisterPage.module.css";
import rcBackground1 from '../assets/rc background 1.jpg'; // Background image
import logo from '../assets/rc_logo.png'; // Logo
import eyeclose from '../assets/eyeclose.png'; // Eye closed icon
import eyeopen from '../assets/eyeopen.png'; // Eye open icon

const RegisterPage = () => {
  const [passwordShown, setPasswordShown] = useState(false);
  const [userType, setUserType] = useState(""); // State for user type
  const [employeeRole, setEmployeeRole] = useState(""); // State for employee role

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
    if (event.target.value !== 'employee') {
      setEmployeeRole(""); // Reset employee role if not employee
    }
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${rcBackground1})` }}>
      <div className={styles.registerContainer}>
        <div className={styles.leftPanel}>
          <h2 className={styles.registerTitle}>REGISTER</h2>
          <p>Create your account for the Student Clearance System</p>

          <form className={styles.form}>
            {/* User Type */}
            <div className={styles.inputContainer}>
              <select className={styles.selectField} id="userType" value={userType} onChange={handleUserTypeChange}>
                <option value="" disabled hidden>User Type</option>
                <option value="student">Student</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Additional dropdown for Employee Role */}
            {userType === 'employee' && (
              <div className={styles.inputContainer}>
                <select className={styles.selectField} id="employeeRole" value={employeeRole} onChange={(e) => setEmployeeRole(e.target.value)}>
                  <option value="" disabled hidden>Select Department</option>
                  <option value="manager">Adviser</option>
                  <option value="staff">Cashier</option>
                  <option value="intern">Clinic</option>
                  <option value="intern">Cluster Coordinator</option>
                  <option value="intern">Dean</option>
                  <option value="intern">Guidance</option>
                  <option value="intern">Laboratory</option>
                  <option value="intern">Library</option>
                  <option value="intern">Registrar</option>
                  <option value="intern">Spiritual Affairs</option>
                  <option value="intern">Student Affairs</option>
                  <option value="intern">Student Discipline</option>
                  <option value="intern">Supreme Student Council</option>
                </select>
              </div>
            )}

            {/* Username */}
            <div className={styles.inputContainer}>
              <input type="text" placeholder="Username" className={styles.inputField} />
            </div>

            {/* Password */}
            <div className={styles.passwordContainer}>
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

            {/* Student Number */}
            <div className={styles.inputContainer}>
              <input type="text" placeholder="Student Number" className={styles.inputField} />
            </div>

            {/* Email Address */}
            <div className={styles.inputContainer}>
              <input type="email" placeholder="Email Address" className={styles.inputField} />
            </div>

            <button type="submit" className={styles.registerButton}>Register</button>
          </form>

          {/* Add the "Already have an Account?" text here */}
          <p className={styles.loginPrompt}>
            Already have an Account? <a href="http://localhost:3000/">Click here</a>
          </p>
        </div>

        <div className={styles.rightPanel}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <h2 className={styles.systemTitle}>Student Clearance System</h2>
          <p>Manage your academic clearance with ease</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
