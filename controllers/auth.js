const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');
const { validationResult } = require('express-validator');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message,
    prevInput: {
      email: '',
      password: '',
    },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    prevInput: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req).array();

  if (errors.length > 0) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors[0].msg,
      prevInput: {
        email: email,
        password: password,
      },
      validationErrors: errors,
    });
  }
  console.log(req.body.email, password);

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          prevInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            prevInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req).array();

  if (errors.length > 0) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors[0].msg,
      prevInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors,
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then(() => {
      res.redirect('/login');

      const msg = {
        to: email,
        from: 'dahma.evangelista@gmail.com',
        subject: 'Signup succeeded!',
        text: 'Signup succeeded!',
        html: '<h1>You successfully signed up</h1>',
      };

      return sgMail
        .send(msg)
        .then((response) => {
          console.log(response[0].statusCode);
          console.log(response[0].headers);
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    pageTitle: 'Reset Password',
    path: '/reset',
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'Email not found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect('/');
        const msg = {
          to: req.body.email,
          from: 'dahma.evangelista@gmail.com',
          subject: 'Password Reset',
          text: 'Password Reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `,
        };
        console.log(
          `Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.`
        );

        return sgMail
          .send(msg)
          .then((response) => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    const newPasswrd = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    let resetUser;

    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    })
      .then((user) => {
        resetUser = user;
        return bcrypt.hash(newPasswrd, 12);
      })
      .then((hashedPassword) => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then((result) => {
        res.redirect('/login');

        const msg = {
          to: resetUser.email,
          from: 'dahma.evangelista@gmail.com',
          subject: 'New Password succeeded!',
          text: 'New Password succeeded!',
          html: '<h1>You successfully changed password</h1>',
        };

        return sgMail
          .send(msg)
          .then((response) => {
            console.log(response[0].statusCode);
            console.log(response[0].headers);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};
