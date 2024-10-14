const Request = require("../models/request");
const Event = require("../models/event");

// Insert a new request
exports.insert = async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();

    res.status(201).send(request);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Index all requests
exports.index = async (req, res) => {
  try {
    const requests = await Request.find({});
    res.status(200).send(requests);
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

    const requests = await Request.find(query);
    if (requests.length === 0) {
      return res.status(200).send({
        message: "Request not found",
        data: [],
      });
    }
    res.status(200).send({
      message: "Request retrieved successfully",
      data: requests,
      query,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.showByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const requests = await Request.find({ user_id: userId }).populate("event");

    if (requests.length === 0) {
      return res.status(404).send({
        message: "Request not found",
      });
    }
    res.status(200).send({
      message: "Request retrieved successfully",
      data: requests,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

// Show a single request by ID
exports.show = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).send();
    }
    res.status(200).send(request);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a request by ID
exports.update = async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!request) {
      return res.status(404).send();
    }

    res.status(200).send(request);
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

    const found = await Request.findOneAndUpdate(query, req.body, {
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
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).send();
    }
    res.status(200).send(request);
  } catch (error) {
    res.status(500).send(error);
  }
};
