const Validator = require("fastest-validator");
const { restart } = require("nodemon");
const v = new Validator();

// Model
const projectModel = require("../models/Project");
const taskModel = require("../models/Task");

module.exports = {
  // Project Controller
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

  // Task Controller
  createTask: async (req, res) => {
    const { taskTitle, taskDescription, projectId, owner } = req.body;

    const schemaValidation = {
      taskTitle: "string|empty:false",
      taskDescription: "string|empty:false",
      projectId: "string|empty:false",
      owner: "string|empty:false",
    };

    const resValidation = v.validate(req.body, schemaValidation);
    if (resValidation.length > 0) {
      return res.status(400).json({
        status: "error",
        message: resValidation,
      });
    }

    try {
      const payload = {
        taskTitle,
        taskDescription,
        projectId,
        owner,
      };
      const resTask = await taskModel.create(payload);

      res.status(201).json({
        status: "success",
        message: `success to created task with id: ${resTask._id}`,
        data: {
          id: resTask._id,
          taskTitle: resTask.taskTitle,
          taskDescription: resTask.taskDescription,
          createdDate: resTask.createdDate,
          status: resTask.status,
          owner: resTask.owner,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `something wrong trying to create task ${taskTitle}`,
      });
    }
  },
  getTaskByProjectId: async (req, res) => {
    const { projectId } = req.params;

    try {
      const resTask = await taskModel.find({ projectId });
      res.status(200).json({
        status: "success",
        message: `success get task by project id: ${projectId}`,
        data: resTask,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `something wrong trying to get task by project id: ${projectId}`,
      });
    }
  },
  updateStatusTask: async (req, res) => {
    const { taskId, status } = req.body;

    try {
      const resTask = await taskModel.findById(taskId);
      resTask.status = status;
      await resTask.save();

      res.status(201).json({
        status: "success",
        message: `success update status to ${status}`,
        data: resTask,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: `something wrong trying to get task by id: ${taskId}`,
      });
    }
  },
};
