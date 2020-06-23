const express = require("express");

const { getPaws, getPaw, createPaw } = require("../controllers/paw");

const router = express.Router();
const protectRoute = require("../middleware/protectRoute");

router.route("/").get(protectRoute, getPaws).post(protectRoute, createPaw);

router.route("/:id").get(protectRoute, getPaw);

module.exports = router;
