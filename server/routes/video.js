const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");

//=================================
//             Video
//=================================

router.post('/api/video')

module.exports = router;
