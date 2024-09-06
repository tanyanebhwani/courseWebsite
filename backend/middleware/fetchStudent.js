var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');
dotenv.config();
const fetchStudent = (req,res,next)=>{
    //Get the student from the jwt token and append add id to req object
    const token = req.header('auth-token');
    if(!token)
        {
            res.status(401).send({error:"Please authenticate using a valid token"})
        }
        try {
            const data = jwt.verify(token,process.env.JWT_SECRET);
            console.log(data);
            req.student = data.student;
            next();   
        } catch (error) {
            res.status(401).send({error:"Please authenticate using a valid token"})
        }
}
module.exports = fetchStudent;