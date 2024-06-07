const { check, validationResult } = require('express-validator');

exports.validateSignup = [
    check('email')
        .isEmail().withMessage('Email is not valid')
        .normalizeEmail(),
    check('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.validateLogin = [
    check('email')
        .isEmail().withMessage('Email is not valid')
        .normalizeEmail(),
    check('password')
        .not().isEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
