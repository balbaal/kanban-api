module.exports = {
  register: (req, res) => {
    const { name, email, password } = req.body;

    res.status(201).json(req.body);
  },
  login: (req, res) => {
    res.send("login user");
  },
};
