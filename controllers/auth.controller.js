const { AppError, sendResponse, catchAsync } = require("../helpers/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authConttroller = {};

authConttroller.loginWithEmail = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email }, "+password");
  if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "Wrong password", "Login Error");

  const accessToken = await user.generateToken();
  user = user.toJSON();

  sendResponse(res, 200, true, { user, accessToken }, null, "Login successful");
});

module.exports = authConttroller;
