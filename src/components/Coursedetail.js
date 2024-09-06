import React from 'react'

const Coursedetail = (props) => {
    return (
        <div class="card text-center">
            <div class="card-header">
                {props.course.name}
            </div>
            <div class="card-body">
                <div className="card-body-item">
                    <h5>Instructor Name:</h5>
                    <p>{props.course.instructorName}</p>
                </div>
                <div className="card-body-item">
                    <h5>Description:</h5>
                    <p>{props.course.description}</p>
                </div>
                <div className="card-body-item">
                    <h5>Duration:</h5>
                    <p>{props.course.duration}</p>
                </div>
                <div className="card-body-item">
                    <h5>Schedule:</h5>
                    <p>{props.course.schedule}</p>
                </div>
                <div className="card-body-item">
                    <h5>Location:</h5>
                    <p>{props.course.location}</p>
                </div>
                <div className="card-body-item">
                    {
                        props.course.prerequisites.map((prerequisite) => {
                            <div className="course-preq">
                                {courseCount}. {prerequisite}
                                setCourseCount(courseCount + 1);
                            </div>
                        })
                    }
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button
                            class="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                        >
                            Syllabus
                        </button>
                    </h2>
                    <div
                        id="collapseOne"
                        class="accordion-collapse collapse show"
                        data-bs-parent="#accordionExample"
                    >
                        <div class="accordion-body">
                            {
                                <div className="course-item">
                                    <div className="card-body-item">
                                        <h5>Week:</h5>
                                        <p>{course.syllabus.week}</p>
                                    </div>
                                    <div className="card-body-item">
                                        <h5>Topic:</h5>
                                        <p>{course.syllabus.topic}</p>
                                    </div>
                                    <div className="card-body-item">
                                        <h5>Content:</h5>
                                        <p>{course.syllabus.content}</p>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer text-body-secondary">
                <div className="card-body-item">
                    <h5>Enrollment Status:</h5>
                    <span className = {`badge text-bg-${course.enrollmentStatus==='Open'?'primary':
                        course.enrollmentStatus==='In Progress'?'warning':'secondary'
                    }`} >{course.enrollmentStatus}</span>
                </div>
            </div>
        </div>
    )
}

export default Coursedetail