import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema({
  event: [
    {
      title: { type: String },
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Calendar =
  mongoose.models.Calendar || mongoose.model("Calendar", calendarSchema);

export default Calendar;
