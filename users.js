const users = [];

const addUser = ({id,userId})=>{
    // name = name.trim.toLowerCase();
    // console.log(name,"in users js")
    // const existingUser = users.find(user => user.name === name);
    // if(existingUser){
    //     return {
    //         error:'Username is taken'
    //     }
    // }
    const user = {id,userId}
    users.push(user);
    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex(user => user.id === id);
    if(index!==-1){
        return users.splice(index,1)[0];
    }
}

const getUser = (id)=>{
    console.log(id)
    console.log(users, "this is users array")
    let User = users.find(user => user.id === id)
    console.log("User in getUser" , User)
    return User
}
module.exports ={
    getUser,
    addUser,
    removeUser
}