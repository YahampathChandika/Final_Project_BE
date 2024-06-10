const { where } = require("sequelize");
const { VitalSigns, Patients, CriticalAlerts, BorderlineAlerts, Conditions } = require("../models");
const { text } = require("express");

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
        let score = 0;
        let condition;
        let alerts = {
            critical: {
                heartRate: null,
                respiratoryRate: null,
                supplemented_O2: null,
                O2saturation: null,
                temperature: null,
                systolicBP: null,
                diastolicBP: null,
                alertCount: 0,
                PatientId: patientId
            },
            borderline: {
                heartRate: null,
                respiratoryRate: null,
                supplemented_O2: null,
                O2saturation: null,
                temperature: null,
                systolicBP: null,
                diastolicBP: null,
                alertCount: 0,
                PatientId: patientId
            }
        }

        const { heartRate, respiratoryRate, supplemented_O2, O2saturation, temperature, systolicBP, diastolicBP } = vitalSigns;

        // Heart Rate ----------------------->
        if (heartRate < 50 || heartRate > 110) {
            console.log("hehehe", heartRate)
            score += 3;
            alerts.critical.alertCount += 1;
            switch (true) {
                case (heartRate < 60): {
                    alerts.critical.heartRate = "Bradycardia";
                    break;
                }
                case (heartRate > 100): {
                    alerts.critical.heartRate = "Tachycardia";
                    break;
                }
                default: {
                    // alerts.heartRate = null;
                }
            }
        } else if ((heartRate >= 50 && heartRate <= 59) || (heartRate >= 101 && heartRate <= 110)) {
            console.log("huhuhu", heartRate)
            score += 1;
            alerts.borderline.alertCount += 1
            switch (true) {
                case (heartRate < 60): {
                    alerts.borderline.heartRate = "Bradycardia";
                    break;
                }
                case (heartRate > 100): {
                    alerts.borderline.heartRate = "Tachycardia";
                    break;
                }
                default: {
                    // alerts.heartRate = null;
                }
            }
        }

        // Respiratory Rate------------------------------>
        if (respiratoryRate < 10 || respiratoryRate > 24) {
            score += 3;
            alerts.critical.alertCount += 1;
            switch (true) {
                case (respiratoryRate < 12): {
                    alerts.critical.respiratoryRate = "Bradypnea";
                    break;
                }
                case (respiratoryRate > 20): {             
                    alerts.critical.respiratoryRate = "Tachypnea";
                    break;
                }
                default: {
                    // alerts.respiratoryRate = null;
                }
            }
        } else if ((respiratoryRate >= 10 && respiratoryRate <= 11) || (respiratoryRate >= 21 && respiratoryRate <= 24)) {
            score += 1;
            alerts.borderline.alertCount += 1
            switch (true) {
                case (respiratoryRate < 12): {
                    alerts.borderline.respiratoryRate = "Bradypnea";
                    break;
                }
                case (respiratoryRate > 20): {             
                    alerts.borderline.respiratoryRate = "Tachypnea";
                    break;
                }
                default: {
                    // alerts.respiratoryRate = null;
                }
            }
        }

        // Supplemental O2 -------------------------->
        if (supplemented_O2 > 8) {
            score += 3;
            alerts.critical.supplemented_O2 = "Hypoxemia";
            alerts.critical.alertCount += 1;
        }
        else if (supplemented_O2 >= 5 && supplemented_O2 <= 8) {
            score += 1;
            alerts.borderline.alertCount += 1;
            alerts.borderline.supplemented_O2 = "Hypoxemia";
        }

        // Saturation O2 ---------------------------->
        if (O2saturation < 90) {
            score += 3;
            alerts.critical.alertCount += 1;
            alerts.critical.O2saturation = "Hypoxemia";

        } else if (O2saturation >= 90 && O2saturation <= 94) {
            score += 1;
            alerts.borderline.alertCount += 1
            alerts.borderline.O2saturation = "Hypoxemia";
        }

        // Blood Pressure (Systolic) ---------------------------->
        if (systolicBP < 90 || systolicBP > 140) {
            score += 3;
            alerts.critical.alertCount += 1;
            switch (true) {
                case (systolicBP < 90): {
                    alerts.critical.systolicBP = "Hypotension";
                    break;
                }
                case (systolicBP > 120): {
                    alerts.critical.systolicBP = "Hypertension";
                    break;
                }
                default: {
                    // alerts.systolicBP = null;
                }
            }
        } else if (systolicBP >= 121 && systolicBP <= 140) {
            score += 1;
            alerts.borderline.alertCount += 1
            switch (true) {
                case (systolicBP < 90): {
                    alerts.borderline.systolicBP = "Hypotension";
                    break;
                }
                case (systolicBP > 120): {
                    alerts.borderline.systolicBP = "Hypertension";
                    break;
                }
                default: {
                    // alerts.systolicBP = null;
                }
            }
        }

        // Blood Pressure (Diastolic)
        if (diastolicBP < 60 || diastolicBP > 90) {
            score += 3;
            alerts.critical.alertCount += 1;
            switch (true) {
                case (diastolicBP < 60): {
                    alerts.critical.diastolicBP = "Hypotension";
                    break;
                }
                case (diastolicBP > 80): {
                    alerts.critical.diastolicBP = "Hypertension";
                    break;
                }
                default: {
                    // alerts.diastolicBP = null;
                }
            }

        } else if (diastolicBP >= 81 && diastolicBP <= 90) {
            score += 1;
            alerts.borderline.alertCount += 1
            alerts.borderline.diastolicBP = "Hypertension";
        }

        // Temperature (Fahrenheit)
        if (temperature < 95.0 || temperature > 100.4) {
            score += 3;
            alerts.critical.alertCount += 1;
            switch (true) {
                case (temperature < 95): {
                    alerts.critical.temperature = "Hypothermia";
                    break;
                }
                case (temperature > 100.4): {
                    alerts.critical.temperature = "Fever";
                    break;
                }
                default: {
                    // alerts.temperature = null;
                }
            }
        } else if ((temperature >= 95.0 && temperature <= 97.5) || (temperature >= 99.5 && temperature <= 100.4)) {
            score += 1;
            alerts.borderline.alertCount += 1
            switch (true) {
                case (temperature <= 97.5): {
                    alerts.borderline.temperature = "Hypothermia";
                    break;
                }
                case (temperature >= 99.5): {
                    alerts.borderline.temperature = "Fever";
                    break;
                }
                default: {
                    // alerts.temperature = null;
                }
            }
        }

        // Find existing critical alert or create a new one
        const [alertC, createdC] = await CriticalAlerts.findOrCreate({
            where: {
                PatientId: patientId
            },
            defaults: alerts.critical
        });

        if (!createdC) {
            // Update the existing critical alert
            await CriticalAlerts.update(alerts.critical, {
                where: {
                    PatientId: patientId
                }
            });
        }

        // Find existing borderline alert or create a new one
        const [alertB, createdB] = await BorderlineAlerts.findOrCreate({
            where: {
                PatientId: patientId
            },
            defaults: alerts.borderline
        });

        if (!createdB) {
            // Update the existing borderline alert
            await BorderlineAlerts.update(alerts.borderline, {
                where: {
                    PatientId: patientId
                }
            });
        }

        // console.log("critical - ",alerts.critical.alertCount)
        // console.log("bord - ",alerts.borderline.alertCount)

        // Determine category
        if (score === 0) {
            condition =  "Stable";
        } else if (score === 1 || score === 2) {
            condition =  "Unstable";
        } else {
            condition = "Critical";
        }

        console.log(condition, score)

        condition = {
            PatientId: patientId,
            condition: condition
        }

        // Find existing borderline alert or create a new one
        const [Condition, created] = await Conditions.findOrCreate({
            where: {
                PatientId: patientId
            },
            defaults: condition
        });

        if (!created) {
            // Update the existing borderline alert
            await Conditions.update(condition, {
                where: {
                    PatientId: patientId
                }
            });
        }

        return {
            error: false,
            status: 200,
            payload: "Alerts Updated Successfully!"
        }

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

        const criticalAlerts = await CriticalAlerts.findAll({
            where: {
                PatientId: patientId
            }
        })

        const borderlineAlerts = await BorderlineAlerts.findAll({
            where: {
                PatientId: patientId
            }
        })

        const vitalSigns = await VitalSigns.findOne({
            order: [['id', 'DESC']]
        })

        let ac = criticalAlerts[0]?.alertCount + borderlineAlerts[0]?.alertCount

        // Removing the vitals that do not have alerts from the alerts objects
        Object.keys(criticalAlerts[0]?.dataValues)?.forEach(e => {
            if(criticalAlerts[0]?.dataValues[e] == null ) {
                delete criticalAlerts[0]?.dataValues[e]
            } else {
                if(!["id", "alertCount", "createdAt", "updatedAt", "PatientId"].includes(e)) {
                    criticalAlerts[0].dataValues[e] = {
                        text: criticalAlerts[0]?.dataValues[e],
                        value: vitalSigns[e]
                    }
                } else {
                    delete criticalAlerts[0]?.dataValues[e]
                }  
            }
        })

        Object.keys(borderlineAlerts[0]?.dataValues)?.forEach(e => {
            if(borderlineAlerts[0]?.dataValues[e] == null) {
                delete borderlineAlerts[0]?.dataValues[e]
            } else {
                if(!["id", "alertCount", "createdAt", "updatedAt", "PatientId"].includes(e)) {
                    borderlineAlerts[0].dataValues[e] = {
                        text: borderlineAlerts[0].dataValues[e],
                        value: vitalSigns[e]
                    }
                } else {
                    delete borderlineAlerts[0]?.dataValues[e]
                }  
            }
        })

        // Formatting the critical alerts list and borderline alert lists  
        var criticalAlertsList = []
        var borderlineAlertsList = []

        Object.keys(criticalAlerts[0].dataValues)?.forEach((e) => {
            var x = {
                name: e,
                text: criticalAlerts[0][e].text,
                value: criticalAlerts[0][e].value
            }
            criticalAlertsList.push(x)
        })

        Object.keys(borderlineAlerts[0].dataValues)?.forEach((e) => {
            var x = {
                name: e,
                text: borderlineAlerts[0][e].text,
                value: borderlineAlerts[0][e].value
            }
            borderlineAlertsList.push(x)
        })

        let alerts = {
            criticalAlerts: criticalAlertsList || "N/A",
            borderlineAlerts: borderlineAlertsList || "N/A",
            totalAlertCount: ac || "N/A",
        }


        if(!alerts) {
            return {
                error: false,
                status: 200,
                payload: "No alerts for this patient"
            }
        }

        return {
            error: false,
            status: 200,
            payload: alerts
        }

    } catch (error) {
        console.log(error)
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

async function getCondition(patientId) {
    try {
        const condition = await Conditions.findOne({
            where: {
                PatientId: patientId
            }
        });


        if(!condition) {
            return {
                error: true,
                status: 404,
                payload: "N/A"
            }
        }
        
        return {
            error: false,
            status: 200,
            payload: condition.condition
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
    getAlerts,
    getCondition
}