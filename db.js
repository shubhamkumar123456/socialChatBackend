const mongoose  = require('mongoose');
require("dotenv").config();
const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("connected to mongoDB");
      } catch (error) {
        console.log(error);
        throw error;
      }
}
module.exports = connectToDb