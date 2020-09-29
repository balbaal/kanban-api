const express = require("express");
const router = express.Router();

const userController = require("../controllers/users");
const projectController = require("../controllers/project");

// routing user
router.post("/register", userController.register);
router.post("/login", userController.login);

// routing project
router.post("/project", projectController.createProject);
router.get("/project/:userId", projectController.getProjectByUserId);
router.put("/project", projectController.updateProjectById);
router.delete("/project/:projectId", projectController.deleteProject);

// routing task
router.post("/task", projectController.createTask);
router.get("/task/:projectId", projectController.getTaskByProjectId);
router.put("/task", projectController.updateStatusTask);
router.delete("/task/:taskId", projectController.deleteTask);
router.put("/task/update", projectController.updateTaskById);

module.exports = router;
