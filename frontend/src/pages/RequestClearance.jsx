import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/RequestClearance.module.css";
import { useNavigate } from 'react-router-dom';
import dashIcon from '../assets/home.png';
import requestIcon from '../assets/bnotes.png';
import statusIcon from '../assets/idcard.png';
import accountIcon from '../assets/user.png';

const RequestClearance = () => {
    const [semester, setSemester] = useState(""); // Default to empty string
    const [schoolYear, setSchoolYear] = useState(""); // Default to empty string
    const [graduating, setGraduating] = useState(""); // Default to empty string
    const [showModal, setShowModal] = useState(false);
    const [departmentId, setDepartmentId] = useState(""); // Default to empty string
    const [currentSemester, setCurrentSemester] = useState("Loading...");
    const [currentAcademicYear, setCurrentAcademicYear] = useState("Loading...");
    const navigate = useNavigate();

    const firstSemesterDepartments = [
        { id: 2, name: 'Cashier' },
        { id: 5, name: 'Dean' },
        { id: 6, name: 'Guidance' },
        { id: 8, name: 'Library' },
        { id: 9, name: 'Registrar' },
        { id: 11, name: 'Student Affairs' },
        { id: 12, name: 'Student Discipline' },
    ];

    const allDepartments = [
        { id: 1, name: 'Adviser' },
        { id: 2, name: 'Cashier' },
        { id: 3, name: 'Clinic' },
        { id: 4, name: 'Cluster Coordinator' },
        { id: 5, name: 'Dean' },
        { id: 6, name: 'Guidance' },
        { id: 7, name: 'Laboratory' },
        { id: 8, name: 'Library' },
        { id: 9, name: 'Registrar' },
        { id: 10, name: 'Spiritual Affairs' },
        { id: 11, name: 'Student Affairs' },
        { id: 12, name: 'Student Discipline' },
        { id: 13, name: 'Supreme Student Council' },
    ];

    // Fetch the current semester from the backend
    useEffect(() => {
        axios.get('http://localhost:8080/Admin/semester/current')
            .then(response => {
                const fetchedSemester = response.data.currentSemester;
                const fetchedAcademicYear = response.data.academicYear;
                setCurrentSemester(fetchedSemester); // Example: "FIRST_SEMESTER" or "SECOND_SEMESTER"
                setCurrentAcademicYear(fetchedAcademicYear); // Example: "2024-2025"
            })
            .catch(error => {
                console.error("Error fetching the current semester and academic year", error);
            });
    }, []);

    const handleSemesterChange = (e) => {
        const selectedSemester = e.target.value;

        // Normalize both values to lowercase for consistent comparison
        const normalizedSelectedSemester = selectedSemester.toLowerCase().replace(" ", "_");
        const normalizedCurrentSemester = currentSemester.toLowerCase();

        // Check if the selected semester matches the current semester
        if (normalizedSelectedSemester !== normalizedCurrentSemester) {
            alert(`You are only allowed to choose ${currentSemester.replace("_", " ")}.`);
        } else {
            setSemester(selectedSemester); // Update the selected semester if valid
        }
    };

    const handleSchoolYearChange = (e) => {
        const selectedSchoolYear = e.target.value;

        // Check if the selected school year matches the current academic year
        if (selectedSchoolYear !== currentAcademicYear) {
            alert(`You are only allowed to choose the current academic year: ${currentAcademicYear}.`);
        } else {
            setSchoolYear(selectedSchoolYear); // Update the selected school year if valid
        }
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
                id: departmentId
            },
            semester: semester,
            schoolYear: schoolYear,
            graduating: graduating,
        };

        try {
            const response = await axios.post("http://localhost:8080/Requests/add", clearanceRequest, {
                headers: { "Content-Type": "application/json" }
            });

            if (response.status === 201 || response.status === 200) {
                alert("Clearance request successfully added");
            } else {
                alert(`Failed to add clearance request. Status code: ${response.status}`);
            }
        } catch (error) {
            console.error("Error sending the request:", error.response ? error.response.data : error.message);
            alert("Error adding clearance request. Please check the console for more details.");
        }
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleProfile = () => {
        console.log("View Profile");
        navigate("/student-account");
    };

    const handleLogout = () => {
        console.log("Logged out");
        // Implement logout logic here
    };

    // Determine which departments to display based on semester
    const availableDepartments = semester === "First Semester" ? firstSemesterDepartments : allDepartments;

    return (
        <div className={styles.flexContainer}>
            <div className={styles.sidebar}>
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
                    <span className={styles.academicYear}>A.Y. {currentAcademicYear}</span> {/* Dynamically show academic year */}
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

                <div className={styles.cardGrid}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>Clearance Request</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Department Dropdown */}
                            <div className={styles.inputBox}>
                                <label htmlFor="department">Department</label>
                                <select
                                    className={styles.filterButton}
                                    value={departmentId}
                                    onChange={(e) => setDepartmentId(e.target.value)}
                                >
                                    {/* Placeholder */}
                                    <option value="" disabled>Choose Department</option>
                                    {availableDepartments.map(department => (
                                        <option key={department.id} value={department.id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Semester Dropdown */}
                            <div className={styles.inputBox}>
                                <label htmlFor="semester">Semester</label>
                                <select
                                    className={styles.filterButton}
                                    value={semester}
                                    onChange={handleSemesterChange}
                                >
                                    {/* Placeholder */}
                                    <option value="" disabled>Choose Semester</option>

                                    {/* Both options are shown */}
                                    <option value="First Semester">First Semester</option>
                                    <option value="Second Semester">Second Semester</option>
                                </select>
                            </div>

                            {/* School Year Dropdown */}
                            <div className={styles.inputBox}>
                                <label htmlFor="schoolYear">School Year</label>
                                <select
                                    className={styles.filterButton}
                                    value={schoolYear}
                                    onChange={handleSchoolYearChange}
                                >
                                    {/* Placeholder */}
                                    <option value="" disabled>Choose School Year</option>
                                    <option value="2023-2024">2023-2024</option>
                                    <option value="2024-2025">2024-2025</option>
                                    <option value="2025-2026">2025-2026</option>
                                    <option value="2026-2027">2026-2027</option>
                                </select>
                            </div>

                            {/* Graduating Dropdown */}
                            <div className={styles.inputBox}>
                                <label htmlFor="graduating">Graduating</label>
                                <select
                                    className={styles.filterButton}
                                    value={graduating === "" ? "" : (graduating ? "Yes" : "No")}
                                    onChange={handleGraduatingChange}
                                >
                                    <option value="" disabled>
                                        Choose Graduating Status
                                    </option>
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
