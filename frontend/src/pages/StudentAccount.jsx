import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StudentAccount.module.css';
import dashIcon from '../assets/home.png';
import requestIcon from '../assets/notes.png';
import statusIcon from '../assets/idcard.png';
import accountIcon from '../assets/buser.png';

const StudentAccount = () => {
  const [student, setStudent] = useState(null); // State for storing student data
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({}); // State for holding form data
  const [profileImage, setProfileImage] = useState(null); // State to hold the profile image file
  const [profileImagePreview, setProfileImagePreview] = useState(null); // For image preview
  const studentId = 1; // Replace this with the actual student ID to fetch
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Fetch student data from the API
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/Student/students/${studentId}`);
        console.log("Fetched student data:", response.data);
        setStudent(response.data);
        setFormData(response.data); // Populate form data with fetched student data
        if (response.data.profileImage) {
          // If profile image is a relative path, you might need to prepend the base URL
          const imageURL = `http://localhost:8080/${response.data.profileImage}`;
          setProfileImagePreview(imageURL); // Load existing profile image
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };
    fetchStudent();
  }, [studentId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(student); // Reset to the original data if cancelled
    setProfileImage(null); // Clear any uploaded images on cancel
    setProfileImagePreview(student.profileImage); // Reset image preview to original
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file)); // Create a preview URL for the selected image
  };

  const handleSave = async () => {
    const formDataToSend = new FormData(); // Use FormData for file upload
  
    // Append form fields
    formDataToSend.append("contactNumber", formData.contactNumber);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("address", formData.address ? formData.address : student.address);
    formDataToSend.append("religion", formData.religion ? formData.religion : student.religion);
    formDataToSend.append("birthdate", formData.birthdate ? new Date(formData.birthdate).toISOString().split('T')[0] : student.birthdate);
    formDataToSend.append("birthplace", formData.birthplace ? formData.birthplace : student.birthplace);
    formDataToSend.append("citizenship", formData.citizenship ? formData.citizenship : student.citizenship);
    formDataToSend.append("civilStatus", formData.civilStatus ? formData.civilStatus : student.civilStatus);
    formDataToSend.append("sex", formData.sex ? formData.sex : student.sex);

    // Append the profile image if it's selected
    if (profileImage) {
      formDataToSend.append("profileImage", profileImage);
    }
  
    try {
      const response = await axios.put(`http://localhost:8080/Student/student/${studentId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log("Server response:", response.data);
      setIsEditing(false); // Exit edit mode
      setStudent(response.data); // Update the student state with the new values
      // If profile image is a relative path, you might need to prepend the base URL
      const imageURL = `http://localhost:8080/${response.data.profileImage}`;
      setProfileImagePreview(imageURL); // Update the image preview after saving
    } catch (error) {
      if (error.response) {
        console.error("Server responded with error:", error.response.data);
        alert(`Update failed: ${error.response.data.message || 'Unknown error'}`);
      } else {
        console.error("Request error:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (!student) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

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

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.dashboardTitle}>Student Account</h2>
        </div>

        {/* Student Information Card */}
        <div className={styles.cardGrid}>
          {/* Student Details Card */}
          <div className={styles.card}>
            <div className={styles.studentInfo}>
              <div className={styles.profilePic}>
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Profile" className={styles.profileImage} />
                ) : (
                  <div className={styles.placeholder}>+</div>
                )}
              </div>
              <div className={styles.studentDetails}>
                <h2>{student.firstName} {student.middleName} {student.lastName}</h2>
                <p>Student ID: {student.studentNumber}</p>
                <p>Year Level: {student.yearLevel?.yearLevel}</p>
                <p>Course: {student.course?.courseName}</p>
              </div>
            </div>
            {isEditing && (
              <div className={styles.generalInfoContent}>
                <div className={styles.generalInfoLabel}>Change Profile Image:</div>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            )}
          </div>

          {/* General Info Card */}
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
