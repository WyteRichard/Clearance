import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AdminStudentAccounts.module.css'; // Using CSS Module for styling
import homeIcon from "../assets/home.png";
import requestIcon from "../assets/dept.png";
import userIcon from "../assets/buser.png";
import deleteIcon from "../assets/delete.svg";
import avatar from '../assets/avatar.png';

// ConfirmationModal component
const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p>{message}</p>
                <div className={styles.modalActions}>
                    <button className={styles.modalButton} onClick={onConfirm}>Yes</button>
                    <button className={styles.modalButton} onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

const AdminStudentAccounts = () => {
    const [students, setStudents] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchYearLevel, setSearchYearLevel] = useState("");
    const [searchCourse, setSearchCourse] = useState("");
    const [courses, setCourses] = useState([]);
    const [yearLevels, setYearLevels] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentSemester, setCurrentSemester] = useState("Loading...");
    const [currentAcademicYear, setCurrentAcademicYear] = useState("Loading...");
    const navigate = useNavigate();
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const apiUrlStudents = "http://localhost:8080/Student/students";
    const apiUrlCourses = "http://localhost:8080/Course/courses";
    const apiUrlYearLevels = "http://localhost:8080/Year/levels";

    useEffect(() => {
        axios.get(apiUrlStudents)
            .then(response => setStudents(response.data))
            .catch(error => console.error("There was an error fetching the student data!", error));

        axios.get(apiUrlCourses)
            .then(response => setCourses(response.data))
            .catch(error => console.error("There was an error fetching the courses!", error));

        axios.get(apiUrlYearLevels)
            .then(response => setYearLevels(response.data))
            .catch(error => console.error("There was an error fetching the year levels!", error));
    }, []);

    // Open modal and set the selected student for deletion
    const handleDeleteClick = (studentId) => {
        setSelectedStudentId(studentId);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedStudentId) {
            axios.delete(`http://localhost:8080/Student/student/${selectedStudentId}`)
                .then(() => {
                    setStudents(students.filter(student => student.id !== selectedStudentId));
                    alert("Student deleted successfully!");
                })
                .catch(error => {
                    console.error("There was an error deleting the student!", error);
                    alert("Error deleting the student.");
                })
                .finally(() => {
                    setIsModalOpen(false);
                    setSelectedStudentId(null);
                });
        }
    };

    const handleDeleteCancel = () => {
        setIsModalOpen(false);
        setSelectedStudentId(null);
    };

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

    const filteredStudents = students.filter(student => {
        const nameMatch = `${student.firstName} ${student.middleName} ${student.lastName}`.toLowerCase().includes(searchName.toLowerCase());
        const yearMatch = searchYearLevel === "" || student.yearLevel?.yearLevel === searchYearLevel;
        const courseMatch = searchCourse === "" || student.course?.courseName === searchCourse;
        return nameMatch && yearMatch && courseMatch;
    });

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
                    <button className={styles.ghostButton} onClick={() => navigate('/admin-dashboard')}>
                        <img src={homeIcon} alt="Home" className={styles.navIcon} />
                        Dashboard
                    </button>
                    <button className={styles.ghostButton} onClick={() => navigate('/admin-dept-accounts')}>
                        <img src={requestIcon} alt="Department" className={styles.navIcon} />
                        Department
                    </button>
                    <button className={styles.whiteButton} onClick={() => navigate('/admin-student-accounts')}>
                        <img src={userIcon} alt="Students" className={styles.navIcon} />
                        Students
                    </button>
                </nav>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h2 className={styles.dashboardTitle}>Student Accounts</h2>
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
                </div>

                <div className={styles.filterContainer}>
                    <div className={styles.inputBox}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="Search by Name"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputBox}>
                        <select
                            className={styles.searchInput}
                            value={searchYearLevel}
                            onChange={(e) => setSearchYearLevel(e.target.value)}
                        >
                            <option value="">All Year Levels</option>
                            {yearLevels.map((yearLevel) => (
                                <option key={yearLevel.id} value={yearLevel.yearLevel}>
                                    {yearLevel.yearLevel}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.inputBox}>
                        <select
                            className={styles.searchInput}
                            value={searchCourse}
                            onChange={(e) => setSearchCourse(e.target.value)}
                        >
                            <option value="">All Courses</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.courseName}>
                                    {course.courseName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <table className={styles.clearanceTable}>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Course</th>
                            <th>Year Level</th>
                            <th>Address</th>
                            <th>Contact Number</th>
                            <th>Email</th>
                            <th>Birthday</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.studentNumber || "N/A"}</td>
                                    <td>{`${student.firstName || ""} ${student.middleName || ""} ${student.lastName || ""}`}</td>
                                    <td>{student.course?.courseName || "N/A"}</td>
                                    <td>{student.yearLevel?.yearLevel || "N/A"}</td>
                                    <td>{student.address || "N/A"}</td>
                                    <td>{student.contactNumber || "N/A"}</td>
                                    <td>{student.email || "N/A"}</td>
                                    <td>{student.birthdate ? new Date(student.birthdate).toLocaleDateString() : "N/A"}</td>
                                    <td>
                                        <img
                                            src={deleteIcon}
                                            alt="delete"
                                            className={styles.actionIcon}
                                            onClick={() => handleDeleteClick(student.id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No students found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                message="Are you sure you want to delete this student?"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </div>
    );
};

export default AdminStudentAccounts;
