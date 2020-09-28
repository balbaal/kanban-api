const bcrypt = require("bcryptjs");
const Validator = require("fastest-validator");
const v = new Validator();
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_ACCESS_TOKEN_EXPIRED } = process.env;

// Model
const userModel = require("../models/User");

module.exports = {
  register: async (req, res) => {
    const { name, email, password, role } = req.body;

    const schemaValidation = {
      name: "string|min:3",
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
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "something wrong with the server" });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const resUser = await userModel.findOne({ email });
      if (!resUser) {
        return res
          .status(403)
          .json({ status: "error", message: "email/password is wrong" });
      }

      const passwordIsMatch = await bcrypt.compare(password, resUser.password);
      if (!passwordIsMatch) {
        return res
          .status(403)
          .json({ status: "error", message: "email/password is wrong" });
      }

      const token = jwt.sign(
        {
          email: resUser.email,
          id: resUser.id,
          name: resUser.name,
          role: resUser.role,
        },
        JWT_SECRET,
        { expiresIn: JWT_ACCESS_TOKEN_EXPIRED }
      );

      res.status(200).json({
        status: "success",
        message: `login success`,
        data: {
          token,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "error", message: "something wrong with the server" });
    }
  },
};
