import React from "react";
import '../styles/CreateAccount.css'
import rcLogo from '../assets/rc_logo.png';

const CreateAccount = () => {
    return (
        <div className="create-account-page">
            <div className="create-account-container">
                <img src={rcLogo} alt="RC LOGO"/>
                <h1>Create an Account</h1>
                <div className="input-box">
                    <label>First Name</label>
                    <input type="text" required/>
                </div>
                <div className="input-box">
                    <label>Middle Name</label>
                    <input type="text" required/>
                </div>
                <div className="input-box">
                    <label>Last Name</label>
                    <input type="text" required/>
                </div>
                <div className="input-box">
                    <label>Contact Number</label>
                    <input type="text" required/>
                </div>
                <div className="input-box">
                    <label>Email</label>
                    <input type="email" required/>
                </div>
                <div className="input-box">
                    <label>Student ID</label>
                    <input type="text" required/>
                </div>
                <div className="input-box">
                    <label htmlFor="yearLevel">Year Level</label>
                    <select className="filter-button" defaultValue="Year Level">
                        <option disabled>Year Level</option>
                        <option>First Year</option>
                        <option>Second Year</option>
                        <option>Third Year</option>
                        <option>Fourth Year</option>
                    </select>
                </div>
                <div className="input-box">
                    <label htmlFor="course">Course</label>
                    <select className="filter-button" defaultValue="Course">
                        <option disabled>Course</option>
                        <option>Bachelor of Science in Accountancy</option>
                        <option>Bachelor of Science in Tourism Management</option>
                        <option>Bachelor of Science in Hospitality Management</option>
                        <option>Bachelor of Science in Business Administration - Marketing</option>
                        <option>Bachelor of Science in Information Technology</option>
                        <option>Bachelor of Science in Industrial Technology</option>
                        <option>Bachelor of Science in Electronics Engineering</option>
                    </select>
                </div>
                <button type="submit">Create Account</button>
                <div className="account-registered">
                    <a href="#">Already have an account? Click here.</a>
                </div>
            </div>
        </div>
    );
};

export default CreateAccount;
