import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import styles from '../../styles/DepartmentClearanceRequest.module.css';
import rcLogo from '../../assets/rc_logo.png';
import homeIcon from '../../assets/home.png';
import requestIcon from '../../assets/bnotes.png';
import clearedtoggle from '../../assets/clearedtoggle.svg';
import pendingtoggle from '../../assets/pendingtoggle.svg';
import avatar from '../../assets/avatar.png';

const LaboratoryClearanceRequest = () => {
    const [clearanceRequests, setClearanceRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [yearLevelFilter, setYearLevelFilter] = useState("");
    const [courseFilter, setCourseFilter] = useState("");
    const [yearLevels, setYearLevels] = useState([]);
    const [courses, setCourses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // For modal
    const [selectedRequest, setSelectedRequest] = useState(null); // Selected request for editing
    const [remarks, setRemarks] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    // Fetch clearance requests, year levels, and courses
    useEffect(() => {
        axios.get("http://localhost:8080/Requests/all")
            .then(response => {
                const data = Array.isArray(response.data) ? response.data : [];
                setClearanceRequests(data);
                setFilteredRequests(data); // Initially, all requests are displayed
                // Initialize statuses from local storage
                const savedStatuses = JSON.parse(localStorage.getItem('clearanceStatuses')) || {};
                setClearanceRequests(prevRequests =>
                    prevRequests.map(request => ({
                        ...request,
                        status: savedStatuses[request.id] || request.status
                    }))
                );
            })
            .catch(error => {
                console.error("Error fetching clearance requests:", error);
            });

        axios.get("http://localhost:8080/Year/levels")
            .then(response => {
                setYearLevels(response.data);
            })
            .catch(error => {
                console.error("Error fetching year levels:", error);
            });

        axios.get("http://localhost:8080/Course/courses")
            .then(response => {
                setCourses(response.data);
            })
            .catch(error => {
                console.error("Error fetching courses:", error);
            });
    }, []);

    // Handle filtering (search, status, year level, course)
    useEffect(() => {
        let filtered = Array.isArray(clearanceRequests) ? clearanceRequests : [];

        if (searchTerm) {
            const searchTerms = searchTerm.toLowerCase().split(/\s+/);
            filtered = filtered.filter(request => {
                const student = request.student || {};
                const fullName = `${student.firstName || ''} ${student.middleName || ''} ${student.lastName || ''}`.toLowerCase();
                return searchTerms.every(term => fullName.includes(term));
            });
        }

        if (statusFilter) {
            filtered = filtered.filter(request => request.status?.toLowerCase() === statusFilter.toLowerCase());
        }

        if (yearLevelFilter) {
            filtered = filtered.filter(request => request.student?.yearLevel?.yearLevel === yearLevelFilter);
        }

        if (courseFilter) {
            filtered = filtered.filter(request => request.student?.course?.courseName === courseFilter);
        }

        // Remove duplicates based on student ID
        const seenStudentIds = new Set();
        filtered = filtered.filter(request => {
            const studentId = request.student?.studentNumber;
            if (!studentId || seenStudentIds.has(studentId)) {
                return false;
            }
            seenStudentIds.add(studentId);
            return true;
        });

        setFilteredRequests(filtered);
    }, [searchTerm, statusFilter, yearLevelFilter, courseFilter, clearanceRequests]);

    // Toggle status function
        const toggleStatus = async (id, currentStatus) => {
            const normalizedStatus = currentStatus ? currentStatus.toLowerCase() : "pending"; // Default to "pending" if status is undefined
            const newStatus = normalizedStatus === "cleared" ? "PENDING" : "CLEARED";
            
            try {
                const response = await axios.put(`http://localhost:8080/Status/update-status/${id}`, {
                    status: newStatus

                });
                const updatedStatus = response.data;

                // Update status in local storage
                const savedStatuses = JSON.parse(localStorage.getItem('clearanceStatuses')) || {};
                savedStatuses[id] = updatedStatus.status;
                localStorage.setItem('clearanceStatuses', JSON.stringify(savedStatuses));

                // Update status in state
                setClearanceRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.id === id ? { ...request, status: updatedStatus.status} : request
                    )
                );
            } catch (error) {
                console.error("Error updating status:", error);
            }
        };


    // Fetching remarks for each student
    const getRemarks = (request) => {
        if (request.clearanceStatuses?.length > 0) {
            const foundStatus = request.clearanceStatuses.find(status => status.student?.studentId === request.student?.studentId);
            return foundStatus?.remarks || 'N/A';
        }
        return 'N/A';
    };

    const openModal = (request) => {
        setSelectedRequest(request);
        setRemarks(getRemarks(request));
        setIsModalOpen(true);
    };

    const handleSaveRemarks = async () => {
        if (selectedRequest) {
            try {
                const response = await axios.put(`http://localhost:8080/Status/update-status/${selectedRequest.id}`, {
                    remarks
                });
                const updatedRemarks = response.data.remarks;

                setClearanceRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.id === selectedRequest.id ? { ...request, remarks: updatedRemarks } : request
                    )
                );
                setIsModalOpen(false);
            } catch (error) {
                console.error("Error updating remarks:", error);
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
        setRemarks("");
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
                    <img src={rcLogo} alt="College Logo" className={styles.logo} />
                    <h1 className={styles.collegeName}>Rogationist College</h1>
                </div>
                <nav className={styles.nav}>
                    <button className={styles.ghostButton} onClick={() => navigate('/adviser-dashboard')}>
                        <img src={homeIcon} alt="Dashboard" className={styles.navIcon} />
                        Dashboard
                    </button>
                    <button className={styles.whiteButton} onClick={() => navigate('/request-clearance')}>
                        <img src={requestIcon} alt="Clearance Request" className={styles.navIcon} />
                        Clearance Request
                    </button>
                </nav>
            </div>
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h2 className={styles.dashboardTitle}>Laboratory Clearance Requests</h2>
                    <div className={styles.headerRight}>
                        <span className={styles.academicYear}>A.Y. 2024 - 2025</span>
                        <span className={styles.semesterBadge}>First Semester</span>
                        <div className={styles.avatar} onClick={toggleModal}>
                            <img src={avatar} alt="Avatar" />
                        </div>
                        {showModal && (
                            <div className={styles.modals}>
                                <ul>
                                    <li onClick={handleLogout}>Log Out</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </header>
                <div className={styles.filterContainer}>
                    <input 
                        type="text" 
                        placeholder="Search by name" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                    />
                    <select onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">Filter by status</option>
                        <option value="cleared">Cleared</option>
                        <option value="pending">Pending</option>
                    </select>
                    <select onChange={e => setYearLevelFilter(e.target.value)}>
                        <option value="">Filter by year level</option>
                        {yearLevels.map(level => (
                            <option key={level.yearLevelId} value={level.yearLevel}>
                                {level.yearLevel}
                            </option>
                        ))}
                    </select>
                    <select onChange={e => setCourseFilter(e.target.value)}>
                        <option value="">Filter by course</option>
                        {courses.map(course => (
                            <option key={course.courseId} value={course.courseName}>
                                {course.courseName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Year Level</th>
                                <th>Course</th>
                                <th>Status</th>
                                <th>Remarks</th>
                                <th>Action</th> {/* New header for Edit column */}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((request, index) => (
                                <tr key={index}>
                                    <td>{request.student?.studentNumber || 'N/A'}</td>
                                    <td>{`${request.student?.firstName || ''} ${request.student?.middleName || ''} ${request.student?.lastName || ''}`}</td>
                                    <td>{request.student?.yearLevel?.yearLevel || 'N/A'}</td>
                                    <td>{request.student?.course?.courseName || 'N/A'}</td>
                                    <td onClick={() => toggleStatus(request.id, request.status)}>
                                        <img 
                                            src={(request.status?.toLowerCase() === "cleared") ? clearedtoggle : pendingtoggle} 
                                            alt={request.status || 'Unknown Status'} 
                                            onClick={() => toggleStatus(request.id, request.status)} 
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td>{getRemarks(request)}</td> {/* Fetch remarks */}
                                    <td>
                                    <button className={styles.editButton} onClick={() => openModal(request)}>Edit</button>
                                    </td> {/* Edit button */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for editing remarks */}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onRequestClose={closeModal} className={styles.modal}>
                    <h2 className={styles.modalTitle}>Edit Remarks</h2>
                    <textarea
                        className={styles.modalTextarea}
                        value={remarks}
                        onChange={e => setRemarks(e.target.value)}
                        placeholder="Type remarks here..."
                        rows={4}
                    />
                    <div className={styles.modalButtons}>
                        <button className={styles.saveButton} onClick={handleSaveRemarks}>Save</button>
                        <button className={styles.cancelButton} onClick={closeModal}>Cancel</button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default LaboratoryClearanceRequest;
