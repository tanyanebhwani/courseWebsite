const mongoose = require('mongoose');
const StudentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{  //for login purpose - will be provided to every student by the institution
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    courses: [
        {
            courseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course', // Reference to Course schema
                required: true
            },
            completionStatus: {
                type: String,
                enum: ['c', 'nc'], // Only two values: 'c' (completed), 'nc' (not completed)
                required: true
            }
        }
    ]
});
const Student = mongoose.model('student',StudentSchema);
Student.createIndexes();
module.exports = Student;
