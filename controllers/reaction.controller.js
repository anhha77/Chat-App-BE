const Reaction = require("../models/Reaction");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const { default: mongoose } = require("mongoose");

const reactionController = {};

const caculateReactions = async (targetId, targetType) => {
  const stats = await Reaction.aggregate([
    {
      $match: { targetId: new mongoose.Types.ObjectId(targetId) },
    },
    {
      $group: {
        _id: "$targetId",
        like: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "like"] }, 1, 0],
          },
        },
        dislike: {
          $sum: {
            $cond: [{ $eq: ["$emoji", "dislike"] }, 1, 0],
          },
        },
      },
    },
  ]);

  const reactions = {
    like: (stats[0] && stats[0].like) || 0,
    dislike: (stats[0] && stats[0].dislike) || 0,
  };
  await mongoose.model(targetType).findByIdAndUpdate(targetId, { reactions });

  return stats;
};

reactionController.saveReaction = catchAsync(async (req, res, next) => {
  const { targetType, targetId, emoji } = req.body;
  const currentUserId = req.userId;

  const targetObj = await mongoose.model(targetType).findById(targetId);
  if (!targetObj)
    throw new AppError(400, `${targetType} not found`, "Save reaction error");

  let reaction = await Reaction.findOne({
    targetType,
    targetId,
    author: currentUserId,
  });

  if (!reaction) {
    reaction = await Reaction.create({
      targetType,
      targetId,
      author: currentUserId,
      emoji,
    });
  } else {
    if (reaction.emoji === emoji) {
      await reaction.deleteOne({ _id: reaction._id });
    } else {
      reaction.emoji = emoji;
      await reaction.save();
    }
  }

  const reactions = await caculateReactions(targetId, targetType);

  return sendResponse(
    res,
    200,
    true,
    reactions,
    null,
    "Save reaction successfully"
  );
});

module.exports = reactionController;
