const Validator = require("fastest-validator");
const v = new Validator();

// Model
const projectModel = require("../models/Project");

module.exports = {
  createProject: async (req, res) => {
    const { projectName, userId } = req.body;

    const schemaValidation = {
      projectName: "string",
      userId: "string",
    };

    const resValidation = v.validate(req.body, schemaValidation);
    if (resValidation.length > 0) {
      return res.status(400).json({
        status: "error",
        message: resValidation,
      });
    }

    try {
      const resProject = await projectModel.create({ projectName });
      resProject.userId.push({ _id: userId });
      await resProject.save();

      res.status(201).json({
        status: "success",
        message: `project ${projectName} is created`,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `something wrong when create the project ${projectName}`,
      });
    }
  },
};
