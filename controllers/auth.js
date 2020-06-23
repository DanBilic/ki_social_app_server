const passport = require("passport");

const CustomError = require("../utils/customError");
const asyncHandler = require("../middleware/asyncHandler");

//@desc     redirect user
//@route    GET /api/v1/auth/google/callback
//@acess    Public
exports.redirectUser = asyncHandler(async (req, res, next) => {
  res.redirect("/paws");
});

//@desc     logout user
//@route    GET /api/v1/auth/logout
//@acess    Public
exports.logoutUser = asyncHandler(async (req, res, next) => {
  //logout funktion wird automatisch von passport and das req objekt hinzugefügt
  // if you call logout it takes the cookie and destroys the id in there
  req.logout();
  res.redirect("/");
});

//@desc     get logged in user
//@route    GET /api/v1/auth/current_user
//@acess    Public
exports.currentUser = asyncHandler(async (req, res, next) => {
  //req.user added by the passport.deserializeUser function
  res.send(req.user);
});
