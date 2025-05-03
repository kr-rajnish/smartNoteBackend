const mongoose = require("mongoose");

const { Schema } = mongoose;

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide note content"],
    },
    summary: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

NoteSchema.index({ title: "text", content: "text", tags: "text" });

module.exports = mongoose.model("Note", NoteSchema);
