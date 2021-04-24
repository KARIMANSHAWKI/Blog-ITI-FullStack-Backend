const {validationResult} = require('express-validator/check');

exports.runValidation = (req, res, next)=>{
    const result = validationResult(req);

    if(!result.isEmpty()){
       return res.status(422).json({err : result.array()[0].msg})
    }

    next();
}
