const Event = require("../models/event");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const bucket = require("./../config/firebase"); // Import your configured Firebase bucket
const User = require("../models/user");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const sharp = require("sharp");

// Configure multer for image file handling
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Limit file size to 3MB
  fileFilter: async (req, file, cb) => {
    // Accept only image files
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(file.originalname.toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (!mimeType || !extname) {
      return cb(new Error("Only image files are allowed!"));
    }

    try {
      // Read the image metadata
      const image = sharp(file.buffer);
      const metadata = await image.metadata();

      // Check image dimensions
      const maxWidth = 1920; // Set your desired max width
      const maxHeight = 1080; // Set your desired max height

      if (metadata.width > maxWidth || metadata.height > maxHeight) {
        return cb(
          new Error(
            `Image dimensions must not exceed ${maxWidth}x${maxHeight} pixels.`
          )
        );
      }

      cb(null, true);
    } catch (error) {
      cb(new Error("Error processing image. Please try again."));
    }
  },
});

const generateImageUrl = (fileName) => {
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
};

// Upload images to Firebase Storage and return public URLs
const uploadImagesToFirebase = async (files) => {
  const uploadedImages = [];

  for (const file of files) {
    // Create a unique file name and upload path
    const fileName = `events/${uuidv4()}-${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    // Write file buffer to Firebase Storage
    await new Promise((resolve, reject) => {
      blobStream.on("error", (error) => {
        reject(error);
      });

      blobStream.on("finish", async () => {
        // After uploading, make the file public
        await blob.makePublic();

        // const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        // uploadedImages.push(publicUrl);
        uploadedImages.push(fileName);
        resolve();
      });

      blobStream.end(file.buffer);
    });
  }

  return uploadedImages;
};

// Create a new event with image upload
exports.createEvent = async (req, res) => {
  upload.array("images", 3)(req, res, async (err) => {
    if (err) {
      return res.status(400).send({
        message: "Error uploading images",
        error: err.message,
      });
    }

    try {
      // Upload images to Firebase and get URLs
      const imageUrls = await uploadImagesToFirebase(req.files);

      // Create a new event with the image URLs
      const event = new Event({
        ...req.body,
        images: imageUrls, // Include the uploaded image URLs
      });

      await event.save();
      res.status(201).send({
        message: "Event created successfully",
        data: event,
      });
    } catch (error) {
      res.status(400).send({
        message: "Error creating event",
        error: error.message,
      });
    }
  });
};

// Read all events
exports.getAllEvents = async (req, res) => {
  try {
    let query = {
      status: "publish",
    };
    if (req.query.status) {
      query.status = req.query.status;
    }

    const events = await Event.find(query);

    const mapImages = events.map((event) => {
      return {
        ...event._doc,
        images: event.images.map((image) => {
          return generateImageUrl(image);
        }),
      };
    });

    res.status(200).send({
      message: "Events retrieved successfully",
      data: mapImages,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving events",
      error: error.message,
    });
  }
};

// Read a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ id: req.params.id }).populate("user");

    const mapImages = {
      images: event.images.map((image) => {
        return generateImageUrl(image);
      }),
    };

    Object.assign(event, mapImages);

    if (!event) {
      return res.status(404).send({
        message: "Event not found",
      });
    }
    res.status(200).send({
      message: "Event retrieved successfully 1",
      data: event,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving event",
      error: error.message,
    });
  }
};

exports.getEventsByCreatedBy = async (req, res) => {
  try {
    console.log("---->getEventsByCreatedBy", req.params.id);

    let events = await Event.find();

    events = events.filter((event) => {
      return event.createdBy.toString() === req.params.id;
    });

    const mapImages = events.map((event) => {
      return {
        ...event._doc,
        images: event.images.map((image) => {
          return generateImageUrl(image);
        }),
      };
    });

    res.status(200).send({
      message: "Events retrieved successfully",
      data: mapImages,
      // events,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving events",
      error: error.message,
    });
  }
};

exports.updateEventById = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).send({
        message: "Event not found",
      });
    }
    res.status(200).send({
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error updating event",
      error: error.message,
    });
  }
};

// Delete an event by ID
exports.deleteEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ id: req.params.id });

    if (!event) {
      return res.status(404).send({
        message: "Event not found",
      });
    }

    await Event.findOneAndDelete({ id: req.params.id });
    res.status(200).send({
      message: "Event deleted successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting event",
      error: error.message,
    });
  }
};

