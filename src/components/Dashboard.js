import React from 'react'
import Student from '../../backend/models/Student'

const Dashboard = () => {
    return (
        <div className="student-details">
            <div className="personal-details">
                <div className="personal-item">
                    <h5>Name:</h5>
                    <p>{Student.name}</p>
                </div>
                <div className="personal-item">
                    <h5>Email:</h5>
                    <p>{Student.email}</p>
                </div>
                <div className="personal-item">
                    <h5>No. of courses enrolled:</h5>
                    <p></p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard