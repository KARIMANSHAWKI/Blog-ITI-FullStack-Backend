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

// *********************** Operations on blog ***********************
exports.list = (req, res) => {
    Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username')
    .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
    .exec((err, data)=>{
        if(err){
            return res.json({
                error : errorHandler(err)
            })
        }

        res.json(data)
    })
}

exports.listAllCategoriesTAgs = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs
    let categories
    let tags
        // ********** get blogs ********
    Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username profile')
    .sort({createdAt : -1})
    .skip(skip)
    .limit(limit)
    .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
    .exec((err, data)=>{
        if(err){
            return res.json({
                error : errorHandler(err)
            })
        }

        blogs = data;

      // ******* get categories *******
      Category.find({}).exec((err, c)=>{
        if(err){
            return res.json({
                error : errorHandler(err)
            })
        }
        categories =  c

        // ****** get categories ****** 
        Tag.find({}).exec((err, t)=>{
            if(err){
                return res.json({
                    error : errorHandler(err)
                })
            }

            tags = t

            res.json({blogs, categories, tags, size: blogs.length})
        })

      })
    })
}

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({slug})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('postedBy', '_id name username')
    .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt ')
    .exec((err, data)=>{
        if(err){
            return res.json({
                error : errorHandler(err)
            })
        }
        res.json(data)
    })
}

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOneAndRemove({slug}).exec((err, data)=>{
        if(err) {
            return res.json({
                error : errorHandler(err)
            })
        }

        res.json({
            message : 'Blog deleted successfully '
        })
    })
}


exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Blog.findOne({ slug }).exec((err, oldBlog) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }

            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;

            const { body, desc, categories, tags } = fields;

            if (body) {
                oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
                oldBlog.desc = stripHtml(body.substring(0, 160));
            }

            if (categories) {
                oldBlog.categories = categories.split(',');
            }

            if (tags) {
                oldBlog.tags = tags.split(',');
            }

            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }
                oldBlog.photo.data = fs.readFileSync(files.photo.path);
                oldBlog.photo.contentType = files.photo.type;
            }

            oldBlog.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(result);
            });
        });
    });
};


exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug })
        .select('photo')
        .exec((err, blog) => {
            if (err || !blog) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.set('Content-Type', blog.photo.contentType);
            return res.send(blog.photo.data);
        });
};


// *************************** Related posts *************************
exports.listRelated = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 3;
    const {_id, categories} = req.body.blog;

    Blog.find({_id : {$ne : _id}, categories : {$in : categories}})
    .limit(limit)
    .populate('postedBy', '_id name profile')
    .select('title slug excerpt postedBy createdAt updatedAt')
    .exec((err, blogs)=>{
        if(err){
            res.status(400).json({
                error :'Blog Not Foud '
            })
        }

        res.json(blogs) 
    })

}


// ************************** Search Blog *********************** //
exports.listSearch = (req, res) => {
    const { search } = req.query;
    if (search) {
        Blog.find(
            {
                $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } }]
            },
            (err, blogs) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(blogs);
            }
        ).select('-photo -body');
    }
};