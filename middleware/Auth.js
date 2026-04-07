const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_secret

module.exports = (req, res, next) => {
        // console.log("cookies" , req.cookies)
   try {
    const token = req.cookies.token || req.headers.authorization;
    // console.log("token",token)
     if (token) {
        jwt.verify(token, jwt_secret, (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: "token is not valid" });
            } else {
                req.userId = decoded.id;
                next();
            }
        });
    } else {
        return res.status(401).json({ msg: "token not found",  });
    }
   } catch (error) {
       return  res.status(401).json({ msg: "token is not valid" , error:error.message});
   }
};
