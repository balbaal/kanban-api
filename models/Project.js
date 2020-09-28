const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const projectSchema = {
  projectName: {
    type: String,
    required: true,
  },
  userId: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
};

module.exports = mongoose.model("Project", projectSchema);
