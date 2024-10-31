const express = require("express");
const router = express.Router();
const controller = require("../controllers/review");

router.get("/", controller.index);
router.get("/showBy", controller.showBy);
router.get("/user/:userId", controller.showByUser);
// router.get("/", controller.show);
router.post("/", controller.insert);
router.patch("/:userId/:eventId", controller.updateBy);
// router.delete("/:id", controller.destroy);

module.exports = router;
