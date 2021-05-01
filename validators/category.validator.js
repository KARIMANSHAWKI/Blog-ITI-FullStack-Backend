const {check} = require('express-validator/check');

// ********************** Category *********************** //
exports.categoryCreateValidator = [
    check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required !')
]