const express = require("express");
const { upload } = require("../controllers/uploadController");
const router = express.Router();

router.post("/upload", upload);

module.exports = router;
