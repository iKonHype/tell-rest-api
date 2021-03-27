const router = require("express").Router();
const checkpoint = require("../middlewares/checkpoint");

const {updateController,
    readController,
    deleteController}=require("../controllers/profile.controller");

//ill finish this in saturday  ;)

router.delete("/:profileId",deleteController);

router.get("/:profileId",readController);

router.put("/:update",updateController)

module.exports=router;

