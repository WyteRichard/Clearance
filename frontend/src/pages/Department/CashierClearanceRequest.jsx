import React, { useState, useEffect } from "react";
import axios from "axios";
import homeIcon from '../../assets/homeIcon.svg';
import requestIcon from '../../assets/Trello.svg';
import rcLogo from '../../assets/rc_logo.png';
import sscIcon from '../../assets/sscIcon.svg';
import dateIcon from '../../assets/Date.svg';
import clearedtoggle from '../../assets/clearedtoggle.svg';
import pendingtoggle from '../../assets/pendingtoggle.svg';
import '../../styles/DepartmentClearanceRequest.css';

const CashierClearanceRequest = () => {
    const [clearanceRequests, setClearanceRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [yearLevelFilter, setYearLevelFilter] = useState("");
    const [courseFilter, setCourseFilter] = useState("");

    const [yearLevels, setYearLevels] = useState([]);
    const [courses, setCourses] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    // Fetch clearance requests data
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
    }, []);

    // Fetch year levels and courses data
    useEffect(() => {
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

    // Update date and time every second
    useEffect(() => {
        const updateDateTime = () => {
            setCurrentDateTime(new Date());
        };

        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Handle search and filters
    useEffect(() => {
        let filtered = Array.isArray(clearanceRequests) ? clearanceRequests : [];

        if (searchTerm) {
            const searchTerms = searchTerm.toLowerCase().split(/\s+/); // Split search term into parts

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

    const toggleStatus = async (id, currentStatus) => {
        const normalizedStatus = currentStatus ? currentStatus.toLowerCase() : "pending"; // Default to "pending" if status is undefined
        const newStatus = normalizedStatus === "cleared" ? "PENDING" : "CLEARED";
        
        try {
            const response = await axios.put(`http://localhost:8080/Status/update-status/${1}`, {
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

    return (
        <div className="student-dashboard">
            <div className="Dashboard">
                <img src={rcLogo} alt="RC LOGO" />
                <h3>ROGATIONIST COLLEGE CLEARANCE SYSTEM</h3>
                <div className="dashboard-buttons">
                    <img src={homeIcon} alt="Home" />
                    <a href="/department-dashboard">Dashboard</a>
                </div>
                <div className="dashboard-buttons">
                    <img src={requestIcon} alt="Request Icon" />
                    <a href="#">Clearance Request</a>
                </div>
            </div>

            <div className="header">
                <h4>CASHIER</h4>
                <h4>CASHIER</h4>
                <img src={sscIcon} alt="Avatar" />
            </div>

            <div className="academic-year-header">
                <h2>A.Y. 2024 - 2025 - First Semester</h2>
                <img src={dateIcon} alt="date icon" />
                <h4>{currentDateTime.toLocaleString()}</h4>
            </div>

            <div className="filter-container">
                <div className="input-box">
                    <input 
                        type="text" 
                        id="searchInput" 
                        className="search-input" 
                        placeholder="Search by name" 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="input-box">
                    <select 
                        className="filter-button" 
                        defaultValue="" 
                        id="statusFilter" 
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="" disabled>Filter Type</option>
                        <option value="cleared">Cleared</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                <div className="input-box">
                    <select 
                        className="filter-button" 
                        defaultValue="" 
                        id="yearLevel" 
                        onChange={e => setYearLevelFilter(e.target.value)}
                    >
                        <option value="" disabled>Year Level</option>
                        {yearLevels.map(level => (
                            <option key={level.yearLevelId} value={level.yearLevel}>
                                {level.yearLevel}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-box">
                    <select 
                        className="filter-button" 
                        defaultValue="" 
                        id="courseFilter" 
                        onChange={e => setCourseFilter(e.target.value)}
                    >
                        <option value="" disabled>Course</option>
                        {courses.map(course => (
                            <option key={course.courseId} value={course.courseName}>
                                {course.courseName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="clearance-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Year Level</th>
                            <th>Course</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
    {Array.isArray(filteredRequests) && filteredRequests.length > 0 ? (
        filteredRequests.map(request => (
            <tr key={request.id}>
                <td>{request.student?.studentNumber || 'N/A'}</td>
                <td>{`${request.student?.firstName || ''} ${request.student?.middleName || ''} ${request.student?.lastName || ''}`}</td>
                <td>{request.student?.yearLevel?.yearLevel || 'N/A'}</td>
                <td>{request.student?.course?.courseName || 'N/A'}</td>
                <td>
                    <img 
                        src={(request.status?.toLowerCase() === "cleared") ? clearedtoggle : pendingtoggle} 
                        alt={request.status || 'Unknown Status'} 
                        onClick={() => toggleStatus(request.id, request.status)} 
                        style={{ cursor: 'pointer' }}
                    />
                </td>
                <td>
                    {request.clearanceStatuses?.length > 0
                    ? request.clearanceStatuses.find(status => status.student?.studentId === request.student?.studentid)?.remarks || 'N/A'
                    : 'N/A'}
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="6">No clearance requests available.</td>
        </tr>
    )}
</tbody>

                </table>
            </div>
        </div>
    );
};

export default CashierClearanceRequest;
