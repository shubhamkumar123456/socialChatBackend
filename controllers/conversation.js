const Conversation = require('../models/Conversation')
const User = require('../models/User')
const createConversation = async(req,res)=>{
    let user = await User.findOne({_id:req.body.senderId});
    let conversation  = await Conversation.find({
        members:{$all:[req.body.recieverId,req.body.senderId]}
    })
    
    if(conversation.length){
    //    console.log("conversation",conversation)
    res.status(200).json(conversation[0])
   }else{
    conversation =await Conversation.create({
        members: [req.body.senderId, req.body.recieverId]
    })
    
        let friend = await User.findOne({_id:req.body.recieverId})
        if(!user.conversation.includes(conversation._id) && !friend.conversation.includes(conversation._id)){

            await user.updateOne({$push:{conversation:conversation._id}})
            await friend.updateOne({$push:{conversation:conversation._id}})
         
        }
        // console.log(user)
        // console.log(friend)
        try {
        res.status(200).json(conversation)
 
    
} catch (error) {
    res.status(500).json(error)
}
   }
    
  

   
}

const getConversation = async(req,res)=>{
   try {
        const conversation  = await Conversation.find({
            members:{$in:[req.params.userId]}
        })
        res.status(200).json(conversation)
   } catch (error) {
    res.status(500).json(error)
   }
}




module.exports = {
    createConversation,
    getConversation
}