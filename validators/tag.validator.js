const {check} = require('express-validator/check');

// ********************** Tag *********************** //
exports.tagCreateValidator = [
    check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required !')
]