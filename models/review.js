const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    id: {
      type: String,
      // required: true,
      unique: true,
    },
    event_id: {
      type: String,
      required: true,
      ref: "Event",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["interested", "cancel"],
      default: "interested",
    },
    rating: {
      content: {
        type: Number,
        min: 0,
        max: 5,
      },
      date_time: {
        type: Number,
        min: 0,
        max: 5,
      },
      location: {
        type: Number,
        min: 0,
        max: 5,
      },
      staff: {
        type: Number,
        min: 0,
        max: 5,
      },
    },
  },
  {
    timestamps: true,
    collection: "reviews",
    toJSON: { virtuals: true },
  }
);

schema.virtual("event", {
  ref: "Event",
  localField: "event_id",
  foreignField: "id",
  justOne: true,
});

schema.pre("save", async function (next) {
  if (!this.id) {
    const Model = mongoose.model("Review", schema);

    const lastEvent = await Model.findOne().sort({ id: -1 });

    let newIdNumber = 1;

    if (lastEvent) {
      newIdNumber = parseInt(lastEvent.id.slice(8), 10) + 1;
    }

    this.id = `review-${String(newIdNumber).padStart(4, "0")}`;
  }
  next();
});

const Review = mongoose.model("Review", schema);

module.exports = Review;
