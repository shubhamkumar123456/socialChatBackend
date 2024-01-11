const Post = require('../models/Post');
const User = require('../models/User')
const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: 'dsf7eyovf',
  api_key: '641172434315457',
  api_secret: '0kG6j1Sx5jOoqxP7PJy_p_WAV58',
  secure: true
});



const createPost = async (req, res) => {
  let { userId, img,desc } = req.body;
  console.log(img)
  let imgPath = ""

    await cloudinary.uploader.upload(req.body.img, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        imgPath = result.url;
      }
    });
  // console.log(imgPath) 
  let user = await User.findOne({_id:req.body.userId})

  let post = await Post.create({
    userId,
    img:imgPath,
    desc
  })
  if(!user){
    res.send(404).json({msg:"no user found"})
  }
  if(post && user){
    // let userPost= await user.posts.push(post._id)
    let userPost = await user.updateOne({$push:{posts:post._id},new:true})
    

    res.json({msg:"post added successfully",user})
  }

 
}
const getAll = async (req, res) => {
  const post = await Post.find({});
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: "no post found" });
  }
}
const getSingleUser = async (req, res) => {
  let userId = req.params.id
  const user = await Post.find({ userId })
  if (user) {
    res.json(user);
  } else {
    res.send("No such user found")
  }
}
const updateCoverPic = async (req, res) => {
  let { userId, coverPicture } = req.body;
  console.log(coverPicture)
  let imgPath = ""

    await cloudinary.uploader.upload(req.body.coverPicture, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        imgPath = result.url;
      }
    });
  // console.log(imgPath)
  let user = await User.findOne({ _id: req.body.userId })

  if (user) {
    //    await user.coverPicture.updateOne({ $set: imgPath})
    await user.updateOne({ $set: { coverPicture: imgPath }, new: true })
    await user.save()
    console.log(user)
    res.json({ msg: "cover pic updated successfully", user });
  } else {
    res.send("No such user found")
  }

}

const updateProfilePic = async (req, res) => {
  let { userId, profilePicture } = req.body;
  console.log(profilePicture)
  let imgPath = ""

    await cloudinary.uploader.upload(req.body.profilePicture, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        imgPath = result.url;
      }
    });

  let user = await User.findOne({ _id: req.body.userId })

  if (user) {
    await user.updateOne({ $set: { profilePicture: imgPath }, new: true })
    await user.save()
    console.log(user)
    res.json({ msg: "cover pic updated successfully", user });
  } else {
    res.send("No such user found")
  }
}

const updatePost = async (req, res) => {

}
const deletePost = async (req, res) => {
  // let id = req.body._id;
  // console.log(id)
  let post = await Post.findById(req.body._id)
  if(!post){
    res.status(404).json({msg:"no post found"})
  }
  // res.send(post)
  let user = await User.findOne({_id:post.userId})
  console.log(user)
  if(user){
    await user.updateOne({$pull:{posts:post._id},new:true})
    await Post.findByIdAndDelete(req.body._id)
  }
  res.json({ msg: "post has been deleted", post })
}

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getSingleUser,
  getAll,
  updateCoverPic,
  updateProfilePic
}