const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var dotenv = require('dotenv');
dotenv.config();
var jwt = require('jsonwebtoken');
router.post('/signup', [
    body('name','Enter a valid full name')
        .custom(value => {
            const parts = value.trim().split(' ');
            if (parts.length !== 2) {
                throw new Error('Full name must contain a first and last name separated by a space.');
            }
            const [firstName, lastName] = parts;
            if (firstName.length < 3) {
                throw new Error('First name must be at least 3 characters long.');
            }
            if (lastName.length < 5) {
                throw new Error('Last name must be at least 5 characters long.');
            }
            return true;
        }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 }),
    body('phone', 'Enter a valid phone number').isLength({ min: 10, max: 10 }).isNumeric()
    .withMessage('Phone number must contain only numeric characters.'),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success:success, errors: errors.array() });
    }
    //check whether user with this email exists already
    try {
        let student = await Student.findOne({ email: req.body.email });
        if (student) {
            return res.status(400).json({ success,error: "Sorry! A student with this email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        student = await Student.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            phone: req.body.phone
        });
        const data = {
            student: {
                id: student._id
            }
        };
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({success, authtoken });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured");
    }
});

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }
    const email = req.body.email;
    const password = req.body.password;
    try {
        let student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ success,error: "Please try to login with correct credentials" })
        }
        const passwordCompare = bcrypt.compare(password, student.password);
        if (!passwordCompare) {
            return res.status(400).json({ success,error: "Please try to login with correct credentials" });
        }
        const payload = {
            student: {
                id: student._id
            }
        }
        const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
        success = true;
        res.json({ success,authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});
router.post('/adminLogin', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }
    const email = req.body.email;
    const password = req.body.password;
    try {
        let admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ success,error: "Please try to login with correct credentials admin not found" });
        }
        const passwordCompare = bcrypt.compare(password, admin.password);
        if (!passwordCompare) {
            return res.status(400).json({ success,error: "Please try to login with correct credentials pasword didnt match" });
        }
        const payload = {
            admin: {
                id: admin._id
            }
        }
        const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
        success = true;
        res.json({ success,authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});
module.exports = router;