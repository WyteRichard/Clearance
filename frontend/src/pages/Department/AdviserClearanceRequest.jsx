import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import styles from '../../styles/DepartmentClearanceRequest.module.css';
import homeIcon from '../../assets/home.png';
import requestIcon from '../../assets/bnotes.png';
import clearedtoggle from '../../assets/clearedtoggle.svg';
import pendingtoggle from '../../assets/pendingtoggle.svg';
import avatar from '../../assets/avatar.png';

const AdviserClearanceRequest = () => {
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
    const [currentSemester, setCurrentSemester] = useState("Loading...");
    const [currentAcademicYear, setCurrentAcademicYear] = useState("Loading...");
    const [showModal, setShowModal] = useState(false);
    
    const navigate = useNavigate();

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

    useEffect(() => {
        Modal.setAppElement('#root'); // Set app element for modal
    }, []);

    // Fetch clearance requests, year levels, and courses
    useEffect(() => {
        const fetchClearanceRequests = async () => {
            try {
                const departmentId = 1; // Clinic department ID
                const requestResponse = await axios.get(`http://localhost:8080/Requests/department/${departmentId}`);
                const requestsData = Array.isArray(requestResponse.data) ? requestResponse.data : [];

                // Fetch remarks for all requests
                const requestsWithRemarks = await Promise.all(
                    requestsData.map(async (request) => {
                        try {
                            const remarksResponse = await axios.get(`http://localhost:8080/Status/${request.id}`);
                            return { ...request, remarks: remarksResponse.data?.remarks || '' };
                        } catch (error) {
                            console.error(`Error fetching remarks for request ${request.id}:`, error);
                            return { ...request, remarks: 'Error fetching remarks' };
                        }
                    })
                );

                // Load saved statuses from local storage
                const savedStatuses = JSON.parse(localStorage.getItem('clearanceStatuses')) || {};

                // Merge the statuses from local storage with the fetched requests
                const requestsWithStatuses = requestsWithRemarks.map(request => ({
                    ...request,
                    status: savedStatuses[request.id] || request.status
                }));

                setClearanceRequests(requestsWithStatuses);
                setFilteredRequests(requestsWithStatuses); // Initially, all requests are displayed
            } catch (error) {
                console.error("Error fetching clinic clearance requests:", error);
            }
        };

        fetchClearanceRequests();

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
                    request.id === id ? { ...request, status: updatedStatus.status } : request
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    // Open modal and set selected request
    const openModal = (request) => {
        setSelectedRequest(request);
        setRemarks(request.remarks || '');
        setIsModalOpen(true);
    };

    const handleSaveRemarks = async () => {
        if (selectedRequest) {
            try {
                // Send both status and remarks fields in the PUT request
                const response = await axios.put(`http://localhost:8080/Status/update-status/${selectedRequest.id}`, {
                    status: selectedRequest.status,  // Use the current status
                    remarks: remarks || ''  // Send empty string if remarks is null or empty
                });
    
                const updatedRemarks = response.data.remarks;
    
                // Update the local state with the updated remarks
                setClearanceRequests(prevRequests =>
                    prevRequests.map(request =>
                        request.id === selectedRequest.id ? { ...request, remarks: updatedRemarks } : request
                    )
                );
    
                // Close the modal after saving
                setIsModalOpen(false);
    
            } catch (error) {
                console.error("Error updating remarks:", error);
                alert("Failed to update remarks. Please try again.");
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
                </div>
                <nav className={styles.nav}>
                    <button className={styles.ghostButton} onClick={() => navigate('/adviser-dashboard')}>
                        <img src={homeIcon} alt="Dashboard" className={styles.navIcon} />
                        Dashboard
                    </button>
                    <button className={styles.whiteButton} onClick={() => navigate('/adviser-request-clearance')}>
                        <img src={requestIcon} alt="Clearance Request" className={styles.navIcon} />
                        Clearance Request
                    </button>
                </nav>
            </div>
            <div className={styles.mainContent}>
                <header className={styles.header}>
                    <h2 className={styles.dashboardTitle}>Adviser Clearance Requests</h2>
                    <div className={styles.headerRight}>
                    <span className={styles.academicYear}>A.Y. {currentAcademicYear}</span> {/* Display the fetched academic year */}
                    <span className={styles.semesterBadge}>{currentSemester.replace('_', ' ')}</span>
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
                                <th>Action</th>
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
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </td>
                                    <td>{request.remarks}</td> {/* No more "Loading remarks..." */}
                                    <td>
                                        <button className={styles.editButton} onClick={() => openModal(request)}>Edit</button>
                                    </td>
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

export default AdviserClearanceRequest;
