const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requestSchema = new Schema(
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
      enum: ["join", "cancel"],
      default: "join",
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
    collection: "requests",
    toJSON: { virtuals: true },
  }
);

requestSchema.virtual("event", {
  ref: "Event",
  localField: "event_id",
  foreignField: "id",
  justOne: true,
});

requestSchema.pre("save", async function (next) {
  if (!this.id) {
    const Request = mongoose.model("Request", requestSchema);

    const lastEvent = await Request.findOne().sort({ id: -1 });

    let newIdNumber = 1;

    if (lastEvent) {
      newIdNumber = parseInt(lastEvent.id.slice(8), 10) + 1;
    }

    this.id = `request-${String(newIdNumber).padStart(4, "0")}`;
  }
  next();
});

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;
