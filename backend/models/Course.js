const mongoose = require('mongoose');
const syllabusSchema = new mongoose.Schema({
    week: { type: Number, required: true },
    topic: { type: String, required: true },
    content: { type: String, required: true },
});
const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    instructor: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    enrollmentStatus: {
        type: String,
        enum: ['open', 'closed', 'in progress'], // Restrict to these three values
        required: true
    },
    thumbnail: {
        type: String,
    },
    duration: {
        type: String,
        required: true
    },
    schedule: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    prerequisites: [
        {
            type: String
        }
    ],
    syllabus: [syllabusSchema],
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        }
    ]
});
const Course = mongoose.model('course',CourseSchema);
Course.createIndexes();
module.exports = Course;
