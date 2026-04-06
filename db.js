const mongoose  = require('mongoose');
require("dotenv").config();
const connectToDb = async()=>{
  console.log(process.env.Mode==='developement'?process.env.MONGO_LOCAL:process.env.MONGODB_URL)
    try {
        await mongoose.connect(process.env.mode==='developement'?process.env.MONGO_LOCAL:process.env.MONGODB_URL);
        console.log("connected to mongoDB");
      } catch (error) {
        console.log(error);
        throw error;
      }
}
module.exports = connectToDb