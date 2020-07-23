const express = require('express');
const router = express.Router();

const userController = require('../../controllers/user/user');

/* API to create/add new User - user registration*/
router.post('/signup', userController.USER_SIGNUP);

/*API to log the user in - Authenticate the user*/
router.post("/login", userController.USER_LOGIN);

module.exports = router;
