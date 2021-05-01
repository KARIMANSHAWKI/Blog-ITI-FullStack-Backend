const Tag = require('../models/tag.model');
const { requireSignin } = require('./auth.controller');
const {errorHandler} = require('../helpers/dbErrorHandeler')
const slugify = require('slugify')

// ********************* Craete ****************** 
exports.create = (req, res)=> {
        const {name} = req.body;
        let slug = slugify(name).toLowerCase()

        let tag = new Tag({name , slug})

        tag.save((err, data)=>{
            if(err){
                return res.status(400).json({
                    error : errorHandler(err)
                })
            }

            res.json(data)
        })
}

// ************************* List **********************
exports.list = (req, res) =>{
    Tag.find({}).exec((err,data) =>{
        if(err) {
            return res.status(400).json({
                error : errorHandler(err)
            })
        }
        res.json(data)
    })
}

//  ******************** Read ******************* //
exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOne({slug}).exec((err, tag) => {
        if(err) {
            return res.status(400).json({
                error : errorHandler(err)
            })
        }

        res.json(tag)
    })
}

// **************************** Remove *********************
exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOneAndRemove({slug}).exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error : errorHandler(err)
            });
        }

        res.json({
            error : "Tag Deleted succeccfully !"
        });
    });

}