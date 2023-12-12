const express = require("express");
const patientController = require("../controller/patient.controller")
const authMiddleware = require("../middleware/auth.middleware");

function getPatientRoutes(){
    const router = express.Router();

    router.use(express.json());
    router.use(authMiddleware);

    router.post("/registerPatient", patientController.registerPatient);
    
    router.get("/getAllPatients", patientController.getAllPatients);
    router.get("/allPatientMatrices", patientController.getAllPatientMatrices);
    router.get("/byId/:id", patientController.getPatientById);
    router.get("/admittedPatients", patientController.getAdmittedPatients);
    router.get("/admittedPatientMatrices", patientController.getAdmittedPatientMatrices);
   
    router.put("/updatePatient/:id", patientController.updatePatient );
    
    router.delete("/deletePatient/:id", patientController.deletePatient);
    
    router.patch("/dischargePatient/:patientId", patientController.dischargePatient);
    
    router.post("/reAdmit/:patientId", patientController.reAdmitPatient);

    return router;
}

module.exports =  getPatientRoutes(); 
 
 

