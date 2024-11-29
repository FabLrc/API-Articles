const express = require("express");
const articlesController = require("./articles.controller");
const router = express.Router();

router.get("/create", articlesController.create);
router.get("/:id", articlesController.update);
router.get("/:id", articlesController.delete);

module.exports = router;
