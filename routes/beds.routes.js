const express = require("express");
const bedsController = require("../controller/beds.controller")

function getBedsRoutes(){
    const router = express.Router();

    router.use(express.json());

    router.post("/addBed", bedsController.addBeds );
    router.get("/getAllBeds", bedsController.getAllBeds);
    router.get("/getAvailableBeds", bedsController.getAvailableBeds);

    return router;
}

module.exports = getBedsRoutes();