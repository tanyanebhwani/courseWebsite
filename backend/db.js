const mongoose = require('mongoose');
var dotenv = require('dotenv');
dotenv.config();
const connectToMongo = () => {
    mongoose.connect(
        `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.di4bo.mongodb.net/courseWebsite?retryWrites=true&w=majority`,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
        .then(() => {
            console.log("Connected to database");
        })
        .catch((err) => {
            console.error("Error connecting to database:", err);
        });
}
module.exports = connectToMongo;
