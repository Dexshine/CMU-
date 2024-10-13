const User = require("../models/user");

exports.show = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });

    res.status(200).json({
      message: "User profile retrieved successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({
      message: "User profile updated successfully",
      data: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
