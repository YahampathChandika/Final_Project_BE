const { where } = require("sequelize");
const { VitalSigns, Patients, Alerts } = require("../models");

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

//Create Alerts
async function createAlerts(vitalSigns, patientId) {
    try {
        const patient = await Patients.findByPk(patientId);

        if (!patient) {
            return {
                error: true,
                status: 404,
                payload: "Patient not Found."
            };
        }

        var alertCount = 0;
        var alerts = {
            PatientId: patientId,
        };
        const { heartRate, respiratoryRate, supplemented_O2, O2saturation, temperature, systolicBP, diastolicBP } = vitalSigns;

        // Heart rate
        switch (true) {
            case (heartRate < 60): {
                alertCount += 1;
                alerts.heartRate = "Bradycardia";
                break;
            }
            case (heartRate > 100): {
                alertCount += 1;
                alerts.heartRate = "Tachycardia";
                break;
            }
            default: {
                alerts.heartRate = null;
            }
        }

        // Respiratory rate
        switch (true) {
            case (respiratoryRate < 12): {
                alertCount += 1;
                alerts.respiratoryRate = "Bradypnea";
                break;
            }
            case (respiratoryRate > 20): {
                alertCount += 1;
                alerts.respiratoryRate = "Tachypnea";
                break;
            }
            default: {
                alerts.respiratoryRate = null;
            }
        }

        // Supplemented O2
        switch (true) {
            case (supplemented_O2 < 92): {
                alertCount += 1;
                alerts.supplemented_O2 = "Hypoxemia";
                break;
            }
            default: {
                alerts.supplemented_O2 = null;
            }
        }

        // O2 saturation
        switch (true) {
            case (O2saturation < 90): {
                alertCount += 1;
                alerts.O2saturation = "Hypoxemia";
                break;
            }
            default: {
                alerts.O2saturation = null;
            }
        }

        // Temperature
        switch (true) {
            case (temperature < 95): {
                alertCount += 1;
                alerts.temperature = "Hypothermia";
                break;
            }
            case (temperature > 100.4): {
                alertCount += 1;
                alerts.temperature = "Fever";
                break;
            }
            default: {
                alerts.temperature = null;
            }
        }

        // Systolic BP
        switch (true) {
            case (systolicBP < 90): {
                alertCount += 1;
                alerts.systolicBP = "Hypotension";
                break;
            }
            case (systolicBP > 120): {
                alertCount += 1;
                alerts.systolicBP = "Hypertension";
                break;
            }
            default: {
                alerts.systolicBP = null;
            }
        }

        // Diastolic BP
        switch (true) {
            case (diastolicBP < 60): {
                alertCount += 1;
                alerts.diastolicBP = "Hypotension";
                break;
            }
            case (diastolicBP > 80): {
                alertCount += 1;
                alerts.diastolicBP = "Hypertension";
                break;
            }
            default: {
                alerts.diastolicBP = null;
            }
        }

        alerts.alertCount = alertCount;

        // Find existing alert or create a new one
        const [alert, created] = await Alerts.findOrCreate({
            where: {
                PatientId: patientId
            },
            defaults: alerts
        });

        if (!created) {
            // Update the existing alert
            await Alerts.update(alerts, {
                where: {
                    PatientId: patientId
                }
            });
        }

        return {
            error: false,
            status: 200,
            payload: "Alerts Updated Successfully!"
        };

    } catch (error) {
        console.log("Error Creating Alerts Service: ", error);
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
                status: 404,
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
                status: 200,
                payload: vitalSignsList
            };
        }
        
    } catch (error) {
        throw error;
    }
}

async function getAlerts(patientId) {
    try {
        const patient = await Patients.findByPk(patientId);
        if(!patient){
            return {
                error : true,
                status: 404,
                payload: "Patient not Found."
            }
        }

        const alerts = await Alerts.findAll({
            where: {
                PatientId: patientId
            }
        })

        if(!alerts) {
            return {
                error: false,
                status: 200,
                alerts: "No alerts for this patient"
            }
        }

        return {
            error: false,
            status: 200,
            payload: alerts
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
    editVitalSigns,
    createAlerts,
    getAlerts
}