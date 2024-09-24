const { VitalSigns, Conditions } = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { mean, median, min, max, std, variance } = require("mathjs");

async function getEnhancedRiskPrediction(patientId) {
  try {
    // Define risk thresholds
    const riskThresholds = {
      sepsis: {
        heartRate: { min: 100 },
        respiratoryRate: { min: 20 },
        temperature: { min: 38 },
        systolicBP: { max: 90 },
      },
      cardiacArrest: {
        heartRate: { min: 140 },
        systolicBP: { max: 80 },
      },
      aki: {
        systolicBP: { min: 150 },
        diastolicBP: { min: 100 },
      },
      stroke: {
        systolicBP: { min: 180 },
        diastolicBP: { min: 110 },
      },
      pulmonaryEmbolism: {
        respiratoryRate: { min: 30 },
        oxygenSaturation: { max: 90 },
      },
      hypovolemicShock: {
        systolicBP: { max: 90 },
        diastolicBP: { max: 60 },
      },
      ards: {
        oxygenSaturation: { min: 88 },
      },
      diabeticEmergencies: {
        glucoseLevel: { min: 70, max: 200 },
      },
    };

    // Define time periods in hours
    const timePeriods = {
      short: 24,
      medium: 72,
      long: 168,
    };

    // Function to fetch vital signs for a given time period
    const fetchVitalSigns = async (timePeriod) => {
      const endTime = new Date();
      const startTime = new Date(
        endTime.getTime() - timePeriod * 60 * 60 * 1000
      );

      return await VitalSigns.findAll({
        where: {
          PatientId: patientId,
          createdAt: {
            [Op.between]: [startTime, endTime],
          },
        },
        order: [["createdAt", "ASC"]],
      });
    };

    // Fetch vital signs for each relevant time period
    const shortTermVitals = await fetchVitalSigns(timePeriods.short);
    const mediumTermVitals = await fetchVitalSigns(timePeriods.medium);
    const longTermVitals = await fetchVitalSigns(timePeriods.long);

    // Function to calculate summary statistics
    const calculateStats = (vitals, key) => {
      const values = vitals
        .map((v) => v[key])
        .filter((value) => value !== null && value !== undefined);
      if (values.length === 0) return null;
      return {
        mean: mean(values),
        median: median(values),
        min: min(values),
        max: max(values),
        std: std(values),
        var: variance(values),
      };
    };

    // Function to calculate weighted moving average
    const weightedMean = (data) => {
      const filteredData = data.filter(
        (value) => value !== null && value !== undefined
      );
      if (filteredData.length === 0) return null;
      const weights = filteredData.map((_, i) => i + 1);
      const sumOfWeights = weights.reduce((a, b) => a + b, 0);
      return (
        filteredData.reduce((sum, value, i) => sum + value * weights[i], 0) /
        sumOfWeights
      );
    };

    // Function to detect abnormal changes
    const detectAbnormalChange = (values, key, name) => {
      const filteredValues = values.filter(
        (value) => value !== null && value !== undefined
      );
      if (filteredValues.length === 0)
        return { name: name, increase: false, decrease: false, details: "" };
      const lastValue = filteredValues[filteredValues.length - 1];
      const meanValue = mean(filteredValues);
      const stdDev = std(filteredValues);
      const threshold = 1 * stdDev; // Define how many standard deviations to consider as abnormal

      let change = {
        name: name,
        increase: false,
        decrease: false,
        details: "",
      };

      if (lastValue > meanValue + threshold) {
        change.increase = true;
        change.details = (((lastValue - meanValue) / meanValue) * 100).toFixed(
          2
        );
      } else if (lastValue < meanValue - threshold) {
        change.decrease = true;
        change.details = (((meanValue - lastValue) / meanValue) * 100).toFixed(
          2
        );
      }

      return change;
    };

    // Initialize risk status and abnormal changes
    let riskStatus = {
      sepsis: { name: "Sepsis", risk: false, level: null },
      cardiacArrest: { name: "Cardiac Arrest", risk: false, level: null },
      aki: { name: "AKI", risk: false, level: null },
      stroke: { name: "Stroke", risk: false, level: null },
      pulmonaryEmbolism: {
        name: "Pulmonary Embolism",
        risk: false,
        level: null,
      },
      hypovolemicShock: { name: "Hypovolemic Shock", risk: false, level: null },
      ards: { name: "ARDS", risk: false, level: null },
      diabeticEmergencies: {
        name: "Diabetic Emergencies",
        risk: false,
        level: null,
      },
    };

    let abnormalChanges = {
      heartRate: {
        name: "Heart Rate",
        increase: false,
        decrease: false,
        details: "",
      },
      respiratoryRate: {
        name: "Respiratory Rate",
        increase: false,
        decrease: false,
        details: "",
      },
      temperature: {
        name: "Temperature",
        increase: false,
        decrease: false,
        details: "",
      },
      systolicBP: {
        name: "Systolic BP",
        increase: false,
        decrease: false,
        details: "",
      },
      diastolicBP: {
        name: "Diastolic BP",
        increase: false,
        decrease: false,
        details: "",
      },
      oxygenSaturation: {
        name: "Oxygen Saturation",
        increase: false,
        decrease: false,
        details: "",
      },
      glucoseLevel: {
        name: "Glucose Level",
        increase: false,
        decrease: false,
        details: "",
      },
    };

    // Helper function to evaluate risks
    const evaluateRisk = (vitals, timePeriod) => {
      const stats = {
        heartRate: calculateStats(vitals, "heartRate"),
        respiratoryRate: calculateStats(vitals, "respiratoryRate"),
        temperature: calculateStats(vitals, "temperature"),
        systolicBP: calculateStats(vitals, "systolicBP"),
        diastolicBP: calculateStats(vitals, "diastolicBP"),
        oxygenSaturation: calculateStats(vitals, "oxygenSaturation"),
        glucoseLevel: calculateStats(vitals, "glucoseLevel"),
      };

      const weightedStats = {
        heartRate: weightedMean(vitals.map((v) => v.heartRate)),
        respiratoryRate: weightedMean(vitals.map((v) => v.respiratoryRate)),
        temperature: weightedMean(vitals.map((v) => v.temperature)),
        systolicBP: weightedMean(vitals.map((v) => v.systolicBP)),
        diastolicBP: weightedMean(vitals.map((v) => v.diastolicBP)),
        oxygenSaturation: weightedMean(vitals.map((v) => v.oxygenSaturation)),
        glucoseLevel: weightedMean(vitals.map((v) => v.glucoseLevel)),
      };

      // Evaluate specific risks based on time period
      switch (timePeriod) {
        case "short":
          if (
            stats.heartRate &&
            stats.heartRate.max > riskThresholds.cardiacArrest.heartRate.min &&
            stats.systolicBP &&
            stats.systolicBP.min < riskThresholds.cardiacArrest.systolicBP.max
          ) {
            riskStatus.cardiacArrest.risk = true;
            riskStatus.cardiacArrest.level = "Critical";
          }

          if (
            stats.systolicBP &&
            stats.systolicBP.max > riskThresholds.stroke.systolicBP.min &&
            stats.diastolicBP &&
            stats.diastolicBP.max > riskThresholds.stroke.diastolicBP.min
          ) {
            riskStatus.stroke.risk = true;
            riskStatus.stroke.level = "Critical";
          }

          if (
            stats.respiratoryRate &&
            stats.respiratoryRate.max >
              riskThresholds.pulmonaryEmbolism.respiratoryRate.min &&
            stats.oxygenSaturation &&
            stats.oxygenSaturation.min <
              riskThresholds.pulmonaryEmbolism.oxygenSaturation.max
          ) {
            riskStatus.pulmonaryEmbolism.risk = true;
            riskStatus.pulmonaryEmbolism.level = "Critical";
          }
          break;

        case "medium":
          if (
            weightedStats.heartRate > riskThresholds.sepsis.heartRate.min &&
            weightedStats.respiratoryRate >
              riskThresholds.sepsis.respiratoryRate.min &&
            weightedStats.temperature > riskThresholds.sepsis.temperature.min &&
            weightedStats.systolicBP < riskThresholds.sepsis.systolicBP.max
          ) {
            riskStatus.sepsis.risk = true;
            riskStatus.sepsis.level = "Critical";
          }

          if (
            weightedStats.systolicBP <
              riskThresholds.hypovolemicShock.systolicBP.max &&
            weightedStats.diastolicBP <
              riskThresholds.hypovolemicShock.diastolicBP.max
          ) {
            riskStatus.hypovolemicShock.risk = true;
            riskStatus.hypovolemicShock.level = "Critical";
          }

          if (
            weightedStats.oxygenSaturation <
            riskThresholds.ards.oxygenSaturation.max
          ) {
            riskStatus.ards.risk = true;
            riskStatus.ards.level = "Critical";
          }
          break;

        case "long":
          if (
            stats.systolicBP &&
            stats.systolicBP.max > riskThresholds.aki.systolicBP.min &&
            stats.diastolicBP &&
            stats.diastolicBP.max > riskThresholds.aki.diastolicBP.min
          ) {
            riskStatus.aki.risk = true;
            riskStatus.aki.level = "Critical";
          }

          if (
            stats.glucoseLevel &&
            (stats.glucoseLevel.max >
              riskThresholds.diabeticEmergencies.glucoseLevel.max ||
              stats.glucoseLevel.min <
                riskThresholds.diabeticEmergencies.glucoseLevel.min)
          ) {
            riskStatus.diabeticEmergencies.risk = true;
            riskStatus.diabeticEmergencies.level = "Critical";
          }
          break;

        default:
          break;
      }

      // Detect abnormal changes for relevant vitals
      for (let key in stats) {
        if (stats[key]) {
          abnormalChanges[key] = detectAbnormalChange(
            vitals
              .map((v) => v[key])
              .filter((value) => value !== null && value !== undefined),
            key,
            abnormalChanges[key].name
          );
        }
      }
    };

    // Evaluate risks based on different time periods
    evaluateRisk(shortTermVitals, "short");
    evaluateRisk(mediumTermVitals, "medium");
    evaluateRisk(longTermVitals, "long");

    return {
      error: false,
      status: 200,
      payload: {
        riskStatus,
        abnormalChanges,
      },
    };
  } catch (error) {
    return {
      error: true,
      status: 500,
      payload: {
        message: "Error calculating risk prediction",
        details: error.message,
      },
    };
  }
}

module.exports = { getEnhancedRiskPrediction };
