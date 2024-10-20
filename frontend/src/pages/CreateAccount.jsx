import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import styles from "../styles/RegisterPage.module.css";
import rcBackground1 from '../assets/rc background 1.jpg';
import logo from '../assets/rc_logo.png';
import eyeclose from '../assets/eyeclose.png';
import eyeopen from '../assets/eyeopen.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [userType, setUserType] = useState("");
  const [officeRole, setOfficeRole] = useState("");
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    memberNumber: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const getPlaceholderText = () => {
    const type = userType === "Authorized Office" ? officeRole : userType;
    switch (type) {
      case "Adviser": return "Adviser Number";
      case "Cashier": return "Cashier Number";
      case "Clinic": return "Clinic Number";
      case "Cluster Coordinator": return "Cluster Coordinator Number";
      case "Dean": return "Dean Number";
      case "Guidance": return "Guidance Number";
      case "Laboratory": return "Laboratory Number";
      case "Library": return "Library Number";
      case "Registrar": return "Registrar Number";
      case "Spiritual Affairs": return "Spiritual Affairs Number";
      case "Student Affairs": return "Student Affairs Number";
      case "Student Discipline": return "Student Discipline Number";
      case "Supreme Student Council": return "Supreme Student Council Number";
      case "Student": return "Student Number";
      case "Admin": return "Admin Number";
      default: return "User Number";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
  
    const selectedRole = userType === "Authorized Office" ? officeRole : userType;
  
    if (formData.username === '' || !/^[a-zA-Z0-9]+$/.test(formData.username)) {
      setErrorMessage('Please enter a valid username (alphanumeric characters only).');
      setIsSubmitting(false);
      return;
    }
    if (formData.password === '') {
      setErrorMessage('Please enter a password.');
      setIsSubmitting(false);
      return;
    }
    if (formData.memberNumber === '') {
      setErrorMessage(`Please enter your ${getPlaceholderText().toLowerCase()}.`);
      setIsSubmitting(false);
      return;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const roleMap = {
        Adviser: "adviser",
        Cashier: "cashier",
        Clinic: "clinic",
        "Cluster Coordinator": "clusterCoordinator",
        Dean: "dean",
        Guidance: "guidance",
        Laboratory: "laboratory",
        Library: "library",
        Registrar: "registrar",
        "Spiritual Affairs": "spiritualAffairs",
        "Student Affairs": "studentAffairs",
        "Student Discipline": "studentDiscipline",
        "Supreme Student Council": "supremeStudentCouncil",
        Student: "student",
        Admin: "admin"
      };
  
      const roleField = roleMap[selectedRole];
      const payload = {
        username: formData.username,
        password: formData.password,
        [roleField]: {
          [`${roleField}Number`]: formData.memberNumber,
          email: formData.email
        }
      };
      
      const response = await Axios.post('http://localhost:8080/user/register', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 200) {
        navigate('/verify-otp');
      } else if (response.data) {
        setErrorMessage(response.data.message || 'An error occurred.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred while processing your request.');
    }
  
    setIsSubmitting(false);
  };
  

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${rcBackground1})` }}>
      <div className={styles.registerContainer}>
        <div className={styles.leftPanel}>
          <h2 className={styles.registerTitle}>REGISTER</h2>
          <p>Create your account for the Student Clearance System</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <select
                className={styles.selectField}
                id="userType"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="" disabled hidden>Select Role</option>
                <option value="Student">Student</option>
                <option value="Authorized Office">Authorized Office</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {userType === "Authorized Office" && (
              <div className={styles.inputContainer}>
                <select
                  className={styles.selectField}
                  id="officeRole"
                  value={officeRole}
                  onChange={(e) => setOfficeRole(e.target.value)}
                  required
                >
                  <option value="" disabled hidden>Select Office Role</option>
                  <option value="Adviser">Adviser</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Cluster Coordinator">Cluster Coordinator</option>
                  <option value="Dean">Dean</option>
                  <option value="Guidance">Guidance</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Library">Library</option>
                  <option value="Registrar">Registrar</option>
                  <option value="Spiritual Affairs">Spiritual Affairs</option>
                  <option value="Student Affairs">Student Affairs</option>
                  <option value="Student Discipline">Student Discipline</option>
                  <option value="Supreme Student Council">Supreme Student Council</option>
                </select>
              </div>
            )}

            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder="Username"
                className={styles.inputField}
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.passwordContainer}>
              <input
                type={passwordShown ? "text" : "password"}
                placeholder="Password"
                className={styles.inputField}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <img
                src={passwordShown ? eyeopen : eyeclose}
                alt="Toggle visibility"
                className={styles.eyeIcon}
                onClick={togglePasswordVisibility}
              />
            </div>

            <div className={styles.inputContainer}>
              <input
                type="text"
                placeholder={getPlaceholderText()}
                className={styles.inputField}
                name="memberNumber"
                value={formData.memberNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.inputContainer}>
              <input
                type="email"
                placeholder="Email Address"
                className={styles.inputField}
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={styles.registerButton} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Register'}
            </button>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          </form>

          <p className={styles.loginPrompt}>
            Already have an Account? <a href="/login">Click here</a>
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
