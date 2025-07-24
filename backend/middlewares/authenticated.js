const { verify } = require("../helpers/token");
const User = require("../models/User");

const authenticated = async function (req, res, next) {
  try {
    const tokenData = verify(req.cookies.token);
    const user = await User.findOne({ _id: tokenData.id });
    if (!user) {
      return res.status(401).send({ error: "Authenticated user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = authenticated;
