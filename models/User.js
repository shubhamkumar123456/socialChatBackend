const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "enter your name"],
    },
    email:{
        type:String,
        required:[true, "enter your email"],
        unique:true,
        trim:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid Email"
        ]
    },
    password:{
        type:String,
        required:[true,"Please add a password"],
        minlength:[6,"password must be at least 6 characters"],
    },
    cpassword:{
        type:String,
        required:[true,"Please add a password"],
        minlength:[6,"password must be at least 6 characters"],
    },
    // photo:{
    //     type:String,
    //     required:[false,"Please add a photo"],
    //     default:"https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
    // },
    phone:{
        type:String,
        default:"+91"
    },
  
    coverPicture:{
        type:String,
        default:"https://tse2.mm.bing.net/th?id=OIP.DfsGWUClWpJOP8827aNaQQHaEo&pid=Api&P=0&h=180"
    },
    profilePicture:{
        type:String,
        default:"https://toppng.com/public/uploads/preview/instagram-default-profile-picture-11562973083brycehrmyv.png"
    },
    followers:
        [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
         }]
    ,
    followings: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
     }],
    isAdmin:{
        type:Boolean,
        default:false
    },
    desc:{
        type:String,
        max:50
    },
    city:{
        type:String,
        max:50
    },
    from:{
        type:String,
        max:50
    },
    relationship:{
        type:Number,
        enum:[1,2,3],
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
     }],
     conversation:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
     }],
},{timestamps:true})

const User = mongoose.model("User",userSchema);
module.exports = User;