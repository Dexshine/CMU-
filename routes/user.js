const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

// authMiddleware.protect,
router.get("/", userController.index);
router.get("/:id", userController.show);
router.patch("/:id", userController.update);

module.exports = router;
