import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StudentClearanceStatus.module.css';  // Assuming you have similar CSS module as the Dashboard
import rcLogo from '../assets/rc_logo.png';
import dashIcon from '../assets/home.png';
import requestIcon from '../assets/notes.png';
import statusIcon from '../assets/bidcard.png';
import accountIcon from '../assets/user.png';
import printIcon from '../assets/printIcon.svg';

const StudentClearanceStatus = () => {
    const [clearanceStatuses, setClearanceStatuses] = useState([]);
    const [filteredStatuses, setFilteredStatuses] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const studentId = 1;  // Replace with the actual student ID

    useEffect(() => {
        axios.get(`http://localhost:8080/Status/student/${studentId}`)
            .then(response => {
                const data = response.data;
                const statuses = Object.values(data);
                setClearanceStatuses(statuses);
                setFilteredStatuses(statuses);
            })
            .catch(error => {
                console.error('Error fetching clearance statuses:', error);
            });

    }, [studentId]);

    useEffect(() => {
        if (statusFilter === '') {
            setFilteredStatuses(clearanceStatuses);
        } else {
            setFilteredStatuses(clearanceStatuses.filter(status => status.status.toLowerCase() === statusFilter));
        }
    }, [statusFilter, clearanceStatuses]);

    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
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
                    <button className={styles.ghostButton} onClick={() => navigate('/request-clearance')}>
                        <img src={requestIcon} alt="Clearance Request" className={styles.navIcon} />
                        Clearance Request
                    </button>
                    <button className={styles.whiteButton} onClick={() => navigate('/student-clearance-status')}>
                        <img src={statusIcon} alt="Status Icon" className={styles.navIcon} />
                        Clearance Status
                    </button>
                    <button className={styles.ghostButton} onClick={() => navigate('/student-account')}>
                        <img src={accountIcon} alt="Account Icon" className={styles.navIcon} />
                        Account
                    </button>
                </nav>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h2 className={styles.dashboardTitle}>Clearance Status</h2>
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

                    <div className={styles.filterContainer}>
                        <select className={styles.filterButton} value={statusFilter} onChange={handleFilterChange}>
                            <option value="">All</option>
                            <option value="cleared">Cleared</option>
                            <option value="pending">Pending</option>
                        </select>
                        <button className={styles.printButton}>
                            <img src={printIcon} alt="Print Clearance" />
                            Print Clearance
                        </button>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.clearanceTable}>
                            <thead>
                                <tr>
                                    <th>Department</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStatuses.map((status, index) => (
                                    <tr key={index}>
                                        <td>{status.department}</td>
                                        <td>{status.status}</td>
                                        <td>{status.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            </div>
        </div>
    );
};

export default StudentClearanceStatus;
