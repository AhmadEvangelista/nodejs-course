const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
  '/login',
  [
    check('email', 'Please enter valid email.').isEmail(),
    check(
      'password',
      'Please enter a password with only numbers and text and atleast 8 characters.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);

router.post(
  '/signup',
  [
    check('email', 'Please enter valid email.')
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              'Email exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    check(
      'password',
      'Please enter a password with only numbers and text and atleast 8 characters.'
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords have to match!');
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
