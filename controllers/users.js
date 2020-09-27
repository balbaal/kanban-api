const bcrypt = require("bcryptjs");
const Validator = require("fastest-validator");
const v = new Validator();

// Model
const userModel = require("../models/User");

module.exports = {
  register: async (req, res) => {
    const { name, email, password, role } = req.body;

    const schemaValidation = {
      name: "string:min:3",
      email: "string|unique",
      password: "string|min:6",
      role: "string",
    };

    const resValidation = v.validate(req.body, schemaValidation);
    if (resValidation.length > 0) {
      return res.status(400).json({
        status: "error",
        message: resValidation,
      });
    }

    try {
      // checking email already exist
      const resUser = await userModel.find({ email });
      if (resUser.length > 0)
        return res
          .status(409)
          .json({ status: "error", message: `email: ${email} already exist` });

      const resRegister = await userModel.create({
        name,
        email,
        password,
        role,
      });
      res.status(201).json({
        status: "success",
        message: `success to create new user with email: ${email}`,
        data: {
          id: resRegister.id,
          name,
          email,
          role,
          token: "",
          refreshToken: "",
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "something wrong with the server" });
    }
  },
  login: (req, res) => {
    res.send("login user");
  },
};
