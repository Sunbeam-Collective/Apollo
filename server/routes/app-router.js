const express = require('express');
const router = express.Router();

const AppController = require('../controllers/app-controller')

router.get('/deezer/charts', AppController.getDeezerChart);
router.get('/deezer/tracks/:id', AppController.getDeezerTrack);

module.exports = router;
