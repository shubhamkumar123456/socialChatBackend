const User = require("../models/User");
const Post = require("../models/Post");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_secret = process.env.JWT_secret;

const createuser = async (req, res) => {
  let { name, email, password, cpassword } = req.body;

  if (!name || !email || !password || !cpassword) {
    res.status(401).json({ message: "Please Fill all required fields" });
  } else {
    let existUser = await User.findOne({ email });
    if (password !== cpassword) {
      res.status(401).json({ message: "password does not match" });
    } else if (existUser) {
      res.status(401).json({ message: "User already exists" });
    } else {
      try {
        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashedCPassword = await bcrypt.hash(cpassword, salt);
        let user = await User.create({
          name,
          email,
          password: hashedPassword,
          cpassword: hashedCPassword,
        });

        res.status(201).json({ msg: "user registered successfully" });
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ error: error.message, msg: "error in register user" });
      }
    }
  }
};

const loginUser = async (req, res) => {
  let { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ msg: "no user found please sign up" });
  }

  let userPassword = await bcrypt.compare(password, user.password);

  if (userPassword) {
    const token = jwt.sign({ id: user._id }, JWT_secret, {
      expiresIn: "7d",
    });

    // ✅ Send cookie
    res.cookie("token", token, {
      httpOnly: true, // 🔥 cannot access via JS
      secure: false, // true in production (https)
      sameSite: "lax", // when frontend-backend are same
      //   sameSite: "none",      // when different
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ msg: "user logged in successfully" });
  } else {
    res.status(400).json({ msg: "wrong credentials!" });
  }
};

const loggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -cpassword");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // same as login config
    sameSite: "lax",
  });

  res.status(200).json({ msg: "logout successful" });
};
const getUser = async (req, res) => {
  let email = req.body.email;
  try {
    let user = await User.findOne({ email: email })
      .populate({ path: "followings" })
      .populate({ path: "followers" });
    if (!user) {
      res.send("user not found");
    } else {
      res.json(user);
    }
  } catch (error) {
    res.send(error.message);
  }
};
const getAllUser = async (req, res) => {
  let user = await User.find({});
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send("user not found");
  }
};
const deleteUser = async (req, res) => {
  console.log(req.params.id);
  let user = await User.findByIdAndDelete(req.params.id);
  res.status(200).send("user deleted successfully");
};
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  let { name, password, cpassword, photo, phone, email } = user;
  const salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(req.body.password, salt);
  let hashedCPassword = await bcrypt.hash(req.body.cpassword, salt);
  user.email = email;
  user.name = req.body.name || name;
  user.password = hashedPassword || password;
  user.cpassword = hashedCPassword || cpassword;

  user.photo = req.body.photo || photo;
  user.phone = req.body.phone || phone;

  const updatedUser = await user.save();
  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    photo: updatedUser.photo,
    phone: updatedUser.phone,
    bio: updatedUser.bio,
  });
};

const userfollow = async (req, res) => {
 let {friendId} = req.params
    let userId = req.userId

    let user = await User.findById(userId);  // {name ,email , _id, pass,followers:[], followings:[]}
    let friend = await User.findById(friendId);  // {name ,email , _id, pass}

    if(user.followings.includes(friendId)){
        user.followings.pull(friendId)
        friend.followers.pull(userId);
        await user.save();
        await friend.save();
        return res.status(200).json({msg:"user unfollow successfully", user, friend})
    }
    else{
        user.followings.push(friendId)
        friend.followers.push(userId);
        await user.save();
        await friend.save();
        return res.status(200).json({msg:"user follow successfully", user, friend})
    }
};

const userUnfollow = async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        
      } else {
        res.status(403).json("you are no longer following this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you can not unfollow yourself");
  }
};
const searchUsers = async (req, res) => {
  // use regex to find by query with character
  try {
    let query = req.query.name;
    if (query) {
      var users = await User.find({
        name: { $regex: query, $options: "i" },
      }).select("name profilePicture followers followings");
    } else {
      return res.status(404).json({ msg: "no user found", users: [] });
    }

    if (users) {
      res.status(200).json({ users });
    } else {
      res.status(404).json({ msg: "no user found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const timeLinePosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.body._id);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      }),
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createuser,
  getUser,
  deleteUser,
  updateUser,
  getAllUser,
  loginUser,
  userfollow,
  userUnfollow,
  searchUsers,
  timeLinePosts,
  loggedInUser,
  logoutUser,
};
