const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const authMiddleware = require("../middleware/authMiddleware");

// authMiddleware.protect,
router.get("/:id", userController.show);
router.patch("/:id", userController.update);

module.exports = router;
