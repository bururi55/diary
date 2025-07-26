const express = require("express");
const {
  getUsers,
  getRoles,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const hasRole = require("../middlewares/hasRole");
const authenticated = require("../middlewares/authenticated");
const mapUser = require("../helpers/mapUser");
const ROLES = require("../constants/roles");

const router = express.Router({ mergeParams: true });

router.get("/", authenticated, hasRole([ROLES.ADMIN]), async (req, res) => {
  try {
    const users = await getUsers();
    res.send({ data: users.map(mapUser) });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get(
  "/roles",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    try {
      const roles = getRoles();
      res.send({ data: roles });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

router.patch(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    try {
      const newUser = await updateUser(req.params.id, {
        role: req.body.roleId,
      });
      res.send({ data: mapUser(newUser) });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

router.delete(
  "/:id",
  authenticated,
  hasRole([ROLES.ADMIN]),
  async (req, res) => {
    try {
      await deleteUser(req.params.id);
      res.send({ error: null });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

module.exports = router;
