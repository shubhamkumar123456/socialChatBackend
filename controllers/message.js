    let Message = require('../models/Message');
    let Conversation = require('../models/Conversation')
    let User = require('../models/User')

const sendMessage = async(req,res)=>{
  const sender = req.userId;
  const reciever = req.params.recieverId
  const {text} = req.body;
  

    try {
    let conversation = await Conversation.findOne({
        members:{$all:[sender,reciever]}
    });
    // console.log("conversation")

    if(!conversation){
        conversation = await Conversation.create({
            members:[sender,reciever]
        })
    }
    const newMessage = await new Message({
        reciever,
        sender,
        text
    })
        await conversation.messages.push(newMessage._id)
    await newMessage.save()
        await conversation.save()
        res.json({msg:"message send successfully",success:true,conversation})
} catch (error) {
        res.json({msg:"error in sending message",success:false,error:error.message})
}
}


const getuserConversations = async(req,res)=>{
  try {
    const userId = req.userId;
    console.log(userId)
    let data = await Conversation.find({
     members:{$in:[userId]}
    }).select('members').populate({
      path:'members',
      select:'name profilePicture'
    })

    const chats = data.map((conv) => {
      const otherUser = conv.members.find(
        (member) => member._id.toString() !== userId
      );

      return otherUser
    });


    res.json({msg:"successfully fetched conversation",success:true,users:chats})
  } catch (error) {
    res.json({msg:"error in getting conversation",success:false,error:error.message})
  }
}

const getSingleChat = async(req,res)=>{
   try {
    const userId = req.userId;
    let friendId = req.params.friendId
    // console.log(friendId)
    // console.log(userId)

    let conversation = await Conversation.findOne({
      members:{$all:[userId,friendId]}
    }).select('messages').populate({path:'messages'});
      
    //   console.log(conversation)
   if(conversation){
    return res.status(200).json({msg:"chat fetched successfullly", success:true,chat:conversation})
   }
   else{
   return res.status(404).json({msg:"converstation not found", success:false})
   }
   } catch (error) {
    res.json({msg:"error in getting chat",success:false,error:error.message})
   }
    // let chat = await
}


module.exports = {
    sendMessage,
    getuserConversations,
    getSingleChat
}