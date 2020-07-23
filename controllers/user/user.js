const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('../../config/config');

const User = require('../../models/user/user');

/* function to format the response from db*/
const response = (result) => {
        return {
            id: result.id,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName
        }
}

const errorResponse = (message) => {
  return {
    error: {
      errorMsg:message
    }
  }
}

/*Controller to create/register the user
* Password is stored as encrypted
*/
exports.USER_SIGNUP = (req, res, next) => {
  if(req && req.body && req.body.email && req.body.password && req.body.firstName && req.body.lastName) {
    bcrypt.hash(req.body.password, 10).then(hash => {
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });

      user
        .save()
        .then(result => {
          res.status(201).json({
            message: "User created successfully",
            result: result
          });
        })
        .catch(err => {
          console.log(err);
          const error = JSON.stringify(err);
          if(error && error.indexOf('expected `email` to be unique') >= 0) {
            res.status(500).json(errorResponse('E-mail already exists'));
          } else  {
            res.status(500).json(errorResponse('User creation failed'));
          }
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(errorResponse(JSON.stringify(err)));
    });
  } else {
    res.status(500).json(errorResponse('Required keys are missing: email, password, firstName, lastName'));
  }
}

/*Controller to authenticate the user*/
exports.USER_LOGIN = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log(response(user));
      if (!user) {
        return res.status(401).json(errorResponse('Authentication Failed - Invalid Credentials'));
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json(errorResponse('Authentication Failed - Invalid Credentials'));
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        config.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        user: response(fetchedUser)
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json(errorResponse('Authentication Failed - Invalid Credentials'));
    });
}
