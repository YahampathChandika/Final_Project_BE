const vitalService = require("../service/vitals.service");

//Add Vital Signs
async function addVitalSigns(req, res) {
  try {
    const vitals = req.body;
    const patientId = req.body.PatientId;
    const result = await vitalService.addVitalSigns(vitals, patientId);
    const result2 = await vitalService.createAlerts(patientId);

    if (result.error) {
      return res.status(400).json({
        error: true,
        payload: result.payload,
      });
    } else {
      return res.status(200).json({
        error: false,
        payload: result.payload,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      payload: error.message,
    });
  }
}

//Get Vital Signs of a patient
async function getVitalSigns(req, res) {
  try {
    const { patientId } = req.params;
    const result = await vitalService.getVitalSigns(patientId);

    if (result.error) {
      return res.status(404).json({
        error: true,
        payload: result.payload,
      });
    } else {
      return res.status(200).json({
        error: false,
        payload: result.payload,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      payload: error.message,
    });
  }
}

//Edit Vital Signs
async function editVitalSigns(req, res) {
  try {
    const { vitalId } = req.params;
    const editedVitals = req.body;

    const result = await vitalService.editVitalSigns(vitalId, editedVitals);

    if (result.error) {
      return res.status(result.status).json({
        error: true,
        payload: result.payload,
      });
    } else {
      return res.status(result.status).json({
        error: false,
        payload: result.payload,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      payload: error,
    });
  }
}

//Delete Vital Signs
async function deleteVitalSign(req, res) {
  try {
    const { vitalSignId, patientId } = req.params;

    const deleteResponse = await vitalService.deleteVitalSign(vitalSignId);
    if (deleteResponse.error) {
      return res.status(deleteResponse.status).json({
        error: true,
        payload: deleteResponse.payload,
      });
    }

    const alertResponse = await vitalService.createAlerts(patientId);
    if (alertResponse.error) {
      return res.status(alertResponse.status).json({
        error: true,
        payload: alertResponse.payload,
      });
    }

    return res.status(deleteResponse.status).json({
      error: false,
      payload: deleteResponse.payload,
    });
  } catch (error) {
    console.error("Error in deleteVitalSignController:", error);
    return res.status(500).json({
      error: true,
      payload: "An error occurred while deleting the vital sign.",
    });
  }
}

module.exports = {
  addVitalSigns,
  getVitalSigns,
  editVitalSigns,
  deleteVitalSign,
};
