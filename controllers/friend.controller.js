const Friend = require("../models/Friend");
const { sendResponse, AppError, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const friendController = {};

const caculateFriendCount = async (userId) => {
  const friendCount = await Friend.countDocuments({
    $or: [{ from: userId }, { to: userId }],
    status: "accepted",
  });
  await User.findByIdAndUpdate(userId, { friendCount });
};

friendController.sendFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const toUserId = req.body.to;

  if (currentUserId === toUserId)
    throw new AppError(
      400,
      "Can't sent friend request to yourself",
      "Send Friend Request Error"
    );

  const user = await User.findById(toUserId);
  if (!user)
    throw new AppError(400, "User not found", "Send Friend Request Error");

  let friend = await Friend.findOne({
    $or: [
      { from: toUserId, to: currentUserId },
      { from: currentUserId, to: toUserId },
    ],
  });

  if (!friend) {
    friend = await Friend.create({
      from: currentUserId,
      to: toUserId,
      status: "pending",
    });
    sendResponse(res, 200, true, friend, null, "Request has been sent");
  } else {
    switch (friend.status) {
      case "pending":
        if (friend.from.equals(currentUserId)) {
          throw new AppError(
            400,
            "You have already sent a request to this user",
            "Add friend error"
          );
        } else {
          throw new AppError(
            400,
            "You have received a request from this user",
            "Add friend error"
          );
        }
      case "accepted":
        throw new AppError(400, "Users are already friend", "Add friend error");
      case "decline":
        friend.from = currentUserId;
        friend.to = toUserId;
        friend.status = "pending";
        await friend.save();
        return sendResponse(
          res,
          200,
          true,
          friend,
          null,
          "Request has been sent"
        );
      default:
        throw new AppError(400, "Friend status undefined", "Add friend error");
    }
  }
});

friendController.getReceivedFriendRequestList = catchAsync(
  async (req, res, next) => {
    let { page, limit, ...filter } = { ...req.query };
    const currentUserId = req.userId;

    let requestList = await Friend.find({
      to: currentUserId,
      status: "pending",
    });
    const requesterIDs = requestList.map((friend) => friend.from);

    const filterConditions = [{ _id: { $in: requesterIDs } }];
    if (filter.name) {
      filterConditions.push({
        name: { $regex: filter.name, $options: "i" },
      });
    }
    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const count = await User.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const users = await User.find(filterCriteria)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    const usersWithFriendShip = users.map((user) => {
      temp = user.toJSON();
      temp.friendship = requestList.find((friendship) => {
        if (friendship.from.equals(user._id)) return true;
        return false;
      });
      return temp;
    });

    return sendResponse(
      res,
      200,
      true,
      { users: usersWithFriendShip, totalPages, count },
      null,
      "Get incomming request successfully"
    );
  }
);

friendController.getSentFriendRequestList = catchAsync(
  async (req, res, next) => {
    let { page, limit, ...filter } = { ...req.query };
    const currentUserId = req.userId;

    let requestList = await Friend.find({
      from: currentUserId,
      status: "pending",
    });
    const requesterIDs = requestList.map((friend) => friend.to);

    const filterConditions = [{ _id: { $in: requesterIDs } }];
    if (filter.name) {
      filterConditions.push({
        name: { $regex: filter.name, $options: "i" },
      });
    }
    const filterCriteria = filterConditions.length
      ? { $and: filterConditions }
      : {};

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const count = await User.countDocuments(filterCriteria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);

    const users = await User.find(filterCriteria)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    const usersWithFriendShip = users.map((user) => {
      temp = user.toJSON();
      temp.friendship = requestList.find((friendship) => {
        if (friendship.to.equals(user._id)) return true;
        return false;
      });
      return temp;
    });

    return sendResponse(
      res,
      200,
      true,
      { users: usersWithFriendShip, totalPages, count },
      null,
      "Get outgoing request successfully"
    );
  }
);

friendController.getFriendList = catchAsync(async (req, res, next) => {
  let { page, limit, ...filter } = { ...req.query };
  const currentUserId = req.userId;

  let friendList = await Friend.find({
    $or: [{ from: currentUserId }, { to: currentUserId }],
    status: "accepted",
  });

  const friendIDs = friendList.map((friend) => {
    if (friend.from.equals(currentUserId)) return friend.to;
    return friend.from;
  });

  const filterConditions = [{ _id: { $in: [friendIDs] } }];
  if (filter.name) {
    filterConditions.push({
      name: { $regex: filter.name, $options: "i" },
    });
  }
  const filterCriteria = filterConditions.length
    ? { $and: filterConditions }
    : {};

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const count = await User.countDocuments(filterCriteria);
  const totalPages = Math.ceil(count / limit);
  const offset = limit * (page - 1);

  const users = await User.find(filterCriteria)
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  const usersWithFriendShip = users.map((user) => {
    let temp = user.toJSON();
    temp.friendship = friendList.find((friendship) => {
      if (friendship.from.equals(user._id) || friendship.to.equals(user._id))
        return true;
      return false;
    });
    return temp;
  });

  return sendResponse(
    res,
    200,
    true,
    { users: usersWithFriendShip, totalPages, count },
    null,
    "Get friends successfully"
  );
});

friendController.reactFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const fromUserId = req.params.userId;
  const { status } = req.body;

  let friend = await Friend.findOne({
    from: fromUserId,
    to: currentUserId,
    status: "pending",
  });
  if (!friend)
    throw new AppError(
      400,
      "Friend Request Not Found",
      "React Friend Request Error"
    );

  friend.status = status;
  await friend.save();
  if (status === "accepted") {
    await caculateFriendCount(currentUserId);
    await caculateFriendCount(fromUserId);
  }

  return sendResponse(
    res,
    200,
    true,
    friend,
    null,
    "React friend request successfully"
  );
});

friendController.cancelFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const toUserId = req.params.userId;

  const friend = await Friend.findOne({
    from: currentUserId,
    to: toUserId,
    status: "pending",
  });
  if (!friend)
    throw new AppError(400, "Friend Request not found", "Cancel request error");

  await Friend.deleteOne({
    from: currentUserId,
    to: toUserId,
    status: "pending",
  });

  return sendResponse(
    res,
    200,
    true,
    friend,
    null,
    "Friend request has been cancelled"
  );
});

friendController.removeFriend = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const friendId = req.params.userId;

  const friend = await Friend.findOne({
    $or: [
      { from: currentUserId, to: friendId },
      { from: friendId, to: currentUserId },
    ],
    status: "accepted",
  });

  if (!friend)
    throw new AppError(400, "Friend not found", "Remove friend error");

  await Friend.deleteOne({
    $or: [
      { from: currentUserId, to: friendId },
      { from: friendId, to: currentUserId },
    ],
    status: "accepted",
  });
  await caculateFriendCount(currentUserId);
  await caculateFriendCount(friendId);

  return sendResponse(
    res,
    200,
    true,
    friend,
    null,
    "Remove friend successfully"
  );
});

module.exports = friendController;
