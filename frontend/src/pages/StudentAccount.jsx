import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StudentAccount.module.css';
import dashIcon from '../assets/home.png';
import requestIcon from '../assets/notes.png';
import statusIcon from '../assets/idcard.png';
import accountIcon from '../assets/buser.png';
import avatar from '../assets/avatar2.png';

const StudentAccount = () => {
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const studentNumber = localStorage.getItem('userId');
  const navigate = useNavigate();

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  if (!student) return <div>Loading...</div>;

  return (
    <div className={`${styles.flexContainer} ${styles.studentAccountContainer}`}>
      <div className={styles.sidebar}>
        <nav className={styles.nav}>
          <button className={styles.ghostButton} onClick={() => navigate('/student-dashboard')}>
            <img src={dashIcon} alt="Dashboard" className={styles.navIcon} />
            Dashboard
          </button>
          <button className={styles.ghostButton} onClick={() => navigate('/request-clearance')}>
            <img src={requestIcon} alt="Request Icon" className={styles.navIcon} />
            Clearance Request
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
        </div>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.studentInfo}>
              <div className={styles.profilePic}>
                <img
                  src={avatar}
                  alt="Profile"
                  className={styles.profileImage}
                  style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                />
              </div>
              <div className={styles.studentDetails}>
                <h2>{student.firstName} {student.middleName} {student.lastName}</h2>
                <p>Student ID: {student.studentNumber}</p>
                <p>Year Level: {student.yearLevel?.yearLevel}</p>
                <p>Course: {student.course?.courseName}</p>
              </div>
            </div>
          </div>

          <div className={styles.generalInfo}>
            <h3>General Information</h3>
            <br></br>
            <div className={styles.generalInfoContent}>
              <div className={styles.generalInfoLabel}>Contact Number:</div>
              {isEditing ? (
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber || ''}
                  onChange={handleChange}
                />
              ) : (
                <div className={styles.generalInfoValue}>{student.contactNumber}</div>
              )}
            </div>
            <div className={styles.generalInfoContent}>
              <div className={styles.generalInfoLabel}>Email Address:</div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                />
              ) : (
                <div className={styles.generalInfoValue}>{student.email}</div>
              )}
            </div>
            <div className={styles.generalInfoContent}>
              <div className={styles.generalInfoLabel}>Address:</div>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''} 
                  onChange={handleChange}
                />
              ) : (
                <div className={styles.generalInfoValue}>{student.address}</div>
              )}
            </div>
            <div className={styles.generalInfoContent}>
              <div className={styles.generalInfoLabel}>Religion:</div>
              {isEditing ? (
                <input
                  type="text"
                  name="religion"
                  value={formData.religion || ''}
                  onChange={handleChange}
                />
              ) : (
                <div className={styles.generalInfoValue}>{student.religion}</div>
              )}
            </div>
            <div className={styles.generalInfoContent}>
              <div className={styles.generalInfoLabel}>Birthday:</div>
              {isEditing ? (
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate ? new Date(formData.birthdate).toISOString().split('T')[0] : ''}
                  onChange={handleChange}
                />
              ) : (
                <div className={styles.generalInfoValue}>
                  {student.birthdate ? new Date(student.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </div>
              )}
            </div>
            <div className={styles.generalInfoContent}>
              <div className={styles.generalInfoLabel}>Birthplace:</div>
              {isEditing ? (
                <input
                  type="text"
                  name="birthplace"
                  value={formData.birthplace || ''}
                  onChange={handleChange}
                />
              ) : (
                <div className={styles.generalInfoValue}>{student.birthplace}</div>
              )}
            </div>
            <div className={styles.generalInfoContent}>
              <div className={styles.generalInfoLabel}>Citizenship:</div>
              {isEditing ? (
                <input
                  type="text"
                  name="citizenship"
                  value={formData.citizenship || ''}
                  onChange={handleChange}
                />
              ) : (
                <div className={styles.generalInfoValue}>{student.citizenship}</div>
              )}
            </div>
            <div className={styles.generalInfoContent}>
              <div className={styles.generalInfoLabel}>Civil Status:</div>
              {isEditing ? (
                <input
                  type="text"
                  name="civilStatus"
                  value={formData.civilStatus || ''}
                  onChange={handleChange}
                />
              ) : (
                <div className={styles.generalInfoValue}>{student.civilStatus}</div>
              )}
            </div>
            <div className={styles.generalInfoContent}>
              <div className={styles.generalInfoLabel}>Sex:</div>
              {isEditing ? (
                <select name="sex" value={formData.sex || ''} onChange={handleChange}>
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className={styles.generalInfoValue}>{student.sex}</div>
              )}
            </div>
          </div>

          <div className={styles.buttonContainer}>
            {isEditing ? (
              <>
                <button className={styles.saveButton} onClick={handleSave}>Save</button>
                <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
              </>
            ) : (
              <button className={styles.editButton} onClick={handleEdit}>Edit</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAccount;
