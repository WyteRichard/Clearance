import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/StudentClearanceStatus.module.css';  
import dashIcon from '../assets/home.png';
import requestIcon from '../assets/notes.png';
import statusIcon from '../assets/bidcard.png';
import accountIcon from '../assets/user.png';
import printIcon from '../assets/printIcon.svg';
import logo from '../assets/logo.png';

const StudentClearanceStatus = () => {
    const [currentSemester, setCurrentSemester] = useState("Loading...");
    const [currentAcademicYear, setCurrentAcademicYear] = useState("Loading...");
    const [clearanceStatuses, setClearanceStatuses] = useState([]);
    const [filteredStatuses, setFilteredStatuses] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [studentFirstName, setStudentFirstName] = useState('');
    const [studentMiddleName, setStudentMiddleName] = useState('');
    const [studentLastName, setStudentLastName] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const [sectionName, setSectionName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const studentId = 1; // Replace with the actual student ID

    useEffect(() => {
        axios.get('http://localhost:8080/Admin/semester/current')
            .then(response => {
                const { currentSemester, academicYear } = response.data;
                setCurrentSemester(currentSemester);
                setCurrentAcademicYear(academicYear);
            })
            .catch(error => console.error("Error fetching semester and academic year:", error));
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8080/Status/student/${studentId}`)
            .then(response => {
                const statuses = Object.values(response.data);
                setClearanceStatuses(statuses);
                setFilteredStatuses(statuses);
            })
            .catch(error => console.error('Error fetching clearance statuses:', error));
    }, [studentId]);

    useEffect(() => {
        axios.get(`http://localhost:8080/Student/students/${studentId}`)
            .then(response => {
                const { firstName, middleName, lastName, studentNumber, section } = response.data;
                setStudentFirstName(firstName);
                setStudentMiddleName(middleName);
                setStudentLastName(lastName);
                setStudentNumber(studentNumber);
                setSectionName(section.sectionName);  // Access the sectionName here
            })
            .catch(error => console.error('Error fetching student information:', error));
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
        setShowModal(!showModal);
    };

    const handleProfile = () => {
        navigate("/student-account");
    };

    const handleLogout = () => {
        console.log("Logged out");
    };

    const handlePrint = () => {
        const printContent = document.getElementById('printable-content').innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Clearance Status</title>');
        printWindow.document.write(`
            <style>
                @media print {
                body { font-family: Arial, sans-serif; text-align: center; }
                .logo { display: block !important; width: 100px; margin: 0 auto 10px; }
                .invisible { display: block !important; margin-bottom: 20px; }
                    table {
                        width: 80%;
                        margin: 20px auto; /* Center the table on the page */
                        border-collapse: collapse;
                        border: 1px solid #ddd; /* Border around the table */
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        border: 1px solid #ddd; /* Border around each cell */
                    }
                }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className={styles.flexContainer}>
            <div className={styles.sidebar}>
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
                        <span className={styles.academicYear}>A.Y. {currentAcademicYear}</span>
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

                <div className={`${styles.studentInfo} ${styles.invisible}`}>
                    <h2>STUDENT CLEARANCE</h2>
                    <h3>{currentSemester}</h3>
                    <p>A.Y. {currentAcademicYear}</p>
                    <h3>Name: {studentFirstName} {studentMiddleName} {studentLastName}</h3>
                    <p>Student Number: {studentNumber}</p>
                    <p>Section: {sectionName}</p>
                </div>

                <div className={styles.filterContainer}>
                    <select className={styles.filterButton} value={statusFilter} onChange={handleFilterChange}>
                        <option value="">All</option>
                        <option value="cleared">Cleared</option>
                        <option value="pending">Pending</option>
                    </select>
                    <button className={styles.printButton} onClick={handlePrint}>
                        <img src={printIcon} alt="Print Clearance" />
                        Print Clearance
                    </button>
                </div>

                <div id="printable-content" className={styles.tableContainer}>
                    <div className={styles.printHeader}>
                        <img src={logo} alt="Logo" className={styles.logo} />
                    </div>

                <div className={`${styles.studentInfo} ${styles.invisible}`}>
                    <h2>STUDENT CLEARANCE</h2>
                    <h3>{currentSemester}</h3>
                    <p>A.Y. {currentAcademicYear}</p>
                    <h3>Name: {studentFirstName} {studentMiddleName} {studentLastName}</h3>
                    <p>Student Number: {studentNumber}</p>
                    <p>Section: {sectionName}</p>
                </div>
                    
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
