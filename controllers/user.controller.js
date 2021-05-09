const User = require('../models/user.model')
const Blog = require('../models/blog.model')
const {errorHandler} = require('../helpers/dbErrorHandeler')


exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
}

exports.publicProfile = (req,res) => {
    let username = req.params.username
    let user
    let blog

    User.find({username}).exec((err, userFromDB)=>{
        if(err || !userFromDB){
            return res.status(400).json({
                error : 'user not found'
            })
        }

        user = userFromDB
        let userId = user._id
        Blog.find({postedBy: userId})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name')
        .limit(10)
        .select('_id title excerpt categories tags postedBy craetedAt updatedAt ')
        .exec((err, data)=>{
            if(err){
                return res.status(400).json({
                    error : errorHandler(err)
                })
            }

            user.photo = undefined;
            res.json({
                user,
                blogs : data
            })
        })
        
    })
}