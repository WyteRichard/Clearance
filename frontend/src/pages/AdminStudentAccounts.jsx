import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import styles from '../styles/AdminStudentAccounts.module.css';
import homeIcon from "../assets/home.png";
import requestIcon from "../assets/dept.png";
import userIcon from "../assets/buser.png";
import deleteIcon from "../assets/delete.svg";
import announcementIcon from '../assets/announcement.png';
import avatar from '../assets/avatar.png';

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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudentNumber, setSelectedStudentNumber] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('role');
        const exp = localStorage.getItem('exp');
        const currentTime = new Date().getTime();

        if (!role || !exp || exp * 1000 < currentTime) {
            handleLogout();
        } else if (role !== "ROLE_ROLE_ADMIN") {
            alert("Unauthorized access. Redirecting to login.");
            handleLogout();
        } else {
            fetchStudentData();
            fetchCourseData();
            fetchYearLevelData();
            fetchSemesterData();
        }
    }, []);

    const fetchStudentData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/Student/students", {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setStudents(response.data);
        } catch (error) {
            console.error("There was an error fetching the student data!", error);
        }
    };

    const fetchCourseData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/Course/courses", {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCourses(response.data);
        } catch (error) {
            console.error("There was an error fetching the courses!", error);
        }
    };

    const fetchYearLevelData = async () => {
        try {
            const response = await axios.get("http://localhost:8080/Year/levels", {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setYearLevels(response.data);
        } catch (error) {
            console.error("There was an error fetching the year levels!", error);
        }
    };

    const fetchSemesterData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/Admin/semester/current', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCurrentSemester(response.data.currentSemester);
            setCurrentAcademicYear(response.data.academicYear);
        } catch (error) {
            console.error("Error fetching the current semester and academic year", error);
        }
    };

    const handleDeleteClick = (studentNumber) => {
        setSelectedStudentNumber(studentNumber);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedStudentNumber) return;
    
        console.log("Attempting to delete all related clearance requests and statuses for student:", selectedStudentNumber);
        
        axios.delete(`http://localhost:8080/Requests/student/${selectedStudentNumber}/all`, {
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        })
        .then(() => {
            console.log("Related clearance requests and statuses deleted successfully. Proceeding to delete the student.");
    
            return axios.delete(`http://localhost:8080/Student/student/${selectedStudentNumber}`, {
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            });
        })
        .then(() => {
            setStudents(students.filter(student => student.studentNumber !== selectedStudentNumber));
            alert("Student and all related records deleted successfully!");
        })
        .catch((error) => {
            if (error.response) {
                console.error("Server responded with error:", error.response);
                alert(`Error deleting the student or related records: ${error.response.data.message || error.response.status}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert("No response from server. Please check the network or server status.");
            } else {
                console.error("Error setting up request:", error.message);
                alert("Error setting up the delete request.");
            }
        })
        .finally(() => {
            setIsModalOpen(false);
            setSelectedStudentNumber(null);
        });
    };

    const handleDeleteCancel = () => {
        setIsModalOpen(false);
        setSelectedStudentNumber(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('exp');
        navigate('/login');
    };

    const filteredStudents = students.filter(student => {
        const nameMatch = `${student.firstName} ${student.middleName} ${student.lastName}`.toLowerCase().includes(searchName.toLowerCase());
        const yearMatch = searchYearLevel === "" || student.yearLevel?.yearLevel === searchYearLevel;
        const courseMatch = searchCourse === "" || student.course?.courseName === searchCourse;
        return nameMatch && yearMatch && courseMatch;
    });

    const toggleModal = () => setShowModal(!showModal);

    return (
        <div className={styles.flexContainer}>
            <div className={styles.sidebar}>
                <div className={styles.logoContainer}></div>
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
                    <button className={styles.ghostButton} onClick={() => navigate('/admin-announcements')}>
                        <img src={announcementIcon} alt="Announcements" className={styles.navIcon} />
                        Announcements
                    </button>
                </nav>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h2 className={styles.dashboardTitle}>Student Accounts</h2>
                    <div className={styles.headerRight}>
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
                                            onClick={() => handleDeleteClick(student.studentNumber)}
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