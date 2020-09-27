const bcrypt = require("bcryptjs");

// Model
const userModel = require("../models/User");

module.exports = {
  register: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      // checking email already exist
      const resUser = await userModel.find({ email });
      if (resUser.length > 0)
        return res
          .status(409)
          .json({ status: "error", message: `email: ${email} already exist` });

      await userModel.create({ name, email, password });
      res.status(201).json({
        status: "success",
        message: `success to create new user with email: ${email}`,
        data: { name, email, token: "", refreshToken: "" },
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
