const express = require("express");
const router = express.Router();
const epicsService = require("../services/epic-services");
const {
  authorizeRequest,
  authenticateUser,
  isLoggedIn,
  isOwnerOfEpic,
} = require("../middleWare/auth");

router.get("/", authenticateUser, isLoggedIn, async (req, res) => {
  res.send(await epicsService.getAllEpics(req.user));
});

router.post("/", authenticateUser, isLoggedIn, async (req, res) => {
  try {
    const newEpic = await epicsService.createEpic(req.body.name,req.user);
    res.status(201).send(newEpic);
  } catch (err) {
    if (err.errno === 19) {
      res.status(404).send({
        error: "Epic name alredy exits",
      });
    } else {
      console.error(err);
      res.status(500).send({
        message: "internal server error",
      });
    }
  }
});

router.get(
  "/:id",
  authenticateUser,
  isLoggedIn,
  isOwnerOfEpic,
  async (req, res) => {
    const epic = await epicsService.getEpicById(Number(req.params.id));
    if (epic) {
      res.send(epic);
    } else {
      res.status(404).send({
        message: "Epic not found",
      });
    }
  }
);

router.delete(
  "/:id",
  authenticateUser,
  isLoggedIn,
  isOwnerOfEpic,
  async (req, res) => {
    const epic = await epicsService.deleteEpic(Number(req.params.id));
    if (epic) {
      res.send(epic);
    } else {
      res.status(404).send({
        message: "epic already deleted",
      });
    }
  }
);

router.put(
  "/:id",
  authenticateUser,
  isLoggedIn,
  isOwnerOfEpic,
  async (req, res) => {
    const epicUpdate = await epicsService.updateEpic(
      Number(req.params.id),
      req.body.name
    );
    if (!epicUpdate) {
      res.status(404).send({ message: "Epic not found" });
      return;
    }
    res.send(epicUpdate);
  }
);

module.exports = router;
