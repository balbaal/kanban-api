const Validator = require("fastest-validator");
const v = new Validator();

// Model
const projectModel = require("../models/Project");

module.exports = {
  createProject: (req, res) => {
    res.json(req.body);
  },
};
