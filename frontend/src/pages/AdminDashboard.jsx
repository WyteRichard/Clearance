import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/bhome.png';
import requestIcon from '../assets/dept.png';
import userIcon from '../assets/user.png';
import rcLogo from '../assets/rc_logo.png';
import avatar from '../assets/avatar.png';
import styles from '../styles/AdminDashboard.module.css'; // CSS module

const AdminDashboard = () => {
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
            axios.get(url)
                .then(response => {
                    setState(response.data);
                    return response.data;
                })
                .catch(error => {
                    console.error(`Error fetching data from ${url}:`, error);
                    setError("Failed to fetch some department accounts.");
                    return 0;
                })
        ))
        .then(results => {
            const totalAccounts = results.reduce((total, count) => total + count, 0);
            setDepartmentsAccounts(totalAccounts);
        });

        axios.get('http://localhost:8080/Student/students/count')
            .then(response => {
                setStudentsCount(response.data);
            })
            .catch(error => {
                setError("Failed to fetch students count.");
            });
    }, []);

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
                    <img src={rcLogo} alt="RC LOGO" className={styles.logo} />
                    <h1 className={styles.collegeName}>Rogationist College</h1>
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
                </nav>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h2 className={styles.dashboardTitle}>Admin Dashboard</h2>
                    <div className={styles.headerRight}>
                        <span className={styles.academicYear}>A.Y. 2024 - 2025</span>
                        <span className={styles.semesterBadge}>First Semester</span>
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

                {/* Top Row - Student Accounts and Department Accounts */}
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

                {/* Department Cards - 3 Columns */}
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
