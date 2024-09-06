import React, { useState } from 'react'


const Courseitem = () => {
    const [courseCount, setCourseCount] = useState(1);
    return (
        <div class="card text-center">
            <div class="card-header">
                {Course.name}
            </div>
            <div class="card-body">
                <div className="card-body-item">
                    <h5>Instructor Name:</h5>
                    <p>{Course.instructorName}</p>
                </div>
                <div className="card-body-item">
                    <div className="card-body-item-one">
                        <h5>Duration:</h5>
                        <p>{Course.duration}</p>
                    </div>
                    <div className="card-body-item-one">
                        <h5>Location:</h5>
                        <p>{Course.location}</p>
                    </div>
                </div>
            </div>
            <div class="card-footer text-body-secondary">
                <div className="card-body-item">
                    <h5>Enrollment Status:</h5>
                    <span className={`badge text-bg-${course.enrollmentStatus === 'Open' ? 'primary' :
                        course.enrollmentStatus === 'In Progress' ? 'warning' : 'secondary'
                        }`} >{course.enrollmentStatus}</span>
                </div>
            </div>
        </div>
    )
}

export default Courseitem