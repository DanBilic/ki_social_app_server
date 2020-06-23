const mongoose = require("mongoose");
const Paw = mongoose.model("Paw");

const CustomError = require("../utils/customError");
const asyncHandler = require("../middleware/asyncHandler");

//@desc     get all paws
//@route    GET /api/v1/paws
//@access   Public
exports.getPaws = asyncHandler(async (req, res, next) => {
  const paws = await Paw.find({ _user: req.user.id });

  res.status(200).json({
    success: true,
    data: paws,
  });
});

//@desc     get a single paw
//@route    GET /api/v1/paws/:id
//@access   Public
exports.getPaw = asyncHandler(async (req, res, next) => {
  const paw = await Paw.findById(req.params.id);

  //paw with given id does not exist but id is correctly formatted
  if (!paw) {
    return next(
      new CustomError(`paw not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: paw,
  });
});

//@desc     create a paw
//@route    POST /api/v1/paws
//@access   Public
exports.createPaw = asyncHandler(async (req, res, next) => {
  const { title, ingredients, description } = req.body;

  const paw = new Paw({
    title,
    ingredients,
    description,
    _user: req.user.id,
    createdAt: Date.now(),
  });

  await paw.save();

  res.status(200).json({
    success: true,
    data: paw,
  });
});
