import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StudentDashboard.module.css';
import dateIcon from '../assets/calendar.png';
import dashIcon from '../assets/bhome.png';
import requestIcon from '../assets/notes.png';
import statusIcon from '../assets/idcard.png';
import accountIcon from '../assets/user.png';

const StudentDashboard = () => {
    const [currentSemester, setCurrentSemester] = useState("Loading...");
    const [currentAcademicYear, setCurrentAcademicYear] = useState("Loading...");
    const [clearedCount, setClearedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [remarkCount, setRemarkCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [importantDates, setImportantDates] = useState([]);
    const [error, setError] = useState(null); // Error state for better error handling
    const navigate = useNavigate();
    const studentId = 1; // Replace with the actual student ID

    useEffect(() => {
        // Fetch the current semester and academic year
        axios.get('http://localhost:8080/Admin/semester/current')
            .then(response => {
                const { currentSemester, academicYear } = response.data;
                if (currentSemester && academicYear) {
                    setCurrentSemester(currentSemester);
                    setCurrentAcademicYear(academicYear);
                } else {
                    console.error("Incomplete data from semester API", response.data);
                    setError("Failed to fetch academic year and semester.");
                }
            })
            .catch(error => {
                console.error("Error fetching the current semester and academic year", error);
                setError("Error fetching the current semester and academic year");
            });

        // Fetch clearance status counts
        axios.get(`http://localhost:8080/Status/student/${studentId}/status-counts`)
            .then(response => {
                const { cleared, pending, remarks } = response.data;
                if (cleared !== undefined && pending !== undefined && remarks !== undefined) {
                    setClearedCount(cleared);
                    setPendingCount(pending);
                    setRemarkCount(remarks);

                    const totalSteps = cleared + pending;
                    const progressPercentage = totalSteps > 0 ? (cleared / totalSteps) * 100 : 0;
                    setProgress(progressPercentage);
                } else {
                    console.error("Incomplete data from status counts API", response.data);
                    setError("Failed to fetch clearance status counts.");
                }
            })
            .catch(error => {
                console.error("There was an error fetching the clearance status counts!", error);
                setError("Error fetching clearance status counts");
            });

        // Fetch important dates (announcements)
        axios.get('http://localhost:8080/announcements/all')
        .then(response => {
            if (response.data && Array.isArray(response.data)) {
                const dates = response.data.map(announcement => ({
                    title: announcement.title,
                    announcementDate: announcement.announcementDate
                }));
                setImportantDates(dates);
            } else {
                console.error("Invalid data format from announcements API", response.data);
                setError("Failed to fetch announcements.");
            }
        })
        .catch(error => {
            console.error("Error fetching announcements", error);
            setError("Error fetching announcements");
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
                        <span className={styles.academicYear}>A.Y. {currentAcademicYear}</span> {/* Display the dynamic academic year */}
                        <span className={styles.semesterBadge}>{currentSemester.replace('_', ' ')}</span>

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

                {error && <div className={styles.errorMessage}>{error}</div>} {/* Display error messages if any */}

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
                                {importantDates.map((date, index) => (
                                    <li key={index} className={styles.dateItem}>
                                        <img src={dateIcon} alt="Date" className={styles.smallIcon} />
                                        {date.title} - {date.announcementDate}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
