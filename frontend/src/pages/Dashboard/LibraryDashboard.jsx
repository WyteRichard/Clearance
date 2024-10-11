import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/DepartmentDashboard.module.css';
import dashIcon from '../../assets/bhome.png';
import requestIcon from '../../assets/notes.png';
import avatar from '../../assets/avatar.png';

const LibraryDashboard = () => {

    const [currentSemester, setCurrentSemester] = useState("Loading...");
    const [currentAcademicYear, setCurrentAcademicYear] = useState("Loading...");

    useEffect(() => {
        // Fetch the current semester and academic year
        axios.get('http://localhost:8080/Admin/semester/current')
            .then(response => {
                setCurrentSemester(response.data.currentSemester); // Update state with the current semester
                setCurrentAcademicYear(response.data.academicYear); // Update state with the academic year
            })
            .catch(error => {
                console.error("Error fetching the current semester and academic year", error);
            });
    }, []);


    const [showModal, setShowModal] = useState(false);

    const [counts, setCounts] = useState({
        clearanceRequests: 0,
        cleared: 0,
        pending: 0,
        remarks: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const departmentId = 8; // The specific department ID for this adviser
                const clearanceResponse = await axios.get(`http://localhost:8080/Requests/count?departmentId=${departmentId}`);
                const statusCountsResponse = await axios.get(`http://localhost:8080/Status/department/${departmentId}/status-counts`);
    
                setCounts({
                    clearanceRequests: clearanceResponse.data,
                    cleared: statusCountsResponse.data.cleared,
                    pending: statusCountsResponse.data.pending,
                    remarks: counts.remarks
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, [counts.remarks]);

    const toggleModal = () => {
        setShowModal(!showModal); // Toggle modal visibility
    };

    const handleLogout = () => {
        console.log("Logged out");
        // Implement logout logic here
    };

    return (
        <div className={styles.flexContainer}>
            <div className={styles.sidebar}>
                <div className={styles.logoContainer}>
                </div>
                <nav className={styles.nav}>
                    <button className={styles.whiteButton} onClick={() => navigate('/cashier-dashboard')}>
                        <img src={dashIcon} alt="Dashboard" className={styles.navIcon} />
                        Dashboard
                    </button>
                    <button className={styles.ghostButton} onClick={() => navigate('/cashier-clearance-request')}>
                        <img src={requestIcon} alt="Clearance Request" className={styles.navIcon} />
                        Clearance Request
                    </button>
                </nav>
            </div>
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h2 className={styles.dashboardTitle}>Library Dashboard</h2>
                    <div className={styles.headerRight}>
                        <span className={styles.academicYear}>A.Y. {currentAcademicYear}</span> {/* Display the fetched academic year */}
                        <span className={styles.semesterBadge}>{currentSemester.replace('_', ' ')}</span>
                        <div className={styles.avatar} onClick={toggleModal}>
                            <img src={avatar} alt="Avatar" />
                        </div>
                        {showModal && (
                            <div className={styles.modal}>
                                <ul>
                                    <li onClick={handleLogout}>Log Out</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </header>
                <div className={styles.cardGrid}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Clearance Requests</span>
                            <span className={styles.greenIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{counts.clearanceRequests}</div>
                            <p className={styles.smallText}>Total Requests</p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Cleared</span>
                            <span className={styles.yellowIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{counts.cleared}</div>
                            <p className={styles.smallText}>Department Approved</p>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Pending</span>
                            <span className={styles.redIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{counts.pending}</div>
                            <p className={styles.smallText}>Awaiting Approval</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryDashboard;
