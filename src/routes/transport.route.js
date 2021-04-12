//#region IMPORTS
const express = require("express");
const router = express.Router();
const { upload } = require("../helpers/FileStorageEngine");
const transport = require("../controllers/transport.controller");

router.get("/:filename", transport.downloadImage);
router.post("/add", upload.single("image"), transport.uploadImage);

module.exports = router;
