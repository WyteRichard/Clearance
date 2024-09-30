import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StudentDashboard.module.css';
import rcLogo from '../assets/rc_logo.png';
import dateIcon from '../assets/calendar.png';
import dashIcon from '../assets/bhome.png';
import requestIcon from '../assets/notes.png';
import statusIcon from '../assets/idcard.png';
import accountIcon from '../assets/user.png';

const StudentDashboard = () => {
    const [clearedCount, setClearedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [remarkCount, setRemarkCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const studentId = 1; // Replace with the actual student ID

    useEffect(() => {
        axios.get(`http://localhost:8080/Status/student/${studentId}/status-counts`)
            .then(response => {
                const { cleared, pending, remarks } = response.data;
                setClearedCount(cleared);
                setPendingCount(pending);
                setRemarkCount(remarks);

                const totalSteps = cleared + pending;
                const progressPercentage = totalSteps > 0 ? (cleared / totalSteps) * 100 : 0;
                setProgress(progressPercentage);

            })
            .catch(error => {
                console.error("There was an error fetching the clearance status counts!", error);
            });
    }, [studentId]);

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
                    <img src={rcLogo} alt="College Logo" className={styles.logo} />
                    <h1 className={styles.collegeName}>Rogationist College</h1>
                </div>
                <nav className={styles.nav}>
                    <button className={styles.whiteButton} onClick={() => navigate('/student-dashboard')}>
                        <img src={dashIcon} alt="Dashboard" className={styles.navIcon} />
                        Dashboard
                    </button>
                    <button className={styles.ghostButton} onClick={() => navigate('/request-clearance')}>
                        <img src={requestIcon} alt="Clearance Request" className={styles.navIcon} />
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
                    <h2 className={styles.dashboardTitle}>Student Dashboard</h2>
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
                    {/* Cleared */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Cleared</span>
                            <span className={styles.greenIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{clearedCount}</div>
                            <p className={styles.smallText}>Department Approved</p>
                        </div>
                    </div>

                    {/* Pending */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Pending</span>
                            <span className={styles.yellowIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{pendingCount}</div>
                            <p className={styles.smallText}>Awaiting approval</p>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Remarks</span>
                            <span className={styles.redIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{remarkCount}</div>
                            <p className={styles.smallText}>
                                {remarkCount > 0 ? "Issues were detected" : "No issues found"}
                            </p>
                        </div>
                    </div>

                    {/* Clearance Progress */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Clearance Progress</span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.progressContainer}>
                                <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className={styles.smallText}>Overall progress: {Math.round(progress)}%</p>
                        </div>
                    </div>

                    {/* Important Dates */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Important Dates</span>
                        </div>
                        <div className={styles.cardContent}>
                            <ul className={styles.datesList}>
                                <li className={styles.dateItem}>
                                    <img src={dateIcon} alt="Date" className={styles.smallIcon} />
                                    Clearance Deadline - July 30, 2024
                                </li>
                                <li className={styles.dateItem}>
                                    <img src={dateIcon} alt="Date" className={styles.smallIcon} />
                                    Start of Classes - August 15, 2024
                                </li>
                                <li className={styles.dateItem}>
                                    <img src={dateIcon} alt="Date" className={styles.smallIcon} />
                                    Midterm Exams - October 10-14, 2024
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
