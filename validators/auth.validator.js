const {check} = require('express-validator/check');

// ********************** Sign Up *********************** //
exports.userSignUpValidator = [
    check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required !'),

    check('email')
    .isEmail()
    .withMessage('required valid email !'),

    check('password')
    .isLength({min: 6})
    .withMessage('password must be at least 6 character')
]

// ********************** Sign In ******************** //
exports.userSignInValidator = [
    check('email')
    .isEmail()
    .withMessage('required valid email !'),

    check('password')
    .isLength({min: 6})
    .withMessage('password must be at least 6 character')
]