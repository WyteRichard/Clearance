import React, { useEffect, useState } from "react";
import axios from "axios";
import homeIcon from '../assets/homeIcon.svg';
import requestIcon from '../assets/Trello.svg';
import userIcon from '../assets/User.svg';
import rcLogo from '../assets/rc_logo.png';
import avatar from '../assets/Avatar.svg';
import dateIcon from '../assets/Date.svg';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
    const [clearedCount, setClearedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [remarkCount, setRemarkCount] = useState(0);
    const [currentDate, setCurrentDate] = useState(new Date());
    const studentId = 1; // Replace with the actual student ID

    useEffect(() => {
        axios.get(`http://localhost:8080/Status/student/${studentId}/status-counts`)
            .then(response => {
                const { cleared, pending, remarks } = response.data;
                setClearedCount(cleared);
                setPendingCount(pending);
                setRemarkCount(remarks);
            })
            .catch(error => {
                console.error("There was an error fetching the clearance status counts!", error);
            });
    }, [studentId]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, []);

    return (
        <div className="student-dashboard">
            <div className="Dashboard">
                <img src={rcLogo} alt="RC LOGO" />
                <h3>ROGATIONIST COLLEGE CLEARANCE SYSTEM</h3>
                <div className="dashboard-buttons">
                    <img src={homeIcon} alt="Home" />
                    <a href="/student-dashboard">Dashboard</a>
                </div>
                <div className="dashboard-buttons">
                    <img src={requestIcon} alt="Request Icon" />
                    <a href="/request-clearance">Clearance Request</a>
                </div>
                <div className="dashboard-buttons">
                    <img src={requestIcon} alt="Request Icon" />
                    <a href="/student-clearance-status">Clearance Status</a>
                </div>
                <div className="dashboard-buttons">
                    <img src={userIcon} alt="User Icon" />
                    <a href="/student-account">Account</a>
                </div>
            </div>

            <div className="header">
                <h4>Student</h4>
                <h4>Aiah Nadine Quinones Delos Reyes</h4>
                <img src={avatar} alt="Avatar" />
            </div>

            <div className="academic-year-header">
                <h2>A.Y. 2024 - 2025 - First Semester</h2>
                <img src={dateIcon} alt="date icon" />
                <h4>{currentDate.toLocaleString()}</h4> {/* Display real-time date and time */}
            </div>

            <div className="clearance-status">
                <h1>Clearance Status</h1>
            </div>

            <div className="cleared-header">
                <h4>Cleared</h4>
                <h3>{clearedCount}</h3>
            </div>

            <div className="pending-header">
                <h4>Pending</h4>
                <h3>{pendingCount}</h3>
            </div>

            <div className="remarks-header">
                <h4>Remarks</h4>
                <h3>{remarkCount}</h3>
            </div>
        </div>
    );
};

export default StudentDashboard;
