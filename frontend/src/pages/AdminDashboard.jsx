import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/bhome.png';
import requestIcon from '../assets/dept.png';
import userIcon from '../assets/user.png';
import avatar from '../assets/avatar.png';
import checkIcon from '../assets/check.png';
import styles from '../styles/AdminDashboard.module.css'; // CSS module

const AdminDashboard = () => {
    const [currentSemester, setCurrentSemester] = useState("Loading...");
    const [currentAcademicYear, setCurrentAcademicYear] = useState("Loading...");
    const [alertMessage, setAlertMessage] = useState(null); // Alert message state
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
    const [announcements, setAnnouncements] = useState([]);
    const [announcementTitle, setAnnouncementTitle] = useState(""); // New state for the announcement
    const [announcementDate, setAnnouncementDate] = useState("");
    const [announcementDetails, setAnnouncementDetails] = useState("");
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

    
    useEffect(() => {
        // Retrieve academic year from localStorage on component mount
        const savedAcademicYear = localStorage.getItem('currentAcademicYear');
        if (savedAcademicYear) {
            setCurrentAcademicYear(savedAcademicYear);
        } else {
            setCurrentAcademicYear("2024-2025"); // Default academic year if none found in localStorage
        }

        // Fetch current semester and academic year from backend
        axios.get('http://localhost:8080/Admin/semester/current')
            .then(response => {
                if (response.data.currentSemester) setCurrentSemester(response.data.currentSemester);
                if (response.data.academicYear) {
                    setCurrentAcademicYear(response.data.academicYear);
                    localStorage.setItem('currentAcademicYear', response.data.academicYear); // Save it to localStorage
                }
            })
            .catch(error => console.error("Error fetching the current semester and academic year", error));

        // Fetch announcements when component mounts
        fetchAnnouncements();
    }, []);

    // Fetch all announcements from the backend
    const fetchAnnouncements = () => {
        axios.get('http://localhost:8080/announcements/all')
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    setAnnouncements(response.data); // Set the announcements if response data is an array
                }
            })
            .catch(error => {
                console.error("Error fetching announcements:", error);
                setError("Failed to fetch announcements.");
            });
    };

    const handleSubmitAnnouncement = (e) => {
        e.preventDefault();
        const announcementData = {
            title: announcementTitle,
            announcementDate: announcementDate,
            details: announcementDetails
        };

        axios.post('http://localhost:8080/announcements/add', announcementData)
            .then(response => {
                setAlertMessage("Announcement successfully added!");
                setAlertType('success');
                setAnnouncementTitle("");  // Reset form fields
                setAnnouncementDate("");
                setAnnouncementDetails("");
                fetchAnnouncements(); // Fetch updated list after adding
            })
            .catch(error => {
                setAlertMessage("Failed to add announcement.");
                setAlertType('error');
            });

        // Automatically hide the alert after 3 seconds
        setTimeout(() => setAlertMessage(null), 3000);
    };

    const handleDeleteAnnouncement = (id) => {
        axios.delete(`http://localhost:8080/announcements/${id}`)
            .then(() => {
                setAlertMessage("Announcement successfully deleted!");
                setAlertType('success');
                fetchAnnouncements(); // Refresh the list after deletion
            })
            .catch(error => {
                setAlertMessage("Failed to delete announcement.");
                setAlertType('error');
            });

        // Automatically hide the alert after 3 seconds
        setTimeout(() => setAlertMessage(null), 3000);
    };

    const handleSemesterSwitch = (semester) => {
        axios.post(`http://localhost:8080/Admin/semester/switch?semesterType=${semester}&academicYear=${currentAcademicYear}`)
            .then(response => {
                setCurrentSemester(response.data.currentSemester);
                // Update academic year from response if provided, otherwise use the current one
                if (response.data.academicYear) {
                    setCurrentAcademicYear(response.data.academicYear);
                    localStorage.setItem('currentAcademicYear', response.data.academicYear); // Persist to localStorage
                }
                setAlertMessage(`Semester switched to ${semester.replace('_', ' ').toLowerCase()} for A.Y. ${currentAcademicYear}`);
                setAlertType('success');
                setTimeout(() => setAlertMessage(null), 3000);
            })
            .catch(error => {
                console.error("Error switching the semester", error);
                setAlertMessage("Failed to switch semester.");
                setAlertType('error');
                setTimeout(() => setAlertMessage(null), 3000);
            });
    };

    const handleAcademicYearChange = (event) => {
        const selectedYear = event.target.value;
        setCurrentAcademicYear(selectedYear);
        localStorage.setItem('currentAcademicYear', selectedYear); // Save the selected academic year to localStorage

        // Trigger backend update for academic year
        axios.post(`http://localhost:8080/Admin/semester/switch?semesterType=${currentSemester}&academicYear=${selectedYear}`)
            .then(response => {
                setCurrentAcademicYear(response.data.academicYear);
                setAlertMessage(`Academic Year switched to ${selectedYear}`);
                setAlertType('success');
                setTimeout(() => setAlertMessage(null), 3000);
            })
            .catch(error => {
                console.error("Error switching the academic year", error);
                setAlertMessage("Failed to switch academic year.");
                setAlertType('error');
                setTimeout(() => setAlertMessage(null), 3000);
            });
    };
    
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
                    <div className={styles.semesterSwitcher}>
                            <label>Switch Semester: </label>
                            <select onChange={(e) => handleSemesterSwitch(e.target.value)} value={currentSemester}>
                                <option value="FIRST_SEMESTER">First Semester</option>
                                <option value="SECOND_SEMESTER">Second Semester</option>
                            </select>
                        </div>

                        <div className={styles.academicYearSwitcher}>
                            <label>Academic Year: </label>
                            <select onChange={handleAcademicYearChange} value={currentAcademicYear}>
                                <option value="2023-2024">2023-2024</option>
                                <option value="2024-2025">2024-2025</option>
                                <option value="2025-2026">2025-2026</option>
                                <option value="2026-2027">2026-2027</option>
                            </select>
                        </div>

                        <span className={styles.academicYear}>A.Y. {currentAcademicYear}</span>
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
                </div>

                {/* Alert Component */}
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

                <div className={styles.twoColumnLayout}>
                    {/* Left Column: Announcement Form */}
                    <div className={styles.leftColumn}>
                        <div className={styles.announcementForm}>
                            <h3>Create Announcement</h3>
                            <form onSubmit={handleSubmitAnnouncement}>
                                <div>
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={announcementTitle}
                                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Announcement Date</label>
                                    <input
                                        type="date"
                                        value={announcementDate}
                                        onChange={(e) => setAnnouncementDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Details</label>
                                    <textarea
                                        value={announcementDetails}
                                        onChange={(e) => setAnnouncementDetails(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Announcements Table */}
                    <div className={styles.rightColumn}>
                        <h3>Announcements</h3>
                        {announcements.length === 0 ? (
                            <p>No announcements available</p>
                        ) : (
                            <table className={styles.announcementTable}>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Date</th>
                                        <th>Details</th>
                                        <th>Action</th> {/* New Action Column */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {announcements.map((announcement) => (
                                        <tr key={announcement.id}>
                                            <td>{announcement.title}</td>
                                            <td>{announcement.announcementDate}</td>
                                            <td>{announcement.details}</td>
                                            <td>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
