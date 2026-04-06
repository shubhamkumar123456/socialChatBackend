const Post = require("../models/Post");
const User = require("../models/User");
// const cloudinary = require('cloudinary').v2
// cloudinary.config({
//   cloud_name: 'dsf7eyovf',
//   api_key: '641172434315457',
//   api_secret: '0kG6j1Sx5jOoqxP7PJy_p_WAV58',
//   secure: true
// });

// const createPost = async (req, res) => {
//   let { userId, img,desc } = req.body;
//   console.log(img)
//   let imgPath = ""

//     await cloudinary.uploader.upload(req.body.img, (err, result) => {
//       if (err) {
//         console.log(err);
//         res.send(err);
//       } else {
//         imgPath = result.url;
//       }
//     });
//   // console.log(imgPath)
//   let user = await User.findOne({_id:req.body.userId})

//   let post = await Post.create({
//     userId,
//     img:imgPath,
//     desc
//   })
//   if(!user){
//     res.send(404).json({msg:"no user found"})
//   }
//   if(post && user){
//     // let userPost= await user.posts.push(post._id)
//     let userPost = await user.updateOne({$push:{posts:post._id},new:true})

//     res.json({msg:"post added successfully",user})
//   }

// }

const createPost = async (req, res) => {
  try {
    // console.log("files:", req.files);
    // console.log("body:", req.body);
    const { desc } = req.body;

    // files array
    const files = req.files;

    const mediaUrls = files.map((file) => file.filename);

    // save in DB
    const post = await Post.create({
      userId: req.userId,
      desc,
      media: mediaUrls,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getAll = async (req, res) => {
  try {
    const post = await Post.find().populate({
      path: "userId",
      select: "name profilePicture",
    });
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "no post found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, msg: "error in get all posts" });
  }
};
const getSingleUser = async (req, res) => {
  let userId = req.params.id;
  const user = await Post.find({ userId });
  if (user) {
    res.json(user);
  } else {
    res.send("No such user found");
  }
};
const updateCoverPic = async (req, res) => {
  let { userId, coverPicture } = req.body;
  // console.log(coverPicture);
  let imgPath = "";

  await cloudinary.uploader.upload(req.body.coverPicture, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      imgPath = result.url;
    }
  });
  // console.log(imgPath)
  let user = await User.findOne({ _id: req.body.userId });

  if (user) {
    //    await user.coverPicture.updateOne({ $set: imgPath})
    await user.updateOne({ $set: { coverPicture: imgPath }, new: true });
    await user.save();
    // console.log(user);
    res.json({ msg: "cover pic updated successfully", user });
  } else {
    res.send("No such user found");
  }
};

const updateProfilePic = async (req, res) => {
  let { userId, profilePicture } = req.body;
  // console.log(profilePicture);
  let imgPath = "";

  await cloudinary.uploader.upload(req.body.profilePicture, (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      imgPath = result.url;
    }
  });

  let user = await User.findOne({ _id: req.body.userId });

  if (user) {
    await user.updateOne({ $set: { profilePicture: imgPath }, new: true });
    await user.save();
    console.log(user);
    res.json({ msg: "cover pic updated successfully", user });
  } else {
    res.send("No such user found");
  }
};

const updatePost = async (req, res) => {};

const updateLike = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.postId;
  // console.log(postId);
  // console.log(userId);

  const post = await Post.findById(postId);
  if (!post.likes.includes(userId)) {
    post.likes.push(userId);
    await post.save();
    return res
      .status(200)
      .json({ msg: "post liked successfully", success: true, post });
  } else {
    post.likes.pull(userId);
    await post.save();
    return res
      .status(200)
      .json({ msg: "post disliked successfully", success: true, post });
  }
};

const addComment = async (req, res) => {
  const postId = req.params.postId;
  const userId = req.userId;
  // console.log(postId);
  // console.log(userId);
  // console.log(req.body.text);

  try {
    const post = await Post.findById(postId);
    // console.log(post);
    await post.comments.push({ userId: userId, text: req.body.text });
    await post.save();
    res
      .status(200)
      .json({ msg: "comment added successfully", success: true, post });
  } catch (error) {
    res
      .status(500)
      .json({
        msg: "error in adding comment",
        success: false,
        error: error.message,
      });
  }
};
const deletePost = async (req, res) => {
  const user = req.user.id;
  const { id } = req.body;
  if (!user) {
    return res.status(400).json({ message: "user id is required" });
  }
  if (!id) {
    return res.status(400).json({ message: "post id is required" });
  }
  try {
    const post = await Post.findById(id);
    if (post.user.toString() !== user.toString()) {
      return res
        .status(401)
        .json({ message: "you are not authorized to delete this post" });
    }
    const post1 = await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getSingleUser,
  getAll,
  updateCoverPic,
  updateProfilePic,
  updateLike,
  addComment,
};
