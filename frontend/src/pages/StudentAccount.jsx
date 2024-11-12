import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StudentAccount.module.css';
import dashIcon from '../assets/home.png';
import statusIcon from '../assets/idcard.png';
import accountIcon from '../assets/buser.png';
import keyIcon from '../assets/key.png';
import editIcon from '../assets/editp.png';
import logout from '../assets/logout.png';
import eyeclose from '../assets/eyeclose.png';
import eyeopen from '../assets/eyeopen.png';

const StudentAccount = () => {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyNewPassword, setVerifyNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const studentNumber = localStorage.getItem('userId');
  const navigate = useNavigate();

  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleVerifyPasswordVisibility = () => setShowVerifyPassword(!showVerifyPassword);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const exp = localStorage.getItem('exp');
    const currentTime = new Date().getTime();

    if (!role || !exp || exp * 1000 < currentTime) {
      handleLogout();
    } else if (role !== "ROLE_ROLE_STUDENT") {
    } else {
      fetchStudent();
    }
  }, []);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/Student/students/${studentNumber}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setStudent(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('exp');
    navigate('/login');
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setFormData(student);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'birthdate') {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(currentDate.getFullYear() - 10);
  
      if (selectedDate > currentDate) {
        alert("Birthdate cannot be in the future.");
        return;
      } else if (selectedDate > tenYearsAgo) {
        alert("You are too young.");
        return;
      }
    }

    if (name === 'username') {
      setUsername(value);
    } else if (name === 'otp') {
      setOtp(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'verifyNewPassword') {
      setVerifyNewPassword(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const openUsernameModal = () => setIsUsernameModalOpen(true);
  const closeUsernameModal = () => setIsUsernameModalOpen(false);

  const openOTPModal = () => {
    closeUsernameModal();
    setIsOTPModalOpen(true);
  };
  const closeOTPModal = () => setIsOTPModalOpen(false);

  const handleVerifyUsername = async () => {
    setSubmitting(true); // Set submitting to true when starting verification
    try {
      const response = await axios.post('http://localhost:8080/user/forgot-password', { username });
      if (response.status === 200) {
        openOTPModal();
      } else {
        alert('Username not found. Please try again.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      alert('An error occurred. Please try again later.');
    } finally {
      setSubmitting(false); // Reset submitting to false after completion
    }
  };

  const handleVerifyOTP = async () => {
    if (newPassword !== verifyNewPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/user/verify-forgot-password', {
        username,
        otp,
        password: newPassword,
      });
      if (response.status === 200) {
        closeOTPModal();
        alert('Password changed successfully.');
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('Error verifying OTP');
    }
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("contactNumber", formData.contactNumber);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("address", formData.address || student.address);
    formDataToSend.append("religion", formData.religion || student.religion);
    formDataToSend.append("birthdate", formData.birthdate ? new Date(formData.birthdate).toISOString().split('T')[0] : student.birthdate);
    formDataToSend.append("birthplace", formData.birthplace || student.birthplace);
    formDataToSend.append("citizenship", formData.citizenship || student.citizenship);
    formDataToSend.append("civilStatus", formData.civilStatus || student.civilStatus);
    formDataToSend.append("sex", formData.sex || student.sex);
  
    try {
      const response = await axios.put(`http://localhost:8080/Student/student/${studentNumber}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setIsEditing(false);
      setStudent(response.data);
    } catch (error) {
      alert(`Update failed: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  if (!student) return <div>Loading...</div>;

  return (
    <div className={`${styles.flexContainer} ${styles.studentAccountContainer}`}>
      <div className={styles.sidebar}>
        <nav className={styles.nav}>
          <button className={styles.ghostButton} onClick={() => navigate('/student-dashboard')}>
            <img src={dashIcon} alt="Dashboard" className={styles.navIcon} />
            Dashboard
          </button>
          <button className={styles.ghostButton} onClick={() => navigate('/student-clearance-status')}>
            <img src={statusIcon} alt="Clearance Status" className={styles.navIcon} />
            Clearance Status
          </button>
          <button className={styles.whiteButton} onClick={() => navigate('/student-account')}>
            <img src={accountIcon} alt="Account" className={styles.navIcon} />
            Account
          </button>
        </nav>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h2 className={styles.dashboardTitle}>Student Account</h2>
          <div className={styles.headerButtons}>
            <button className={styles.changePasswordButton} onClick={openUsernameModal}>
              <img src={keyIcon} alt="Change Password" className={styles.icon} />
              Change Password
            </button>

            {isUsernameModalOpen && (
              <div className={styles.modalBackdrop}>
                <div className={styles.modal}>
                  <h2>Enter Username</h2>
                  <input
                    type="text"
                    className={styles.userInput}
                    value={username}
                    onChange={handleChange}
                    name="username"
                    placeholder="Enter your username"
                  />
                  {submitting && <p className={styles.submittingText}>Submitting...</p>}
                  <div className={styles.modalActions}>
                    <button className={styles.cancelButton} onClick={closeUsernameModal}>Cancel</button>
                    <button className={styles.confirmButton} onClick={handleVerifyUsername}>Confirm</button>
                  </div>
                </div>
              </div>
            )}

            {isOTPModalOpen && (
              <div className={styles.modalBackdrop}>
                <div className={styles.modal}>
                  <h2>Enter OTP</h2>
                  <div className={styles.inputContainer}>
                    <input
                      type="text"
                      className={styles.modalInput}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                  </div>
                  <div className={styles.inputContainer}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className={styles.modalInput}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    name="newPassword"
                    placeholder="New Password"
                  />
                  <button type="button" onClick={toggleNewPasswordVisibility} className={styles.eyeToggleButton}>
                    <img src={showNewPassword ? eyeopen : eyeclose} alt="Toggle visibility" className={styles.eyeIcon} />
                  </button>
                </div>
                
                <div className={styles.inputContainer}>
                  <input
                    type={showVerifyPassword ? 'text' : 'password'}
                    className={styles.modalInput}
                    value={verifyNewPassword}
                    onChange={(e) => setVerifyNewPassword(e.target.value)}
                    name="verifyNewPassword"
                    placeholder="Verify New Password"
                  />
                  <button type="button" onClick={toggleVerifyPasswordVisibility} className={styles.eyeToggleButton}>
                    <img src={showVerifyPassword ? eyeopen : eyeclose} alt="Toggle visibility" className={styles.eyeIcon} />
                  </button>
                </div>
                  <div className={styles.modalActions}>
                    <button className={styles.cancelButton} onClick={closeOTPModal}>Cancel</button>
                    <button className={styles.confirmButton} onClick={handleVerifyOTP}>Confirm</button>
                  </div>
                </div>
              </div>
            )}

            {isEditing ? (
              <>
                <button className={styles.saveButton} onClick={handleSave}>Save</button>
                <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <button className={styles.editProfileButton} onClick={handleEdit}>
                <img src={editIcon} alt="Edit Profile" className={styles.icon} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className={styles.cardContainer}>
        <div className={styles.infoCard}>
          <h3>Student Information</h3>
          <p><strong>Student ID:</strong> <span>{student.studentNumber}</span></p>
          <p><strong>Name:</strong> <span>{student.firstName} {student.middleName} {student.lastName}</span></p>
          <p><strong>Year Level:</strong> <span>{student.yearLevel?.yearLevel || 'N/A'}</span></p>
          <p><strong>Course:</strong> <span>{student.course?.courseName || 'N/A'}</span></p>
        </div>

        <div className={styles.infoCard}>
          <h3>Contact Information</h3>
          <p>
            <strong>Contact Number: </strong>
            <span>
              {isEditing ? (
                <div className={styles.fullWidth}>
                  <input 
                    type="text" 
                    name="contactNumber" 
                    style={{ width: "100%" }} 
                    value={formData.contactNumber || ''} 
                    onChange={handleChange} 
                  />
                </div>
              ) : (
                student.contactNumber
              )}
            </span>
          </p>
          <p>
            <strong>Email Address: </strong>
            <span>
              {isEditing ? (
                <div className={styles.fullWidth}>
                  <input 
                    type="email" 
                    name="email" 
                    style={{ width: "100%" }} 
                    value={formData.email || ''} 
                    onChange={handleChange} 
                  />
                </div>
              ) : (
                student.email
              )}
            </span>
          </p>
          <p>
            <strong>Address:</strong>
            <span>
              {isEditing ? (
                <div className={styles.fullWidth}>
                  <input 
                    type="text" 
                    name="address" 
                    style={{ width: "100%" }} 
                    value={formData.address || ''} 
                    onChange={handleChange} 
                  />
                </div>
              ) : (
                student.address
              )}
            </span>
          </p>
        </div>

        <div className={styles.infoCard}>
          <h3>Personal Information</h3>
          <p><strong>Religion: </strong>
            <span>
              {isEditing ? (
                <input 
                  type="text" 
                  name="religion" 
                  className={`${styles.input} ${styles.editingInput}`} 
                  value={formData.religion || ''} 
                  onChange={handleChange} 
                />
              ) : (
                student.religion
              )}
            </span>
          </p>
          <p><strong>Birthday: </strong>
            <span>
              {isEditing ? (
                <input
                  type="date"
                  name="birthdate"
                  className={`${styles.input} ${styles.editingInput}`}
                  value={formData.birthdate ? new Date(formData.birthdate).toISOString().split('T')[0] : ''}
                  max={new Date().toISOString().split('T')[0]} // Today's date as the maximum
                  onChange={handleChange}
                />
              ) : (
                formatDate(student.birthdate)
              )}
            </span>
          </p>
          <p><strong>Birthplace: </strong>
            <span>
              {isEditing ? (
                <input 
                  type="text" 
                  name="birthplace" 
                  className={`${styles.input} ${styles.editingInput}`} 
                  value={formData.birthplace || ''} 
                  onChange={handleChange} 
                />
              ) : (
                student.birthplace
              )}
            </span>
          </p>
          <p><strong>Citizenship: </strong>
            <span>
              {isEditing ? (
                <input 
                  type="text" 
                  name="citizenship" 
                  className={`${styles.input} ${styles.editingInput}`} 
                  value={formData.citizenship || ''} 
                  onChange={handleChange} 
                />
              ) : (
                student.citizenship
              )}
            </span>
          </p>
          <p><strong>Civil Status: </strong>
            <span>
              {isEditing ? (
                <input 
                  type="text" 
                  name="civilStatus" 
                  className={`${styles.input} ${styles.editingInput}`} 
                  value={formData.civilStatus || ''} 
                  onChange={handleChange} 
                />
              ) : (
                student.civilStatus
              )}
            </span>
          </p>
          <p><strong>Sex: </strong>
            <span>
              {isEditing ? (
                <select 
                  name="sex" 
                  className={`${styles.input} ${styles.editingInput}`} 
                  value={formData.sex || ''} 
                  onChange={handleChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                student.sex
              )}
            </span>
          </p>
        </div>
      </div>
      <div className={styles.logoutButtonContainer}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <img src={logout} alt="Logout" className={styles.logoutIcon} />
          Logout
        </button>
      </div>
    </div>
  </div>
  );
};

export default StudentAccount;
