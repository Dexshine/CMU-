const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    id: { type: String, unique: true },
    title: { type: String },
    detail: { type: String },
    tags: { type: [String] },
    start_date: { type: Date },
    end_date: { type: Date },
    location: { type: String },
    faculties: { type: [String] },
    images: { type: [String] },
    email: { type: String },
    phone: { type: String },
    other_contact: { type: String },
    is_from_corp: { type: Boolean },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["draft", "publish", "cancel"],
      default: "draft",
    },
  },
  {
    timestamps: true,
    collection: "events",
    toJSON: { virtuals: true },
  }
);

eventSchema.virtual("user", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

eventSchema.pre("save", async function (next) {
  if (!this.id) {
    const Event = mongoose.model("Event", eventSchema);
    const currentYear = new Date().getFullYear();
    const lastEvent = await Event.findOne().sort({ id: -1 });

    let newIdNumber = 1;
    if (lastEvent) {
      const lastEventYear = parseInt(lastEvent.id.slice(5, 9), 10);
      if (lastEventYear === currentYear) {
        newIdNumber = parseInt(lastEvent.id.slice(9), 10) + 1;
      }
    }

    this.id = `event${currentYear}${String(newIdNumber).padStart(4, "0")}`;
  }
  next();
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
