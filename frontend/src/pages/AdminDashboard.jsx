import React, { useState, useEffect } from "react";
import axios from "axios";
import homeIcon from '../assets/homeIcon.svg';
import requestIcon from '../assets/Trello.svg';
import userIcon from '../assets/User.svg';
import rcLogo from '../assets/rc_logo.png';
import adminAvatar from '../assets/adminAvatar.svg';
import dateIcon from '../assets/Date.svg';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [departmentsAccounts, setDepartmentsAccounts] = useState(0);
    const [studentsCount, setStudentsCount] = useState(0);
    const [error, setError] = useState("");
    
    const [adviserCount, setAdviserCount] = useState(0);
    const [cashierCount, setCashierCount] = useState(0);
    const [clinicCount, setClinicCount] = useState(0);
    const [clusterCoordinatorCount, setClusterCoordinatorCount] = useState(0);
    const [deanCount, setDeanCount] = useState(0);
    const [guidanceCount, setGuidanceCount] = useState(0);
    const [laboratoryCount, setLaboratoryCount] = useState(0);
    const [libraryCount, setLibraryCount] = useState(0);
    const [registrarCount, setRegistrarCount] = useState(0);
    const [spiritualAffairsCount, setSpiritualAffairsCount] = useState(0);
    const [studentAffairsCount, setStudentAffairsCount] = useState(0);
    const [prefectCount, setPrefectCount] = useState(0);
    const [councilCount, setCouncilCount] = useState(0);

    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const endpoints = [
            { url: 'http://localhost:8080/Adviser/advisers/count', setState: setAdviserCount },
            { url: 'http://localhost:8080/Cashier/cashiers/count', setState: setCashierCount },
            { url: 'http://localhost:8080/Clinic/clinics/count', setState: setClinicCount },
            { url: 'http://localhost:8080/Cluster/coordinators/count', setState: setClusterCoordinatorCount },
            { url: 'http://localhost:8080/Dean/deans/count', setState: setDeanCount },
            { url: 'http://localhost:8080/Guidance/guidances/count', setState: setGuidanceCount },
            { url: 'http://localhost:8080/Laboratory/laboratories/count', setState: setLaboratoryCount },
            { url: 'http://localhost:8080/Library/libraries/count', setState: setLibraryCount },
            { url: 'http://localhost:8080/Registrar/registrars/count', setState: setRegistrarCount },
            { url: 'http://localhost:8080/Spiritual/affairs/count', setState: setSpiritualAffairsCount },
            { url: 'http://localhost:8080/Student/affairs/count', setState: setStudentAffairsCount },
            { url: 'http://localhost:8080/Prefect/prefects/count', setState: setPrefectCount },
            { url: 'http://localhost:8080/Council/councils/count', setState: setCouncilCount }
        ];

        Promise.all(endpoints.map(({ url, setState }) => 
            axios.get(url)
                .then(response => {
                    setState(response.data);
                    return response.data; // Return the data to accumulate later
                })
                .catch(error => {
                    console.error(`Error fetching data from ${url}:`, error);
                    setError("Failed to fetch some department accounts.");
                    return 0; // Return 0 in case of an error to ensure the sum isn't affected
                })
        ))
        .then(results => {
            const totalAccounts = results.reduce((total, count) => total + count, 0);
            setDepartmentsAccounts(totalAccounts);
        });

        axios.get('http://localhost:8080/Student/students/count')
            .then(response => {
                console.log("Students count response:", response.data);
                setStudentsCount(response.data);
            })
            .catch(error => {
                console.error("Error fetching students count:", error);
                setError("Failed to fetch students count.");
            });

        // Update the date and time every second
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
                <img src={adminAvatar} alt="Avatar"/>
            </div>

            <div className="academic-year-header">
                <h2>A.Y. 2024 - 2025 - First Semester</h2>
                <img src={dateIcon} alt="date icon" />
                <h4>{currentDateTime.toLocaleString()}</h4>
            </div>

            <div className="clearance-status">
                <h1>Account Status</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="cleared-header">
                <h4>Student Accounts</h4>
                <h3>{studentsCount}</h3>
            </div>

            <div className="pending-header">
                <h4>Department Accounts</h4>
                <h3>{departmentsAccounts}</h3>
            </div>

            <div className="ssc">
                <h4>SSC Accounts</h4>
                <h3>{councilCount}</h3>
            </div>

            <div className="osa">
                <h4>Student Affairs Accounts</h4>
                <h3>{studentAffairsCount}</h3>
            </div>
            
            <div className="spiritual-affairs">
                <h4>Spiritual Affairs Accounts</h4>
                <h3>{spiritualAffairsCount}</h3>
            </div>

            <div className="prefect">
                <h4>Student Discipline Accounts</h4>
                <h3>{prefectCount}</h3>
            </div>

            <div className="guidance">
                <h4>Guidance Accounts</h4>
                <h3>{guidanceCount}</h3>
            </div>

            <div className="library">
                <h4>Library Accounts</h4>
                <h3>{libraryCount}</h3>
            </div>

            <div className="laboratory">
                <h4>Laboratory Accounts</h4>
                <h3>{laboratoryCount}</h3>
            </div>

            <div className="clinic">
                <h4>Clinic Accounts</h4>
                <h3>{clinicCount}</h3>
            </div>
            
            <div className="cashier">
                <h4>Cashier Accounts</h4>
                <h3>{cashierCount}</h3>
            </div>

            <div className="adviser">
                <h4>Adviser Accounts</h4>
                <h3>{adviserCount}</h3>
            </div>

            <div className="registrar">
                <h4>Registrar's Office Accounts</h4>
                <h3>{registrarCount}</h3>
            </div>

            <div className="cluster-coordinator">
                <h4>Cluster Coordinator Accounts</h4>
                <h3>{clusterCoordinatorCount}</h3>
            </div>

            <div className="dean">
                <h4>Dean/TED-Director Accounts</h4>
                <h3>{deanCount}</h3>
            </div>
        </div>
    );
};

export default AdminDashboard;
