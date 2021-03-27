/**
 * @module router/auth
 * @requires module:controller/auth
 * @requires module:middleware/checkpoint
 */
const router = require("express").Router();
const auth = require("../controllers/auth.controller");
const checkpoint = require("../middlewares/checkpoint");

/**
 * Sign-up user
 * @name post/signup
 * @example {base_url}/auth/signup
 */
router.post("/signup", checkpoint.checkEmail, auth.signupController);

/**
 * activate and register user
 * @name post/activate
 * @example {base_url}/auth/activate
 */
router.post("/activate", checkpoint.checkEmail, auth.activateAccountController);

/**
 * Sign-in user
 * @name post/signin
 * @example {base_url}/auth/signin
 */
router.post("/signin", auth.signinController);

/**
 * refresh token
 * @name post/refresh
 * @example {base_url}/auth/refresh
 */
router.post("/refresh", auth.refreshTokenController);

module.exports = router;
