var express = require("express");
var router = express.Router();

/* GET home page. */

/**
 * @route POST /auth/login - Login with username and password
 *
 * @route POST /users - Register a new account
 * @route GET /users?page=1&limit=10 - Get user with pagination
 * @route GET /users/me - Get current user info
 * @route GET /users/:id - Get a user profile
 * @route PUT /users/:id = Update a user profile
 *
 * @route POST /posts - Create a new post
 * @route GET /posts/user/:userId?page=1&limit=10 - Get posts with pagination
 * @route PUT /posts/:id - Update a post
 * @route DELETE /posts/:id - Remove a post
 * @route GET /posts/:id/comments/ - Get list of comments of a post
 *
 * @route POST /comments - Create a new comment
 * @route PUT /comments/:id - Update a comment
 * @route DELETE /comments/:id - Delete a comment
 *
 * @route POST /reactions - Create a new emoji reaction for a post/comment
 *
 * @route POST /friends/requests - Send a friend request
 * @route GET /friends/requests/incomming - Get the list of received pending requests
 * @route GET /friends/requests/outgoing = Get the list of sent pending request
 * @route PUT /friends/requests/:userId - Accept/Reject received pending requests
 * @route GET /friends - Get the list of friends
 * @route DELETE /friends/requests/:userId - Cancel a friend request
 * @route DELETE /friends/:userId - Remove a friend
 *
 */

const authApi = require("./auth.api");
router.use("/auth", authApi);

const userApi = require("./user.api");
router.use("/users", userApi);

const postApi = require("./post.api");
router.use("/posts", postApi);

const commentApi = require("./comment.api");
router.use("/comments", commentApi);

const reactionApi = require("./reaction.api");
router.use("/reactions", reactionApi);

const friendApi = require("./friend.api");
router.use("/friends", friendApi);

module.exports = router;
