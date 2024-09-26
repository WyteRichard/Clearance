import React, { useState, useEffect } from "react";
import axios from "axios";
import homeIcon from '../assets/homeIcon.svg';
import requestIcon from '../assets/Trello.svg';
import userIcon from '../assets/User.svg';
import rcLogo from '../assets/rc_logo.png';
import avatar from '../assets/Avatar.svg';
import dateIcon from '../assets/Date.svg';
import '../styles/RequestClearance.css';

const RequestClearance = () => {
    const [semester, setSemester] = useState("FIRST");
    const [schoolYear, setSchoolYear] = useState("2024-2025");
    const [graduating, setGraduating] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const handleSemesterChange = (e) => {
        setSemester(e.target.value);
    };

    const handleSchoolYearChange = (e) => {
        setSchoolYear(e.target.value);
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
                id: 1 // Replace with the actual department ID
            },
            semester: semester,
            schoolYear: schoolYear,
            graduating: graduating,
        };

        try {
            const response = await axios.post("http://localhost:8080/Requests/add", clearanceRequest);
            if (response.status === 201) {
                alert("Clearance request successfully added");
            } else {
                alert("Failed to add clearance request");
            }
        } catch (error) {
            console.error("There was an error sending the request!", error);
            alert("Error adding clearance request");
        }
    };

    const getAcademicYearDisplay = () => {
        const [startYear, endYear] = schoolYear.split('-');
        return `A.Y. ${startYear} - ${endYear} - ${semester === "FIRST" ? "First Semester" : "Second Semester"}`;
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // Cleanup the timer on component unmount
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
                <img src={avatar} alt="Avatar"/>
            </div>

            <div className="academic-year-header">
                <h2>{getAcademicYearDisplay()}</h2>
                <img src={dateIcon} alt="date icon" />
                <h4>{currentTime.toLocaleString()}</h4>
            </div>

            <div className="request-clearance-container">
                <h1>Request Clearance</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <label htmlFor="semester">Semester</label>
                        <select
                            className="filter-button"
                            value={semester}
                            onChange={handleSemesterChange}
                        >
                            <option value="FIRST">First Semester</option>
                            <option value="SECOND">Second Semester</option>
                        </select>
                    </div>

                    <div className="input-box">
                        <label htmlFor="schoolYear">School Year</label>
                        <select
                            className="filter-button"
                            value={schoolYear}
                            onChange={handleSchoolYearChange}
                        >
                            <option value="2024-2025">2024-2025</option>
                            <option value="2025-2026">2025-2026</option>
                            <option value="2026-2027">2026-2027</option>
                            <option value="2027-2028">2027-2028</option>
                        </select>
                    </div>

                    <div className="input-box">
                        <label htmlFor="graduating">Graduating</label>
                        <select
                            className="filter-button"
                            value={graduating ? "Yes" : "No"}
                            onChange={handleGraduatingChange}
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                    <button type="submit">Request</button>
                </form>
            </div>
        </div>
    );
};

export default RequestClearance;
