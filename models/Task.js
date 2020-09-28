const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const taskSchema = {
  taskTitle: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "new",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  projectId: {
    type: ObjectId,
    ref: "Project",
  },
  owner: {
    type: String,
    required: true,
  },
};

module.exports = mongoose.model("Task", taskSchema);
