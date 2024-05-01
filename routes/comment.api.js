const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const { param, body } = require("express-validator");
const authentication = require("../middlewares/authentication");
const commentController = require("../controllers/comment.controller");

/**
 * @route GET /comments/:id
 * @description Get details of a comment
 * @access Login require
 */

router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.getSingleComment
);

/**
 * @route POST /comments
 * @description create a new comment
 * @body { content, postId }
 * @access Login required
 */

router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("content", "Missing content").exists().notEmpty(),
    body("postId", "Missing postId")
      .exists()
      .isString()
      .custom(validators.checkObjectId),
  ]),
  commentController.createNewComment
);

/**
 * @route PUT /commnents/:id
 * @description Update a comment
 * @access Login required
 */

router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
    body("content", "Missing content").exists().notEmpty(),
  ]),
  commentController.updateSingleComment
);

/**
 * @route DELETE /commnents/:id
 * @description Delete a comment
 * @access Login required
 */

router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  commentController.deleteSingleComment
);

module.exports = router;
