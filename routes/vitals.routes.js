const express = require("express");
const vitalController = require("../controller/vitals.controller");

function getVitalRoutes() {
  const router = express.Router();

  router.use(express.json());

  router.post("/addVitals", vitalController.addVitalSigns);
  router.get("/:patientId", vitalController.getVitalSigns);
  router.patch("/editVitals/:vitalId", vitalController.editVitalSigns);
  router.delete('/deleteVitalSign/:vitalSignId/:patientId', vitalController.deleteVitalSign);

  return router;
}

module.exports = getVitalRoutes();
