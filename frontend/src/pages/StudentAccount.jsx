import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import rcLogo from '../assets/rc_logo.png';
import dashIcon from '../assets/home.png';
import requestIcon from '../assets/notes.png';
import statusIcon from '../assets/idcard.png';
import accountIcon from '../assets/buser.png';
import avatar from '../assets/avatar.png';
import contact from '../assets/phone.png';
import yearLevel from '../assets/year.png';
import mail from '../assets/mail.png';
import course from '../assets/course.png';
import styles from '../styles/StudentAccount.module.css';

const StudentAccount = () => {
    const [student, setStudent] = useState(null);
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const modalRef = useRef(null);
    const navigate = useNavigate();
    const studentId = 1; // Replace with the actual student ID you want to fetch

    

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/Student/students/${studentId}`);
                setStudent(response.data);
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        };

        fetchStudent();
    }, [studentId]);

    useEffect(() => {
      const handleClickOutside = (event) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
              setShowModal(false);
          }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, []);

    const toggleModal = () => setShowModal(!showModal);
    const handleLogout = () => {
        // Implement logout logic here
        console.log("Logged out");
    };
    const handleProfile = () => {
        // Navigate to profile view or perform other actions
        console.log("View Profile");
    };

    if (!student) {
        return <div>Loading...</div>; // Show loading state while fetching data
    }

    return (
      <div className={styles.flexContainer}>
        <div className={styles.sidebar}>
          <div className={styles.logoContainer}>
            <img src={rcLogo} alt="RC LOGO" className={styles.logo} />
            <h1 className={styles.collegeName}>Rogationist College</h1>
          </div>
          <nav className={styles.nav}>
            <button className={styles.ghostButton} onClick={() => navigate('/student-dashboard')}>
              <img src={dashIcon} alt="Dashboard" className={styles.navIcon} />
              Dashboard
            </button>
            <button className={styles.ghostButton} onClick={() => navigate('/request-clearance')}>
              <img src={requestIcon} alt="Clearance Request" className={styles.navIcon} />
              Clearance Request
            </button>
            <button className={styles.ghostButton} onClick={() => navigate('/student-clearance-status')}>
              <img src={statusIcon} alt="Status Icon" className={styles.navIcon} />
              Clearance Status
            </button>
            <button className={styles.whiteButton} onClick={() => navigate('/student-account')}>
              <img src={accountIcon} alt="Account Icon" className={styles.navIcon} />
              Account
            </button>
          </nav>
        </div>
  
        <div className={styles.mainContent}>
            
                <div className={styles.header}>
                    <h2 className={styles.dashboardTitle}>My Information</h2>
                    <div className={styles.headerRight}>
                        <span className={styles.academicYear}>A.Y. 2024 - 2025</span>
                        <span className={styles.semesterBadge}>First Semester</span>
                        <div className={styles.avatar} onClick={toggleModal}>AN</div>
                        {showModal && (
                            <div className={styles.modal} ref={modalRef}>
                                <ul>
                                    <li onClick={handleProfile}>See Profile</li>
                                    <li onClick={handleLogout}>Log Out</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

          <div className={styles.header}>
          </div>
          <div className={styles.infoCard}>
            <img src={avatar} alt="Profile" className={styles.profilePic} />
            <div className={styles.info}>
              <h3>{student.firstName} {student.middleName} {student.lastName}</h3>
              <p className={styles.studentNumber}>{student.studentNumber}</p>
              <div className={styles.detailRowSpace}></div>

              <div className={styles.detailRow}>
                <div className={styles.detail}>
                  <img src={contact} alt="Contact" className={styles.smallIcon}/>
                  <div>
                    <strong>Contact Number</strong>
                    <div className={styles.grayText}>{student.contactNumber}</div>
                  </div>
                </div>
                <div className={styles.detail}>
                  <img src={yearLevel} alt="Year Level" className={styles.smallIcon}/>
                  <div>
                    <strong>Year Level</strong>
                    <div className={styles.grayText}>{student.yearLevel.yearLevel}</div>
                  </div>
                </div>
              </div>

              <div className={styles.RowSpace}></div>

              <div className={styles.detailRow}>
                <div className={styles.detail}>
                  <img src={mail} alt="Email" className={styles.smallIcon}/>
                  <div>
                    <strong>Email Address</strong>
                    <div className={styles.grayText}>{student.email}</div>
                  </div>
                </div>
                <div className={styles.detail}>
                  <img src={course} alt="Course" className={styles.smallIcon}/>
                  <div>
                    <strong>Course</strong>
                    <div className={styles.grayText}>{student.course?.courseName}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.buttons}>
            <div></div>
            <button className={styles.button}>Edit Information</button>
          </div>
        </div>
      </div>
    );
};

export default StudentAccount;
