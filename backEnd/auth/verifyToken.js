//checks for token and verifies its validity; 

var jwt = require('jsonwebtoken');

var config = require('../config');

function verifyToken(req, res, next){
    console.log(req.headers);

    var token = req.headers['authorization']; //retrieve authorization header's content
    console.log('hi' + token);

    if(!token){ //process the token
       res.status(403);
       return res.send({auth:'false', message:'Not authorized!'});
    }else{
       jwt.verify(token, config.key, function(err, decoded){ //verify token
        if(err){
            res.status(403);
            return res.end({auth:false, message:'Not authorized!'});
        }else{
            req.userid=decoded.userid; //decode the userid and store in req for use
            req.role = decoded.role; //decode the role and store in req for use
            next();
        }
       });
    }
}

module.exports = verifyToken;