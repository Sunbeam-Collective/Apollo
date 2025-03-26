const express = require("express");
const router = express.Router();

const AppController = require("../controllers/app-controller");

router.get("/deezer/charts", AppController.getDeezerChart);
router.get("/deezer/tracks/:id", AppController.getDeezerTrack);
router.get("/deezer/search", AppController.getDeezerSearch);
router.get("/deezer/download", AppController.getTrackFile);

module.exports = router;
