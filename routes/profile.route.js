const router = require("express").Router();
const checkpoint = require("../middlewares/checkpoint");

const {updateController,
    readController,
    deleteController,
adminController,
admindeleteController,
adminreadController}=require("../controllers/profile.controller");

//if any errors plz help _/|\_

router.delete("/:profileId",deleteController);

router.get("/:profileId",readController);

router.put("/:update",updateController)

router.delete("/:profileId",admindeleteController);

router.get("/:profileId",adminreadController);

router.put("/:update",adminController)

module.exports=router;

