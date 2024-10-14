const express = require("express");

const router = express.Router();

const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEventById,
  deleteEventById,
  getEventsByCreatedBy,
} = require("../controllers/event");

router.post("/", createEvent);
router.get("/", getAllEvents);
router.get("/createdBy/:id", getEventsByCreatedBy);
router.get("/:id", getEventById);
router.put("/:id", updateEventById);
router.delete("/:id", deleteEventById);

module.exports = router;
