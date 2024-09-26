import React, { useState, useEffect } from "react";
import axios from "axios";
import homeIcon from '../../assets/homeIcon.svg';
import requestIcon from '../../assets/Trello.svg';
import rcLogo from '../../assets/rc_logo.png';
import sscIcon from '../../assets/sscIcon.svg';
import dateIcon from '../../assets/Date.svg';
import '../../styles/DepartmentDashboard.css';

const StudentDisciplineDashboard = () => {
    const [counts, setCounts] = useState({
        clearanceRequests: 0,
        cleared: 0,
        pending: 0
    });
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // Fetch the status counts
                const statusResponse = await axios.get(`http://localhost:8080/Status/status-counts`);
                
                // Log status counts for debugging
                console.log('Status Response:', statusResponse.data);

                // Fetch the total clearance requests count using the new endpoint
                const clearanceResponse = await axios.get('http://localhost:8080/Requests/count');
                const clearanceRequestsCount = clearanceResponse.data; // Assuming the API returns the count directly

                // Log clearance requests count for debugging
                console.log('Clearance Requests Count:', clearanceRequestsCount);

                setCounts({
                    clearanceRequests: clearanceRequestsCount,
                    cleared: statusResponse.data.cleared,
                    pending: statusResponse.data.pending
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchCounts();

        // Update the current date and time every second
        const updateDateTime = () => {
            setCurrentDateTime(new Date());
        };

        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="student-dashboard">
            <div className="Dashboard">
                <img src={rcLogo} alt="RC LOGO" />
                <h3>ROGATIONIST COLLEGE CLEARANCE SYSTEM</h3>
                <div className="dashboard-buttons">
                    <img src={homeIcon} alt="Home" />
                    <a href="#">Dashboard</a>
                </div>
                <div className="dashboard-buttons">
                    <img src={requestIcon} alt="Request Icon" />
                    <a href="/department-clearance-request">Clearance Request</a>
                </div>
            </div>

            <div className="header">
                <h4>STUDENT DISCIPLINE</h4>
                <h4>STUDENT DISCIPLINE</h4>
                <img src={sscIcon} alt="Avatar"/>
            </div>

            <div className="academic-year-header">
                <h2>A.Y. 2024 - 2025 - First Semester</h2>
                <img src={dateIcon} alt="date icon" />
                <h4>{currentDateTime.toLocaleString()}</h4>
            </div>

            <div className="clearance-status">
                <h1>Clearance Status</h1>
            </div>

            <div className="cleared-header">
                <h4>Clearance Requests</h4>
                <h3>{counts.clearanceRequests}</h3>
            </div>

            <div className="pending-header">
                <h4>Cleared</h4>
                <h3>{counts.cleared}</h3>
            </div>

            <div className="remarks-header">
                <h4>Pending</h4>
                <h3>{counts.pending}</h3>
            </div>
        </div>
    );
};

export default StudentDisciplineDashboard;
