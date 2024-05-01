const Comment = require("../models/Comment");
const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const Post = require("../models/Post");

const commentController = {};

const caculateCommentCount = async (postId) => {
  const commentCount = await Comment.countDocuments({
    post: postId,
    isDeleted: false,
  });
  await Post.findByIdAndUpdate(postId, { commentCount });
};

commentController.createNewComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { content, postId } = req.body;

  const post = Post.findById(postId);
  if (!post)
    throw new AppError(400, "Post not found", "Create new comment error");

  let comment = await Comment.create({
    author: currentUserId,
    post: postId,
    content,
  });

  await caculateCommentCount(postId);
  comment = await comment.populate("author post");

  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Create Comment Successfully"
  );
});

commentController.updateSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { id: commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, author: currentUserId },
    { content },
    { new: true }
  );

  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User not authorized",
      "Update comment error"
    );

  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Update comment successfully"
  );
});

commentController.deleteSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { id: commentId } = req.params;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, author: currentUserId },
    { isDeleted: true },
    { new: true }
  );

  if (!comment)
    throw new AppError(
      400,
      "Comment not found or User not authorized",
      "Delete comment error"
    );
  await caculateCommentCount(comment.post);

  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Delete comment successfully"
  );
});

commentController.getSingleComment = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { id: commentId } = req.params;

  let comment = await Comment.findOne({ _id: commentId, isDeleted: false });
  if (!comment)
    throw new AppError(400, "Comment not found", "Get single comment error");

  return sendResponse(
    res,
    200,
    true,
    comment,
    null,
    "Get comment successfully"
  );
});

module.exports = commentController;
