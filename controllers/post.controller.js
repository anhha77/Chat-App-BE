const Post = require("../models/Post");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Friend = require("../models/Friend");
const postController = {};

const caculatePostCount = async (userId) => {
  const postCount = await Post.countDocuments({
    author: userId,
    isDeleted: false,
  });
  await User.findByIdAndUpdate(userId, { postCount });
};

postController.createNewPost = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const { content, image } = req.body;

  let post = await Post.create({
    content,
    image,
    author: currentUserId,
  });
  await caculatePostCount(currentUserId);
  post = await post.populate("author");

  return sendResponse(res, 200, true, post, null, "Create Post Successfully");
});

postController.updateSinglePost = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const postId = req.params.id;

  let post = await Post.findById(postId);
  if (!post) throw new AppError(400, "Post not found", "Update Post Error");
  if (!post.author.equals(currentUserId))
    throw new AppError(400, "Only author can edit post", "Update Post Error");

  const allows = ["content", "image"];
  allows.forEach((field) => {
    if (req.body[field] !== undefined) {
      post[field] = req.body[field];
    }
  });
  await post.save();

  return sendResponse(res, 200, true, post, null, "Update Post Successful");
});

postController.getSinglePost = catchAsync(async (req, res, next) => {
  const currentUserId = req.UserId;
  const postId = req.params.id;

  let post = await Post.findById(postId);
  if (!post) throw new AppError(400, "Post not found", "Get single post error");

  post = post.toJSON();
  post.comments = await Comment.find({ post: post._id }).populate("author");

  return sendResponse(
    res,
    200,
    true,
    post,
    null,
    "Get Single Post Successfully"
  );
});

postController.getPosts = catchAsync(async (req, res, next) => {
  // const currentUserId = req.userId;
  const userId = req.params.userId;
  let { page, limit } = req.query;

  let user = await User.findById(userId);
  if (!user) throw new AppError(400, "User not found", "Get post error");

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  let userFriendIDs = await Friend.find({
    $or: [{ from: userId }, { to: userId }],
    status: "accepted",
  });

  if (userFriendIDs && userFriendIDs.length) {
    userFriendIDs = userFriendIDs.map((friend) => {
      if (friend.from.equals(userId)) return friend.to;
      return friend.from;
    });
  }

  userFriendIDs = [...userFriendIDs, userId];

  const filterConditions = [
    { isDeleted: false },
    { author: { $in: userFriendIDs } },
  ];
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  const count = await Post.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  let posts = await Post.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  return sendResponse(
    res,
    200,
    true,
    { posts, totalPages, count },
    null,
    "Get Posts Successfully"
  );
});

postController.deleteSinglePost = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const postId = req.params.id;

  let post = await Post.findById(postId);
  if (!post) throw new AppError(400, "Post not found", "Delete Post Error");
  if (!post.author.equals(currentUserId))
    throw new AppError(400, "Only author can delete post", "Delete Post Error");

  post = await Post.findOneAndUpdate(
    { _id: postId, author: currentUserId },
    { isDeleted: true },
    { new: true }
  );

  await caculatePostCount(currentUserId);

  return sendResponse(res, 200, true, post, null, "Delete Post Successfully");
});

postController.getComments = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const post = Post.findById(postId);
  if (!post) throw new AppError(400, "Post not found", "Get Comments Error");

  const count = await Comment.countDocuments({
    post: postId,
    isDeleted: false,
  });
  const totalPages = Math.ceil(count / limit);
  const offset = (page - 1) * limit;

  const comments = await Comment.find({ post: postId, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .populate("author");

  return sendResponse(
    res,
    200,
    true,
    { comments, count, totalPages },
    null,
    "Get Comments Successfully"
  );
});

module.exports = postController;
