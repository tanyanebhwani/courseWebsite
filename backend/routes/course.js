const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Course = require('../models/Course');
const Student = require('../models/Student');
const fetchAdmin = require('../middleware/fetchAdmin');
const fetchStudent = require('../middleware/fetchStudent');
const { body, validationResult } = require('express-validator');
var dotenv = require('dotenv');
dotenv.config();
//Route 1:Get course details using: GET "/api/course/fetchallcoursesbyadmin", Admin Login required.
router.get('/fetchallcoursesbyadmin', fetchAdmin, async (req, res) => {
    let success = false;
    try {
        const courses = await Course.find({});
        success = true;
        res.json({ success, courses });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
})
// ROUTE 2: Add a new course using: POST "/api/course/addcourse". Login by admin required
router.post('/addcourse', fetchAdmin, [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('instructor', 'Enter a valid full name')
        .custom(value => {
            const parts = value.trim().split(' ');
            if (parts.length !== 2) {
                throw new Error('Full name must contain a first and last name separated by a space.');
            }
            const [firstName, lastName] = parts;
            if (firstName.length < 3) {
                throw new Error('First name must be at least 3 characters long.');
            }
            if (lastName.length < 1) {
                throw new Error('Last name must be at least a character long.');
            }
            return true;
        }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
    body('enrollmentStatus', 'Please enter valid enrollment status').exists(),
    body('thumbnail', 'Please enter valid path for the picture').exists(),
    body('duration', 'Please enter valid duration').exists(),
    body('location', 'Please enter valid location').exists(),
    body('prerequisites').isArray().withMessage('Prerequisites should be an array'),
    body('schedule', 'Please enter valid schedule').exists(),
    body('prerequisites', 'Please enter valid prequisites').exists()
        .custom((value) => {
            if (value.some(prerequisite => prerequisite.trim() === '')) {
                throw new Error('Enter valid prerequisite, empty strings are not allowed.');
            }
            return true;
        }),
], async (req, res) => {
    let success = false;
    try {
        const { name, instructor, description, enrollmentStatus, thumbnail, duration, location, prerequisites, schedule } = req.body;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        if (req.admin.id !== process.env.ADMIN_ID) {
            return res.status(401).send("Not Allowed");
        }
        const course = new Course({
            name, instructor, description, enrollmentStatus, thumbnail, duration, location, prerequisites, schedule
        })
        const savedCourse = await course.save()
        success = true;
        res.json({ success, savedCourse });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
// ROUTE 2: Update course using: POST "/api/course/updatecourse". Login by admin required
router.put('/updatecourse/:id', fetchAdmin, [body('name', 'Enter a valid name').isLength({ min: 3 }),
body('instructor', 'Enter a valid full name')
    .custom(value => {
        const parts = value.trim().split(' ');
        if (parts.length !== 2) {
            throw new Error('Full name must contain a first and last name separated by a space.');
        }
        const [firstName, lastName] = parts;
        if (firstName.length < 3) {
            throw new Error('First name must be at least 3 characters long.');
        }
        if (lastName.length < 1) {
            throw new Error('Last name must be at least a character long.');
        }
        return true;
    }),
body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
body('enrollmentStatus', 'Please enter valid enrollment status').exists(),
body('thumbnail', 'Please enter valid path for the picture').exists(),
body('duration', 'Please enter valid duration').exists(),
body('location', 'Please enter valid location').exists(),
body('prerequisites').isArray().withMessage('Prerequisites should be an array'),
body('schedule', 'Please enter valid schedule').exists(),
body('prerequisites', 'Please enter valid prequisites').exists()
    .custom((value) => {
        if (value.some(prerequisite => prerequisite.trim() === '')) {
            throw new Error('Enter valid prerequisite, empty strings are not allowed.');
        }
        return true;
    })], async (req, res) => {
        let success = false;
        try {
            const { name, instructor, description, enrollmentStatus, thumbnail, duration, location, prerequisites } = req.body;
            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success, errors: errors.array() });
            }
            if (req.admin.id !== process.env.ADMIN_ID) {
                return res.status(401).send("Not Allowed");
            }
            const newCourse = {};
            if (name) {
                newCourse.name = name;
            }
            if (instructor) {
                newCourse.instructor = instructor;
            }
            if (description) {
                newCourse.description = description;
            }
            if (enrollmentStatus) {
                newCourse.enrollmentStatus = enrollmentStatus;
            }
            if (thumbnail) {
                newCourse.thumbnail = thumbnail;
            }
            if (duration) {
                newCourse.duration = duration;
            }
            if (location) {
                newCourse.location = location;
            }
            if (prerequisites) {
                newCourse.prequisites = prerequisites;
            }
            //check the course to be updated and update it
            let course = await Course.findById(req.params.id);
            if (!course) {
                return res.status(404).send("Not Found");
            }
            course = await Course.findByIdAndUpdate(req.params.id, { $set: newCourse }, { new: true });
            success = true;
            res.json({ success, course });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })
// ROUTE 4: Delete course using: DELETE "/api/course/deletecourse". Login by Admin required
router.delete('/deletecourse/:id', fetchAdmin, async (req, res) => {
    let success = false;
    try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        if (process.env.ADMIN_ID !== req.admin.id) {
            return res.status(401).send("Not Allowed");
        }
        //find the course to be deleted and delete it
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).send("Not Found");
        }
        course = await Course.findByIdAndDelete(req.params.id);
        success = true;
        res.json({ success, course });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
/*Student side endpoints*/
//Route 5:Get course details using: GET "/api/course/fetchallcoursesbystudent", No Login required.
router.get('/fetchallcoursesbystudent', async (req, res) => {
    let success = false;
    try {
        const courses = await Course.find({});
        success = true;
        res.json({ success, courses });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
})
// ROUTE 2: Enroll in an existing course using: POST "/api/course/enroll". Login by student required
router.post('/enroll/:id', fetchStudent, async (req, res) => {
    let success = false;
    try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).send("Not Found");
        }
        if (!req.student) {
            return res.status(404).send("Not Allowed");
        }
        let student = await Student.findById(req.student.id);
        if (!student) {
            return res.status(404).send("Not Allowed");
        }
        let courseId = new mongoose.Types.ObjectId(req.params.id);
        let studentId = new mongoose.Types.ObjectId(req.student.id);
        if (course.students.some(studentIdInCourse => studentIdInCourse.equals(studentId))) {
            return res.status(401).send("Not Allowed");
        }
        if (student.courses.some(courseIdInStudent => courseIdInStudent["courseId"].equals(courseId))) {
            return res.status(401).send("Not Allowed");
        }
        student.courses.push({courseId:courseId,completionStatus:'nc'});
        let newStudent = {courses: student.courses};
        savedStudent = await Student.findByIdAndUpdate(req.student.id, { $set: newStudent }, { new: true });
        course.students.push(studentId);
        let newCourse = {students: course.students};
        savedCourse = await Course.findByIdAndUpdate(req.params.id, { $set: newCourse }, { new: true });
        success = true;
        res.json({ success, savedCourse,savedStudent });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
router.post('/unenroll/:id', fetchStudent, async (req, res) => {
    let success = false;
    try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).send("Not Found");
        }
        let student = await Student.findById(req.student.id);
        if (!student) {
            return res.status(404).send("Not Allowed");
        }
        if (!student.courses.some(courseIdInStudent => (courseIdInStudent["courseId"].toString()) === req.params.id)) {
            return res.status(401).send("Not Allowed");
        }
        if (!course.students.some(studentIdInCourse => studentIdInCourse.toString()===req.student.id)) {
            return res.status(401).send("Not Allowed");
        }
        const filteredStudentArray = student.courses.filter(element => (element["courseId"]).toString() !== req.params.id);
        let newStudent = {courses: filteredStudentArray};
        savedStudent = await Student.findByIdAndUpdate(req.student.id, { $set: newStudent }, { new: true });
        const filteredCoursesArray = course.students.filter(element => element.toString() !== req.student.id);
        const newCourse = {students: filteredCoursesArray};
        savedCourse = await Course.findByIdAndUpdate(req.params.id, { $set: newCourse }, { new: true });
        success = true;
        res.json({ success, savedCourse ,savedStudent});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
router.post('/markcomplete/:id', fetchStudent, async (req, res) => {
    let success = false;
    try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).send("Not Found");
        }
        let student = await Student.findById(req.student.id);
        if (!student) {
            return res.status(404).send("Not Allowed");
        }
        const courseEntry = student.courses.find(course => course.courseId.toString() === req.params.id.toString());
        if (!courseEntry) {
            return { success: false, message: 'Course not found in student record' };
        }
        if (courseEntry.completionStatus === 'c') {
            return { success: false, message: 'Update not allowed. Course is already marked as completed.' };
        }
        const courseIndex = student.courses.findIndex(course => course.courseId.toString() === (req.params.id).toString());
        console.log(courseIndex);
        student.courses[courseIndex].completionStatus = 'c';
        savedStudent = await Student.findByIdAndUpdate(req.student.id, { $set: student }, { new: true });
        success = true;
        res.json({ success, savedStudent });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
