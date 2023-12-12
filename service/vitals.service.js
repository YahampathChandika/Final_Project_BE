const { VitalSigns, Patients } = require("../models");

//Add Vital Signs
async function addVitalSigns(vitalSigns, patientId) {
    try {
        const patient = await Patients.findByPk(patientId);

        if(!patient){
            return {
                error : true,
                payload: "Patient not Found."
            }
        } else {
            const vitals = await VitalSigns.create(vitalSigns);
            return {
                error: false,
                payload: "Successfuly added Vital Signs."
            };
        }
    } catch (error) {
        throw error;
    }
}

//Get Patient Vital Signs
async function getVitalSigns(patientId) {
    try {
        const patient = await Patients.findByPk(patientId);
        if(!patient){
            return {
                error : true,
                payload: "Patient not Found."
            }
        }else {
            const vitalSigns = await VitalSigns.findAll({
                where: {
                    patientId: patientId
                }
            })

            const vitalSignsList = vitalSigns.map((vitals, index) => {
                const off = vitals.updatedAt.getTimezoneOffset() * 60000
                var newdt = new Date(vitals.updatedAt - off).toISOString()
                const dateAndTime = newdt.split('T')
                const datePart = dateAndTime[0];
                const timePart = dateAndTime[1].substring(0, 8);

                return {
                    id: vitals.id,
                    hospitalId: vitals.hospitalId,
                    heartRate: vitals.heartRate,
                    respiratoryRate: vitals.respiratoryRate,
                    supplementedO2: vitals.supplemented_O2,
                    O2saturation: vitals.O2saturation,
                    temperature: vitals.temperature,
                    systolicBP: vitals.systolicBP,
                    diastolicBP: vitals.diastolicBP,
                    avpuScore: vitals.avpuScore,
                    date: datePart,
                    time: timePart,
                    PatientId: vitals.PatientId
                }
            })
    
            return {
                error: false,
                payload: vitalSignsList
            };
        }
        
    } catch (error) {
        throw error;
    }
}

async function editVitalSigns(id, vitals) {
    try {
        const entry = await VitalSigns.findByPk(id);

        if(!entry) {
            return {
                error: true,
                status: 404,
                payload: "Vital signs ID not found!"
            }
        }
        else {
            await entry.update(vitals);
            return {
                error: false,
                status: 200,
                payload: "Vital signs updated successfully!"
            }
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    addVitalSigns,
    getVitalSigns,
    editVitalSigns
}