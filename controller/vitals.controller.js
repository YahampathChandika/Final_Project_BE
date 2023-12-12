const vitalService = require("../service/vitals.service");

//Add Vital Signs
async function addVitalSigns(req,res) {
    try {
        const vitals = req.body;
        const patientId = req.body.PatientId;
        const result = await vitalService.addVitalSigns(vitals, patientId);
        
        if(result.error) {
            return res.status(500).json ({
                error: true,
                payload: result.payload
            })
        } else {
            return res.status(200).json ({
                error: false,
                payload: result.payload
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            error: true,
            payload: error.message
        })
    }
}

//Get Vital Signs of a patient
async function getVitalSigns(req, res) {
    try {
        const { patientId } = req.params;
        const result = await vitalService.getVitalSigns(patientId);

        if(result.error) {
            return res.status(404).json ({
                error: true,
                payload: result.payload
            })
        } else {
            return res.status(200).json ({
                error: false,
                payload: result.payload
            })
        }

    } catch (error) {
        return res.status(500).json ({
            error: true,
            payload: error.message
        })
    }
}

async function editVitalSigns(req, res) {
    try {
        const {vitalId} = req.params;
        const editedVitals = req.body;

        const result = await vitalService.editVitalSigns(vitalId, editedVitals);

        if (result.error) {
            return res.status(result.status).json ({
                error: true,
                payload: result.payload
            })
        } else {
            return res.status(result.status).json ({
                error: false,
                payload: result.payload
        })}
    } catch (error) {
        console.log(error);
        return res.status(500).json ({
            error: true,
            payload: error
        })
    }
}

module.exports = {
    addVitalSigns,
    getVitalSigns,
    editVitalSigns
}