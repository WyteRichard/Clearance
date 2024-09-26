import React, { useEffect, useState } from 'react';
import axios from 'axios';
import homeIcon from '../assets/homeIcon.svg';
import requestIcon from '../assets/Trello.svg';
import rcLogo from '../assets/rc_logo.png';
import sscIcon from '../assets/sscIcon.svg';
import dateIcon from '../assets/Date.svg';
import avatar from '../assets/User.svg';
import printIcon from '../assets/printIcon.svg';
import '../styles/StudentClearanceStatus.css';

const StudentClearanceStatus = () => {
    const [clearanceStatuses, setClearanceStatuses] = useState([]);
    const [filteredStatuses, setFilteredStatuses] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    
    // Replace with the actual student ID you want to fetch data for
    const studentId = 1;

    useEffect(() => {
        axios.get(`http://localhost:8080/Status/student/${studentId}`)
            .then(response => {
                const data = response.data;
                const statuses = Object.values(data);
                setClearanceStatuses(statuses);
                setFilteredStatuses(statuses);
            })
            .catch(error => {
                console.error('Error fetching clearance statuses:', error);
            });

        const updateDateTime = () => {
            setCurrentDateTime(new Date());
        };

        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId);

    }, [studentId]);

    useEffect(() => {
        if (statusFilter === '') {
            setFilteredStatuses(clearanceStatuses);
        } else {
            setFilteredStatuses(clearanceStatuses.filter(status => status.status.toLowerCase() === statusFilter));
        }
    }, [statusFilter, clearanceStatuses]);

    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

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
                    <img src={avatar} alt="avatar" />
                    <a href="/student-account">Account</a>
                </div>
            </div>

            <div className="header">
                <h4>Supreme Student Council</h4>
                <h4>SSC</h4>
                <img src={sscIcon} alt="Avatar" />
            </div>

            <div className="academic-year-header">
                <h2>A.Y. 2024 - 2025 - First Semester</h2>
                <img src={dateIcon} alt="date icon" />
                <h4>{currentDateTime.toLocaleString()}</h4>
            </div>

            <div className="filter-container">
                <div className="input-box">
                    <select className="filter-button" value={statusFilter} onChange={handleFilterChange}>
                        <option value="">Filter Type</option>
                        <option value="cleared">Cleared</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="clearance-table">
                    <thead>
                        <tr>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStatuses.map((status, index) => (
                            <tr key={index}>
                                <td>{status.department}</td>
                                <td>{status.status}</td>
                                <td>{status.remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="print-buttons">
                    <img src={printIcon} alt="Print Icon" />
                    <a href="#">Print Clearance</a>
                </div>
            </div>
        </div>
    );
};

export default StudentClearanceStatus;
