const express = require("express");

const userRoutes = require("./user.routes");
const patientRoutes = require("./patients.routes");
const vitalsRoutes = require("./vitals.routes");
const bedsRoutes = require("./beds.routes");

function routes() {

    const router = express.Router();
    
    router.use("/user", userRoutes);
    router.use("/patient", patientRoutes);
    router.use("/vitals", vitalsRoutes);
    router.use("/bed", bedsRoutes);

    return router;
}

module.exports = routes();