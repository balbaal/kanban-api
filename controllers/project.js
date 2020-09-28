const Validator = require("fastest-validator");
const { findByIdAndDelete, findById } = require("../models/Project");
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
        data: { id: resProject._id, projectName: resProject.projectName },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `something wrong when create the project ${projectName}`,
      });
    }
  },
  getProjectByUserId: async (req, res) => {
    const { userId } = req.params;
    const schemaValidation = {
      userId: "string",
    };

    const resValidation = v.validate(req.params, schemaValidation);
    if (resValidation.length > 0) {
      return res.status(400).json({
        status: "error",
        message: resValidation,
      });
    }

    try {
      const resProject = await projectModel.find({ userId }).populate({
        path: "userId",
        select: "name",
      });
      res.status(200).json({
        status: "success",
        message: "success to get all project list",
        data: resProject,
      });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(500).json({
        status: "error",
        message: `something wrong when trying to get project`,
      });
    }
  },
  updateProjectById: async (req, res) => {
    const { projectName, projectId } = req.body;

    const schemaValidation = {
      projectId: "string",
      projectName: "string",
    };

    const resValidation = v.validate(req.body, schemaValidation);
    if (resValidation.length > 0) {
      return res.status(400).json({
        status: "error",
        message: resValidation,
      });
    }

    try {
      const resProject = await projectModel.findById(projectId);
      resProject.projectName = projectName;
      await resProject.save();

      res.status(201).json({
        status: "success",
        message: `success to update project name with id: ${projectId}`,
      });
    } catch (error) {
      console.log("error :>> ", error);
      res.status(500).json({
        status: "error",
        message: `something wrong trying to update project id: ${projectId}`,
      });
    }
  },
};
