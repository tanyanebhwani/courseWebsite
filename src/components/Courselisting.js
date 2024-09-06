import React from 'react'

const Courselisting = () => {
    return (
        <div>
            <h2 className='course-head'>Course Details</h2>
            <div className={`container my-3 ${courses.length === 0 ? '' : 'd-none'} `}>
            {courses.length === 0 && 'No courses to display'}
            </div>
            <div className="course-items">
            {
              courses.map((course) => {
                return <Courseitem key={course._id} />;
            })}
            </div>
        </div>
    )
}

export default Courselisting