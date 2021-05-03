const Blog = require('../models/blog.model');
const Category = require('../models/category.model');
const Tag = require('../models/tag.model');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const {errorHandler} = require('../helpers/dbErrorHandeler');
const fs =require('fs')
const {smartTrim} = require('../helpers/blog.helper')


exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files)=> {
        if(err){
            return res.status(400).json({
                error : "Image could not be uploaded"
            })
        }

        const {title, body, categories, tags} = fields;
        

        // ************* Blog Elements validation *********** 
        if(!title || !title.length){
            return res.status(400).json({
                error : 'title is required !'
            })
        }

        if(!body || body.length < 200){
            return res.status(400).json({
                error : 'Content is too short !'
            })
        }

        if(!body || body.length < 200){
            return res.status(400).json({
                error : 'Content is too short !'
            })
        }

        if(!categories || categories.length === 0){
            return res.status(400).json({
                error : 'One category at least is required '
            })
        }

        if(!tags || tags.length === 0){
            return res.status(400).json({
                error : 'One tag at least is required '
            })
        }


    
        // ************* set blog elements *********** //
        let blog = new Blog();
        blog.title = title;
        blog.body = body;
        blog.excerpt = smartTrim(body, 320, ' ', '....')
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0, 160));
        blog.postedBy = req.user._id;


        if(files.photo){
            if(files.photo.size > 100000) {
                return res.status(400).json({
                    error : 'Image should be less than 1mb in size'
                })
            }
            blog.photo.data = fs.readFileSync(files.photo.path);
            blog.photo.type = files.photo.type
        }

        let arrayOfCategories = categories && categories.split(',')
        let arrayOfTags = tags && tags.split(',')

        blog.save((err, result)=>{
            if(err){
                return res.status(400).json({
                    erorr : errorHandler(err)
                })
            }

            Blog.findByIdAndUpdate(result._id,{$push: {categories : arrayOfCategories}}, {new: true}).exec((err, result)=>{

                if(err){
                    res.status(400).json({
                        error: errorHandler(err)
                    })
                } else {
                Blog.findByIdAndUpdate(result._id,{$push: {tags : arrayOfTags}}, {new: true}).exec((err, result)=>{
                    if(err){
                        res.status(400).json({
                            error: errorHandler(err)
                        })
                    } else {
                        res.json(result)
                    }
                })

            }

        })
        })



    })
}

