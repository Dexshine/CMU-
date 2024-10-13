const express = require("express");

const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
} = require("../controllers/event");

router.post("/", createEvent);
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEventById);
router.delete("/:id", deleteEventById);

module.exports = router;
