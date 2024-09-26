import React, { useEffect, useState } from "react";
import axios from "axios";
import homeIcon from '../assets/homeIcon.svg';
import requestIcon from '../assets/Trello.svg';
import userIcon from '../assets/User.svg';
import rcLogo from '../assets/rc_logo.png';
import avatar from '../assets/Avatar.svg';
import Edit from '../assets/Edit.svg';
import '../styles/StudentAccount.css';

const StudentAccount = () => {
    const [student, setStudent] = useState(null);
    const studentId = 1; // Replace with the actual student ID you want to fetch

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/Student/students/${studentId}`);
                setStudent(response.data);
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        };

        fetchStudent();
    }, [studentId]);

    if (!student) {
        return <div>Loading...</div>; // Show loading state while fetching data
    }

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
                <h4>{student.firstName} {student.middleName} {student.lastName}</h4>
                <img src={avatar} alt="Avatar"/>
            </div>

            <div className="my-profile">
                <h1>My Profile</h1>
            </div>

            <div className="first-name">
                <h4>First Name</h4>
                <img src={Edit} alt="Edit Icon" />
                <h3>{student.firstName}</h3>
            </div>

            <div className="middle-name">
                <h4>Middle Name</h4>
                <img src={Edit} alt="Edit Icon" />
                <h3>{student.middleName}</h3>
            </div>

            <div className="last-name">
                <h4>Last Name</h4>
                <img src={Edit} alt="Edit Icon" />
                <h3>{student.lastName}</h3>
            </div>

            <div className="student-id">
                <h4>Student ID</h4>
                <h3>{student.studentNumber}</h3>
            </div>

            <div className="contact-number">
                <h4>Contact Number</h4>
                <img src={Edit} alt="Edit Icon" />
                <h3>{student.contactNumber}</h3>
            </div>

            <div className="email-address">
                <h4>Email Address</h4>
                <img src={Edit} alt="Edit Icon" />
                <h3>{student.email}</h3>
            </div>

            <div className="year-level">
                <h4>Year Level</h4>
                <h3>{student.yearLevel.yearLevel}</h3> {/* Accessing the yearLevel property */}
            </div>

            <div className="course">
                <h4>Course</h4>
                <h3>{student.course?.courseName}</h3> {/* Ensure course object is present */}
            </div>
        </div>
    );
};

export default StudentAccount;
