//#region IMPORTS
const express = require("express");
const router = express.Router();
const { upload } = require("../helpers/FileStorageEngine");
const transport = require("../controllers/transport.controller");
const got = require("got");

router.get("/:filename", transport.downloadImage);
router.post("/add", upload.single("image"), transport.uploadImage);

// router.post("/email", async (req, res) => {
//   try {
//     const { body } = await got.post(
//       "https://us-central1-sewa-5df00.cloudfunctions.net/app/email/send",
//       {
//         json: {
//           userEmail: "alwiskaveen@gmail.com",
//           emailSubject: "TEll | New Complaint Placement Notification",
//           emailBody: `<h1>Hello Kaveen!</h1><h4>We have received your new complaint. We will take neccessary actions as soon as possible</h4><h3>Complaint Id: tell-6BDR34SD12</h3><p>Thank you.</p><p>Best Regards<br/>Customer support, Tell Inc</p>`,
//         },
//         responseType: "json",
//       }
//     );
//     res.status(200).json(body);
//   } catch (error) {
//     res.status(500).json({ result: error.message });
//   }
// });

module.exports = router;
