import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/bhome.png';
import requestIcon from '../assets/dept.png';
import userIcon from '../assets/user.png';
import avatar from '../assets/avatar.png';
import checkIcon from '../assets/check.png';
import announcementIcon from '../assets/announcement.png';
import styles from '../styles/AdminDashboard.module.css';

const AdminDashboard = () => {
    const [currentSemester, setCurrentSemester] = useState(localStorage.getItem('currentSemester') || "");
    const [currentAcademicYear, setCurrentAcademicYear] = useState(localStorage.getItem('currentAcademicYear') || "");
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('success');
    const [departmentsAccounts, setDepartmentsAccounts] = useState(0);
    const [studentsCount, setStudentsCount] = useState(0);
    const [error, setError] = useState("");
    const [adviserCount, setAdviserCount] = useState(0);
    const [cashierCount, setCashierCount] = useState(0);
    const [clinicCount, setClinicCount] = useState(0);
    const [clusterCoordinatorCount, setClusterCoordinatorCount] = useState(0);
    const [deanCount, setDeanCount] = useState(0);
    const [guidanceCount, setGuidanceCount] = useState(0);
    const [laboratoryCount, setLaboratoryCount] = useState(0);
    const [libraryCount, setLibraryCount] = useState(0);
    const [registrarCount, setRegistrarCount] = useState(0);
    const [spiritualAffairsCount, setSpiritualAffairsCount] = useState(0);
    const [studentAffairsCount, setStudentAffairsCount] = useState(0);
    const [prefectCount, setPrefectCount] = useState(0);
    const [councilCount, setCouncilCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        const exp = localStorage.getItem('exp');
        const currentTime = new Date().getTime();

        if (!role || !exp || exp * 1000 < currentTime) {
            handleLogout();
        } else if (role !== "ROLE_ROLE_ADMIN") {
            navigate('/login');
        } else {
            fetchCounts();
            fetchSemesterData();
        }
    }, []);

    const fetchCounts = () => {
        const endpoints = [
            { url: 'http://localhost:8080/Adviser/advisers/count', setState: setAdviserCount },
            { url: 'http://localhost:8080/Cashier/cashiers/count', setState: setCashierCount },
            { url: 'http://localhost:8080/Clinic/clinics/count', setState: setClinicCount },
            { url: 'http://localhost:8080/Cluster/coordinators/count', setState: setClusterCoordinatorCount },
            { url: 'http://localhost:8080/Dean/deans/count', setState: setDeanCount },
            { url: 'http://localhost:8080/Guidance/guidances/count', setState: setGuidanceCount },
            { url: 'http://localhost:8080/Laboratory/laboratories/count', setState: setLaboratoryCount },
            { url: 'http://localhost:8080/Library/libraries/count', setState: setLibraryCount },
            { url: 'http://localhost:8080/Registrar/registrars/count', setState: setRegistrarCount },
            { url: 'http://localhost:8080/Spiritual/affairs/count', setState: setSpiritualAffairsCount },
            { url: 'http://localhost:8080/Student/affairs/count', setState: setStudentAffairsCount },
            { url: 'http://localhost:8080/Prefect/prefects/count', setState: setPrefectCount },
            { url: 'http://localhost:8080/Council/councils/count', setState: setCouncilCount }
        ];

        Promise.all(endpoints.map(({ url, setState }) =>
            axios.get(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                .then(response => setState(response.data))
                .catch(() => setError("Failed to fetch some department accounts."))
        ))
        .then(() => {
            const totalAccounts = [adviserCount, cashierCount, clinicCount, clusterCoordinatorCount, deanCount, guidanceCount, laboratoryCount, libraryCount, registrarCount, spiritualAffairsCount, studentAffairsCount, prefectCount, councilCount]
                .reduce((total, count) => total + count, 0);
            setDepartmentsAccounts(totalAccounts);
        });

        axios.get('http://localhost:8080/Student/students/count', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => setStudentsCount(response.data))
        .catch(() => setError("Failed to fetch students count."));
    };

    const fetchSemesterData = () => {
        axios.get('http://localhost:8080/Admin/semester/current', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(response => {
            const { currentSemester, academicYear } = response.data;
            
            if (currentSemester && academicYear) {
                setCurrentSemester(currentSemester);
                setCurrentAcademicYear(academicYear);
                localStorage.setItem('currentSemester', currentSemester);
                localStorage.setItem('currentAcademicYear', academicYear);
            } else {
                setCurrentSemester(""); // Ensure placeholders are shown if data is missing
                setCurrentAcademicYear("");
            }
        })
        .catch(() => {
            setError("Failed to fetch semester data.");
            setCurrentSemester(""); // Ensure placeholders are shown on error
            setCurrentAcademicYear("");
        });
    };


    const handleSemesterSwitch = (semester) => {
        if (semester === currentSemester) return;

        axios.post(`http://localhost:8080/Admin/semester/switch?semesterType=${semester}&academicYear=${currentAcademicYear}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(response => {
            const { currentSemester, academicYear } = response.data;
            setCurrentSemester(currentSemester);
            setCurrentAcademicYear(academicYear);
            localStorage.setItem('currentSemester', currentSemester);
            localStorage.setItem('currentAcademicYear', academicYear);
            setAlertMessage(`Semester switched to ${semester.replace('_', ' ').toLowerCase()} for A.Y. ${academicYear}`);
            setAlertType('success');
            setTimeout(() => setAlertMessage(null), 3000);
        })
        .catch(() => {
            setAlertMessage("Failed to switch semester.");
            setAlertType('error');
            setTimeout(() => setAlertMessage(null), 3000);
        });
    };

    const handleAcademicYearChange = (event) => {
        const selectedYear = event.target.value;
        setCurrentAcademicYear(selectedYear);
        localStorage.setItem('currentAcademicYear', selectedYear);

        axios.post(`http://localhost:8080/Admin/semester/switch?semesterType=${currentSemester}&academicYear=${selectedYear}`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        .then(response => {
            const { academicYear } = response.data;
            setCurrentAcademicYear(academicYear);
            localStorage.setItem('currentAcademicYear', academicYear);
            setAlertMessage(`Academic Year switched to ${selectedYear}`);
            setAlertType('success');
            setTimeout(() => setAlertMessage(null), 3000);
        })
        .catch(() => {
            setAlertMessage("Failed to switch academic year.");
            setAlertType('error');
            setTimeout(() => setAlertMessage(null), 3000);
        });
    };

    const toggleModal = () => setShowModal(!showModal);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('exp');
        navigate('/login');
    };

    return (
        <div className={styles.flexContainer}>
            <div className={styles.sidebar}>
                <div className={styles.logoContainer}>
                </div>
                <nav className={styles.nav}>
                    <button className={styles.whiteButton} onClick={() => navigate('/admin-dashboard')}>
                        <img src={homeIcon} alt="Home" className={styles.navIcon} />
                        Dashboard
                    </button>
                    <button className={styles.ghostButton} onClick={() => navigate('/admin-dept-accounts')}>
                        <img src={requestIcon} alt="Department" className={styles.navIcon} />
                        Department
                    </button>
                    <button className={styles.ghostButton} onClick={() => navigate('/admin-student-accounts')}>
                        <img src={userIcon} alt="Students" className={styles.navIcon} />
                        Students
                    </button>
                    <button className={styles.ghostButton} onClick={() => navigate('/admin-announcements')}>
                        <img src={announcementIcon} alt="Announcements" className={styles.navIcon} />
                        Announcements
                    </button>
                </nav>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h2 className={styles.dashboardTitle}>Admin Dashboard</h2>
                    <div className={styles.headerRight}>
                        
                        <div className={styles.semesterSwitcher}>
                        <label>Switch Semester: </label>
                        <select onChange={(e) => handleSemesterSwitch(e.target.value)} value={currentSemester || ""}>
                            {!currentSemester && <option value="" disabled hidden>Select Semester</option>}
                            <option value="FIRST_SEMESTER">First Semester</option>
                            <option value="SECOND_SEMESTER">Second Semester</option>
                        </select>
                    </div>

                    <div className={styles.academicYearSwitcher}>
                        <label>Academic Year: </label>
                        <select onChange={handleAcademicYearChange} value={currentAcademicYear || ""}>
                            {!currentAcademicYear && <option value="" disabled hidden>Select Year</option>}
                            <option value="2023-2024">2023-2024</option>
                            <option value="2024-2025">2024-2025</option>
                            <option value="2025-2026">2025-2026</option>
                            <option value="2026-2027">2026-2027</option>
                        </select>
                    </div>

                    <span className={styles.academicYear}>A.Y. {currentAcademicYear || "Not Selected"}</span>
                    <span className={styles.semesterBadge}>{currentSemester ? currentSemester.replace('_', ' ') : "Not Selected"}</span>

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
                </div>

                {alertMessage && (
                    <div className={`${styles.alert} ${styles[alertType]}`}>
                        <div className={styles.alertTopBar}></div>
                        <div className={styles.alertContent}>
                            <img src={checkIcon} alt="Success" className={styles.alertIcon} />
                            <span>{alertMessage}</span>
                            <button className={styles.closeButton} onClick={() => setAlertMessage(null)}>×</button>
                        </div>
                    </div>
                )}

                <div className={styles.topRow}>
                    <div className={styles.topCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Student Accounts</span>
                            <span className={styles.greenIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{studentsCount}</div>
                        </div>
                    </div>

                    <div className={styles.topCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Department Accounts</span>
                            <span className={styles.redIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{departmentsAccounts}</div>
                        </div>
                    </div>
                </div>

                <div className={styles.cardGrid}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Adviser Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{adviserCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Cashier Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{cashierCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Clinic Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{clinicCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Cluster Coordinator</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{clusterCoordinatorCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Dean Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{deanCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Guidance Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{guidanceCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Laboratory Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{laboratoryCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Library Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{libraryCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Registrar Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{registrarCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Spiritual Affairs Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{spiritualAffairsCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Student Affairs Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{studentAffairsCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Student Discipline Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{prefectCount}</div>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Supreme Student Council Accounts</span>
                            <span className={styles.blueIcon}></span>
                        </div>
                        <div className={styles.cardContent}>
                            <div className={styles.boldText}>{councilCount}</div>
                        </div>
                    </div>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
        </div>
    );
};

export default AdminDashboard;
