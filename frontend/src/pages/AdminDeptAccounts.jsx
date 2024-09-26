import React, { useEffect, useState } from "react";
import axios from "axios";
import homeIcon from '../assets/homeIcon.svg';
import requestIcon from '../assets/Trello.svg';
import userIcon from '../assets/User.svg';
import rcLogo from '../assets/rc_logo.png';
import adminAvatar from '../assets/adminAvatar.svg';
import dateIcon from '../assets/Date.svg';
import deleteIcon from '../assets/delete.svg';
import '../styles/AdminDeptAccounts.css';

const AdminDashboard = () => {
    const [advisers, setAdvisers] = useState([]);
    const [cashiers, setCashiers] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [clusterCoordinators, setClusterCoordinators] = useState([]);
    const [deans, setDeans] = useState([]);
    const [guidances, setGuidances] = useState([]);
    const [laboratories, setLaboratories] = useState([]);
    const [libraries, setLibraries] = useState([]);
    const [registrars, setRegistrars] = useState([]);
    const [spiritualAffairs, setSpiritualAffairs] = useState([]);
    const [studentAffairs, setStudentAffairs] = useState([]);
    const [studentDisciplines, setStudentDisciplines] = useState([]);
    const [supremeStudentCouncils, setSupremeStudentCouncils] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    // State for search term
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("");

    const apiUrl = "http://localhost:8080/Dashboard/accounts";

    useEffect(() => {
        axios.get(apiUrl)
            .then(response => {
                const {
                    advisers,
                    cashiers,
                    clinics,
                    clusterCoordinators,
                    deans,
                    guidances,
                    laboratories,
                    libraries,
                    registrars,
                    spiritualAffairs,
                    studentAffairs,
                    studentDisciplines,
                    supremeStudentCouncils
                } = response.data;

                setAdvisers(advisers.map(item => ({ ...item, type: 'Adviser' })));
                setCashiers(cashiers.map(item => ({ ...item, type: 'Cashier' })));
                setClinics(clinics.map(item => ({ ...item, type: 'Clinic' })));
                setClusterCoordinators(clusterCoordinators.map(item => ({ ...item, type: 'ClusterCoordinator' })));
                setDeans(deans.map(item => ({ ...item, type: 'Dean' })));
                setGuidances(guidances.map(item => ({ ...item, type: 'Guidance' })));
                setLaboratories(laboratories.map(item => ({ ...item, type: 'Laboratory' })));
                setLibraries(libraries.map(item => ({ ...item, type: 'Library' })));
                setRegistrars(registrars.map(item => ({ ...item, type: 'Registrar' })));
                setSpiritualAffairs(spiritualAffairs.map(item => ({ ...item, type: 'SpiritualAffairs' })));
                setStudentAffairs(studentAffairs.map(item => ({ ...item, type: 'StudentAffairs' })));
                setStudentDisciplines(studentDisciplines.map(item => ({ ...item, type: 'StudentDiscipline' })));
                setSupremeStudentCouncils(supremeStudentCouncils.map(item => ({ ...item, type: 'SupremeStudentCouncil' })));
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });

        const updateDateTime = () => {
            setCurrentDateTime(new Date());
        };

        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const getDepartmentName = (entity) => {
        return entity.department ? entity.department.name : "N/A";
    };

    const getType = (entity) => {
        return entity.type || "Unknown";
    };

    // Combined department data
    const allDepartments = [
        ...advisers,
        ...cashiers,
        ...clinics,
        ...clusterCoordinators,
        ...deans,
        ...guidances,
        ...laboratories,
        ...libraries,
        ...registrars,
        ...spiritualAffairs,
        ...studentAffairs,
        ...studentDisciplines,
        ...supremeStudentCouncils
    ];

    // Handle search logic
    const filteredDepartments = allDepartments.filter(person => {
        const fullName = `${person.firstName} ${person.middleName ? person.middleName + ' ' : ''}${person.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    const handleDelete = (id, type) => {
        const endpointMap = {
            'Adviser': `/Adviser/advisers/${id}`,
            'Cashier': `/Cashier/cashiers/${id}`,
            'Clinic': `/Clinic/clinics/${id}`,
            'ClusterCoordinator': `/Cluster/coordinators/${id}`,
            'Dean': `/Dean/deans/${id}`,
            'Guidance': `/Guidance/guidances/${id}`,
            'Laboratory': `/Laboratory/laboratories/${id}`,
            'Library': `/Library/libraries/${id}`,
            'Registrar': `/Registrar/registrars/${id}`,
            'SpiritualAffairs': `/Spiritual/affairs/${id}`,
            'StudentAffairs': `/Student/affairs/${id}`,
            'StudentDiscipline': `/Prefect/prefects/${id}`,
            'SupremeStudentCouncil': `/Council/councils/${id}`
        };

        const endpoint = endpointMap[type];

        if (endpoint) {
            axios.delete(`http://localhost:8080${endpoint}`)
                .then(response => {
                    console.log('Item deleted successfully');
                    window.location.reload(); // Simple way to refresh data, consider more sophisticated approach
                })
                .catch(error => {
                    console.error("There was an error deleting the item!", error);
                });
        } else {
            console.error("Unknown type:", type);
        }
    };

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
                        id="searchInput"
                        className="search-input"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Other filters can remain here if needed */}
                <div className="input-box">
                    <select
                        className="filter-button"
                        defaultValue=""
                        id="statusFilter"
                        onChange={e => setFilterType(e.target.value)}
                    >
                        <option value="" disabled>Filter Type</option>
                        <option value="">All</option>
                        <option value="ssc">SSC</option>
                        <option value="osa">Student Affairs</option>
                        <option value="spiritual-affairs">Spiritual Affairs</option>
                        <option value="prefect">Student Discipline</option>
                        <option value="guidance">Guidance</option>
                        <option value="library">Library</option>
                        <option value="laboratory">Laboratory</option>
                        <option value="clinic">Clinic</option>
                        <option value="cashier">Cashier</option>
                        <option value="adviser">Adviser</option>
                        <option value="coordinator">Cluster Coordinator</option>
                        <option value="registrar">Registrar</option>
                        <option value="dean">Dean</option>
                    </select>
                </div>
            </div>

            <div className="clearance-status">
                <h1>Department Accounts</h1>
            </div>

            <table className="clearance-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Department</th>
                        <th>Name</th>
                        <th>Employee Number</th>
                        <th>Address</th>
                        <th>Contact Number</th>
                        <th>Email</th>
                        <th>Civil Status</th>
                        <th>Birthday</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDepartments.map(person => (
                        <tr key={person.id}>
                            <td>{person.id}</td>
                            <td>{getType(person)}</td>
                            <td>{person.firstName} {person.middleName || ''} {person.lastName}</td>
                            <td>{person.employeeNumber || ''} {person.deanNumber || ''} {person.supremeStudentCouncilNumber || ''}</td>
                            <td>{person.address || "N/A"}</td>
                            <td>{person.contactNumber || "N/A"}</td>
                            <td>{person.email || "N/A"}</td>
                            <td>{person.civilStatus || "N/A"}</td>
                            <td>{person.birthdate ? new Date(person.birthdate).toLocaleDateString() : "N/A"}</td>
                            <td>
                                <img
                                    src={deleteIcon}
                                    alt="Delete"
                                    className="action-icon"
                                    onClick={() => handleDelete(person.id, getType(person))}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
