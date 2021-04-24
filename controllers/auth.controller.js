const User = require('../models/user.model')
const shortId = require('shortid')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

// ************* Data to signup **************

/*
    1- check if email is used ? error : generate username and profile
    2-create user and save it in database
*/


exports.signup =  (req,res)=>{

    let username = shortId.generate();
    let profile = `${process.env.CLIENT_URL}/profile/${username}`;
     
    const user = new User({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            username,
            profile
    });

    try{
        const saveuser =  user.save();
    }catch(err){
        res.status(400).send(err);
    }


  User.findOne({email : req.body.email}).exec((err, user)=>{
      if(user){
          res.status(400).json({
              error : 'Email is taken !'
          })
      }

    // ********* generate username and profile ********
      const {name, email, password} = req.body;
      let username = shortId.generate();
      let profile = `${process.env.CLIENT_URL}/profile/${username}`;

    // ********* Add New User ********
    let newUser = new User({username,name,email,profile,password});
    newUser.save((err,secret)=>{
        if(err){
             res.status(400).json({
                error : err
            })
        } else {
            // res.json({
            //     user:secret
            // })
            res.json({
                message : "Signup secret ! "
            })
        }
    })

  })
}
// ********************************************************************** //

// ******************* Sign IN ****************** //
exports.signin = (req,res)=>{

    const {email, password} = req.body;

    // check if user exists
    User.findOne({email}).exec((err, user)=>{
        if(err || !user){
            return res.status(400).json({
                err : "User With That Email Does Not Exist Please, SignUp!"
            })
        }

            // authenticate
            if(!user.authenticate(password)){
                return res.status(400).json({
                    err : "Email And Password Donot match!"
                })
            }

            // generate atoken and send it to client
            const token = jwt.sign({_id : user._id}, process.env.JWT_SCRET, {expiresIn : '1d'} )
            res.cookie('token', token, {expiresIn : '1d'})
            const {_id, username, name, email, role} = user
            return res.json({
                token,
                user: {_id, username, name, email, role}
            })

    })
}

    // ************************************************************** //

    // ************** Sign Out ***************** //
    exports.signout = (req,res) => {
       res.clearCookie('token');
       res.json({
           message : "SignOut Success !"
       })

    }



exports.requireSignin = expressJwt({
    secret : process.env.JWT_SCRET,
    algorithms: ["HS256"],
    userProperty: "auth",
})