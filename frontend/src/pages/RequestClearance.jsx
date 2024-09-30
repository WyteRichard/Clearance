import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/RequestClearance.module.css";
import { useNavigate } from 'react-router-dom';
import rcLogo from '../assets/rc_logo.png';
import dashIcon from '../assets/home.png';
import requestIcon from '../assets/bnotes.png';
import statusIcon from '../assets/idcard.png';
import accountIcon from '../assets/user.png';

const RequestClearance = () => {
    const [semester, setSemester] = useState("FIRST");
    const [schoolYear] = useState("2024 - 2025");
    const [graduating, setGraduating] = useState(false);
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const navigate = useNavigate();

    const handleSemesterChange = (e) => {
        setSemester(e.target.value);
    };

    const handleGraduatingChange = (e) => {
        setGraduating(e.target.value === "Yes");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const clearanceRequest = {
            student: {
                id: 1 // Replace with the actual student ID
            },
            department: {
                id: 1 // Replace with the actual department ID
            },
            semester: semester,
            schoolYear: schoolYear,
            graduating: graduating,
        };

        try {
            const response = await axios.post("http://localhost:8080/Requests/add", clearanceRequest);
            if (response.status === 201) {
                alert("Clearance request successfully added");
            } else {
                alert("Failed to add clearance request");
            }
        } catch (error) {
            console.error("There was an error sending the request!", error);
            alert("Error adding clearance request");
        }
    };

    const toggleModal = () => {
        setShowModal(!showModal); // Toggle modal visibility
    };

    const handleProfile = () => {
        console.log("View Profile");
        navigate("/student-account");
    };

    const handleLogout = () => {
        console.log("Logged out");
        // Implement logout logic here
    };

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
                    <button className={styles.whiteButton} onClick={() => navigate('/request-clearance')}>
                        <img src={requestIcon} alt="Request Icon" className={styles.navIcon} />
                        Clearance Request
                    </button>
                    <button className={styles.ghostButton} onClick={() => navigate('/student-clearance-status')}>
                        <img src={statusIcon} alt="Clearance Status" className={styles.navIcon} />
                        Clearance Status
                    </button>
                    <button className={styles.ghostButton} onClick={() => navigate('/student-account')}>
                        <img src={accountIcon} alt="Account" className={styles.navIcon} />
                        Account
                    </button>
                </nav>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h2 className={styles.dashboardTitle}>Clearance Request</h2>
                    <div className={styles.headerRight}>
                        <span className={styles.academicYear}>A.Y. 2024 - 2025</span>
                        <span className={styles.semesterBadge}>First Semester</span>
                        <div className={styles.avatar} onClick={toggleModal}>AN</div>
                        {showModal && (
                          <div className={styles.modal}>
                            <ul>
                              <li onClick={handleProfile}>See Profile</li>
                              <li onClick={handleLogout}>Log Out</li>
                            </ul>
                          </div>
                        )}
                    </div>
                </div>

                <div className={styles.cardGrid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Clearance Request</h3>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.inputBox}>
                                <label htmlFor="semester">Semester</label>
                                <select
                                    className={styles.filterButton}
                                    value={semester}
                                    onChange={handleSemesterChange}
                                >
                                    <option value="FIRST">First Semester</option>
                                    <option value="SECOND">Second Semester</option>
                                </select>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="schoolYear">School Year</label>
                                <select
                                    className={styles.filterButton}
                                >
                                    <option value="2024-2025">2024-2025</option>
                                    <option value="2025-2026">2025-2026</option>
                                    <option value="2026-2027">2026-2027</option>
                                    <option value="2027-2028">2027-2028</option>
                                </select>
                            </div>

                            <div className={styles.inputBox}>
                                <label htmlFor="graduating">Graduating</label>
                                <select
                                    className={styles.filterButton}
                                    value={graduating ? "Yes" : "No"}
                                    onChange={handleGraduatingChange}
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div className={styles.buttonContainer}>
                                <button type="submit" className={styles.button}>
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestClearance;
