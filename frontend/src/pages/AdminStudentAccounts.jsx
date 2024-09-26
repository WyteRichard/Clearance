import React, { useEffect, useState } from "react";
import axios from "axios";
import homeIcon from "../assets/homeIcon.svg";
import requestIcon from "../assets/Trello.svg";
import userIcon from "../assets/User.svg";
import rcLogo from "../assets/rc_logo.png";
import adminAvatar from "../assets/adminAvatar.svg";
import dateIcon from "../assets/Date.svg";
import deleteIcon from "../assets/delete.svg";
import "../styles/AdminStudentAccounts.css";

const AdminStudentAccounts = () => {
  const [students, setStudents] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [searchName, setSearchName] = useState("");
  const [searchYearLevel, setSearchYearLevel] = useState("");
  const [searchCourse, setSearchCourse] = useState("");
  const [courses, setCourses] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);

  const apiUrlStudents = "http://localhost:8080/Student/students"; // API endpoint for students
  const apiUrlCourses = "http://localhost:8080/Course/courses"; // API endpoint for courses
  const apiUrlYearLevels = "http://localhost:8080/Year/levels"; // API endpoint for year levels

  useEffect(() => {
    // Fetch student data from the API
    axios
      .get(apiUrlStudents)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the student data!", error);
      });

    // Fetch courses from the API
    axios
      .get(apiUrlCourses)
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses!", error);
      });

    // Fetch year levels from the API
    axios
      .get(apiUrlYearLevels)
      .then((response) => {
        setYearLevels(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the year levels!", error);
      });

    // Real-time clock update
    const updateDateTime = () => {
      setCurrentDateTime(new Date());
    };

    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDelete = (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      axios
        .delete(`http://localhost:8080/Student/student/${studentId}`)
        .then(() => {
          // Remove the student from the state after successful deletion
          setStudents(students.filter((student) => student.id !== studentId));
          alert("Student deleted successfully!");
        })
        .catch((error) => {
          console.error("There was an error deleting the student!", error);
          alert("Error deleting the student.");
        });
    }
  };

  // Filter students based on search inputs
  const filteredStudents = students.filter((student) => {
    const nameMatch = `${student.firstName} ${student.middleName} ${student.lastName}`.toLowerCase().includes(searchName.toLowerCase());
    const yearMatch = searchYearLevel === "" || student.yearLevel?.yearLevel === searchYearLevel;
    const courseMatch = searchCourse === "" || student.course?.courseName === searchCourse;
    return nameMatch && yearMatch && courseMatch;
  });

  return (
    <div className="student-dashboard">
      <div className="Dashboard">
        <img src={rcLogo} alt="RC LOGO" />
        <h3>ROGATIONIST COLLEGE CLEARANCE SYSTEM</h3>
        <div className="dashboard-buttons">
          <img src={homeIcon} alt="Home" />
          <a href="/admin-dashboard">Dashboard</a>
        </div>
        <div className="dashboard-buttons">
          <img src={requestIcon} alt="Request Icon" />
          <a href="/admin-dept-accounts">Department</a>
        </div>
        <div className="dashboard-buttons">
          <img src={userIcon} alt="User Icon" />
          <a href="/admin-student-accounts">Students</a>
        </div>
      </div>

      <div className="header">
        <h4>Administrator</h4>
        <h4>Admin</h4>
        <img src={adminAvatar} alt="Avatar" />
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
            className="search-input"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <div className="input-box">
          <select
            className="search-input"
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

        <div className="input-box">
          <select
            className="search-input"
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

      <div className="clearance-status">
        <h1>Student Accounts</h1>
      </div>

      <table className="clearance-table">
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
          {Array.isArray(students) && students.length > 0 ? (
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
                <td className="status-cell">
                  <img src={deleteIcon} alt="delete" onClick={() => handleDelete(student.id)} />
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
  );
};

export default AdminStudentAccounts;
