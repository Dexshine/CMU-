const Review = require("../models/review");
const Event = require("../models/event");

exports.insert = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();

    res.status(201).send(review);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.index = async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Show requests by userId or eventId
exports.showBy = async (req, res) => {
  try {
    const { user_id, event_id, status } = req.query;
    let query = {};

    if (user_id) {
      query.user_id = user_id;
    }
    if (event_id) {
      query.event_id = event_id;
    }

    if (status) {
      query.status = status;
    }

    const reviews = await Review.find(query).populate("event");
    if (reviews.length === 0) {
      return res.status(200).send({
        message: "Request not found",
        data: [],
      });
    }
    res.status(200).send({
      message: "Request retrieved successfully",
      data: reviews,
      query,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.showByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ user_id: userId }).populate("event");

    if (reviews.length === 0) {
      return res.status(404).send({
        message: "Request not found",
      });
    }
    res.status(200).send({
      message: "Request retrieved successfully",
      data: reviews,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Show a single request by ID
exports.show = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).send();
    }
    res.status(200).send(review);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a request by ID
exports.update = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!review) {
      return res.status(404).send();
    }

    res.status(200).send(review);
  } catch (error) {
    res.status(400).send({
      message: "Error updating request with id " + req.params.id,
      error: error.message,
    });
  }
};
// Update a single request by userId or eventId
exports.updateBy = async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    let query = {};

    if (userId) {
      query.user_id = userId;
    }
    if (eventId) {
      query.event_id = eventId;
    }

    const found = await Review.findOneAndUpdate(query, req.body, {
      new: true,
      runValidators: true,
    });

    if (!found) {
      return res.status(404).send({
        message: "Request not found",
      });
    }

    res.status(200).send({
      message: "Request updated successfully",
      data: found,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error updating request with id " + req.params,
      error: error.message,
    });
  }
};

// Destroy a request by ID
exports.destroy = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).send();
    }
    res.status(200).send(review);
  } catch (error) {
    res.status(500).send(error);
  }
};
