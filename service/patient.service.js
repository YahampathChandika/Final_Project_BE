const { Sequelize, where } = require("sequelize");
const db = require("../models");
const {
  Patients,
  Admissions,
  Beds,
  Notes,
  ReferenceNumbers,
  CriticalAlerts,
  BorderlineAlerts,
  Conditions,
} = require("../models");

//Register a patient.
async function registerPatient(patient) {
  try {
    const isBedAvailable = await Beds.findOne({
      where: {
        id: patient.bedId,
        available: true,
      },
    });
    if (isBedAvailable == null) {
      return {
        error: true,
        status: 503,
        payload: "Sorry the bed is not available at the moment.",
      };
    } else {
      const hospitalId = await ReferenceNumbers.findOne({
        where: {
          id: 1,
        },
      });

      const newPatient = await Patients.create(
        {
          hospitalId: hospitalId.value,
          firstName: patient.firstName,
          lastName: patient.lastName,
          gender: patient.gender,
          dateOfBirth: patient.dateOfBirth,
          contactNo: patient.contactNo,
          address: patient.address,
          nic: patient.nic,
          email: patient.email,
          bloodGroup: patient.bloodGroup,
          guardianName: patient.guardianName,
          guardianContactNo: patient.guardianContactNo,
          guardianAddress: patient.guardianAddress,
          status: patient.status,
          admissions: {
            diagnosis: patient.diagnosis,
            bedId: patient.bedId,
          },
        },
        {
          include: [
            {
              model: Admissions,
              as: "admissions",
            },
          ],
        }
      );

      await Beds.update({ available: false }, { where: { id: patient.bedId } });

      const newHospitalId = hospitalId.value + 1;
      await ReferenceNumbers.update(
        { value: newHospitalId },
        { where: { label: "hospitalId" } }
      );

      return {
        error: false,
        status: 200,
        payload: "Patient Successfully registered",
      };
    }
  } catch (error) {
    console.error("Error Creating Patient Service : ", error);
    throw error;
  }
}

//All patients list.
async function getAllPatients() {
  try {
    const listOfPatients = await Patients.findAll({
      include: [
        {
          model: Admissions,
          as: "admissions",
        },
      ],
    });

    if (!listOfPatients) {
      return {
        error: true,
        status: 404,
        payload: "No patient data found.",
      };
    }

    const allPatientsObj = listOfPatients.map((patient, index) => {
      const birthday = patient?.dateOfBirth?.toISOString().split("T")[0];
      const admittedDate = patient?.createdAt?.toISOString().split("T")[0];
      return {
        id: patient.id,
        hospitalId: patient.hospitalId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        gender: patient.gender,
        dateOfBirth: birthday,
        contactNo: patient.contactNo,
        address: patient.address,
        nic: patient.nic,
        email: patient.email,
        bloodGroup: patient.bloodGroup,
        guardianName: patient.guardianName,
        guardianContactNo: patient.guardianContactNo,
        guardianAddress: patient.guardianAddress,
        status: patient.status,
        createdAt: admittedDate,
        admissions: patient.admissions,
      };
    });
    return {
      error: false,
      status: 200,
      payload: allPatientsObj,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//Update patient details.
async function updatePatient(id, updatedData) {
  try {
    const patient = await Patients.findByPk(id);

    if (!patient) {
      return {
        error: true,
        status: 404,
        payload: "Patient not found.",
      };
    }
    await patient.update(updatedData);

    return {
      error: false,
      status: 200,
      payload: "Patient updated successfully. ",
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//Delete Patient
async function deletePatient(patientID) {
  try {
    const patient = await Patients.findByPk(patientID);

    if (!patient) {
      return {
        error: true,
        status: 404,
        payload: "Patient not Found.",
      };
    }

    if (patient.status == "Admitted") {
      return {
        error: true,
        status: 405,
        payload: "Cannot Delete Admitted Patients",
      };
    }
    await Patients.destroy({
      where: {
        id: patientID,
      },
    });

    return {
      error: false,
      status: 200,
      payload: "Patient Successfully Deleted.",
    };
  } catch (error) {
    throw error;
  }
}

//Get Patient by ID
async function getPatientById(id) {
  try {
    const patient = await Patients.findOne({
      where: {
        id: id,
      },
      include: [
        {
          model: Admissions,
          as: "admissions",
          attributes: ["diagnosis"],
        },
      ],
    });

    if (!patient) {
      return {
        error: true,
        status: 404,
        payload: "Patient not Found.",
      };
    }

    const birthday = patient?.dateOfBirth?.toISOString().split("T")[0];
    const admittedDate = patient?.createdAt?.toISOString().split("T")[0];

    const patientObj = {
      id: patient?.id || null,
      hospitalId: patient?.hospitalId || null,
      firstName: patient?.firstName || null,
      lastName: patient?.lastName,
      gender: patient?.gender,
      dateOfBirth: birthday || null,
      contactNo: patient.contactNo,
      address: patient.address,
      nic: patient.nic,
      email: patient.email,
      bloodGroup: patient.bloodGroup,
      guardianName: patient.guardianName,
      guardianContactNo: patient.guardianContactNo,
      guardianAddress: patient.guardianAddress,
      status: patient.status,
      createdAt: admittedDate,
      diagnosis: patient.admissions[patient.admissions.length - 1]?.diagnosis,
    };
    return {
      error: false,
      status: 200,
      payload: patientObj,
    };
  } catch (error) {
    throw error;
  }
}

//Get Admitted Patient List.
async function getAdmittedPatients() {
  try {
    const admittedPatientList = await Patients.findAll({
      where: {
        status: "Admitted",
      },
      include: [
        {
          model: db.Admissions,
          as: "admissions",
          attributes: ["diagnosis", "bedId"],
          where: {
            dischargedOn: null,
          },
        },
        {
          model: Conditions,
          as: "conditions",
        },
        {
          model: CriticalAlerts,
          as: "criticalAlerts",
        },
        {
          model: BorderlineAlerts,
          as: "borderlineAlerts",
        },
      ],
    });

    const admittedPatientsCount = admittedPatientList.length;
    var criticalPatientCount = 0;
    var unstablePatientCount = 0;

    const patientList = admittedPatientList.map((patient, index) => {
      const birthday = patient?.dateOfBirth?.toISOString()?.split("T")[0];
      const admittedDate = patient?.createdAt?.toISOString().split("T")[0];

      if (patient?.conditions[0]?.condition == "High Risk") {
        criticalPatientCount++;
      }
      if (patient?.conditions[0]?.condition == "Medium Risk") {
        unstablePatientCount++;
      }
      return {
        id: patient.id,
        hospitalId: patient.hospitalId,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dateOfBirth: birthday,
        gender: patient.gender,
        contactNo: patient.contactNo,
        address: patient.address,
        nic: patient.nic,
        email: patient.email,
        bloodGroup: patient.bloodGroup,
        guardianName: patient.guardianName,
        guardianContactNo: patient.guardianContactNo,
        guardianAddress: patient.guardianAddress,
        status: patient.status,
        bedNo:
          patient?.admissions[patient.admissions.length - 1]?.bedId || "N/A",
        createdAt: admittedDate,
        diagnosis: patient.admissions[patient.admissions.length - 1].diagnosis,
        alertCount:
          patient?.criticalAlerts[0]?.alertCount +
            patient?.borderlineAlerts[0]?.alertCount || "N/A",
        condition: patient?.conditions[0]?.condition || "N/A",
      };
    });

    var response = {
      totalPatients: admittedPatientsCount,
      stablePatients:
        admittedPatientsCount - criticalPatientCount - unstablePatientCount,
      criticalPatients: criticalPatientCount,
      unstablePatients: unstablePatientCount,
      patientsList: patientList,
    };
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//Admitted Patient Matrices.
async function getAdmittedPatientMatrices() {
  try {
    const admitted = await Patients.count({
      where: { status: "Admitted" },
    });

    const admittedPatientMatrices = {
      admitted: admitted,
    };

    return admittedPatientMatrices;
  } catch (error) {
    throw error;
  }
}

//Get All Patient Matrices.
async function getAllPatientMatrices() {
  try {
    const all = await Patients.count();
    const admitted = await Patients.count({
      where: { status: "Admitted" },
    });
    const discharged = await Patients.count({
      where: { status: "Discharged" },
    });

    const allPatientMatrices = {
      all: all,
      admitted: admitted,
      discharged: discharged,
    };

    return allPatientMatrices;
  } catch (error) {}
}

//Discharge Patient
async function dischargePatient(patientId) {
  try {
    const patient = await Patients.findOne({
      where: { id: patientId },
    });

    if (!patient) {
      return {
        error: true,
        payload: "Patient not Found.",
      };
    } else if (patient.status == "Discharged") {
      return {
        error: true,
        payload: "Patient is aready discharged",
      };
    } else {
      const patientObj = await Patients.findOne({
        where: {
          id: patientId,
        },
        include: {
          model: Admissions,
          as: "admissions",
          attributes: ["id", "bedId", "dischargedOn"],
          where: {
            dischargedOn: null,
          },
        },
      });
      console.log(patientObj);
      await patientObj.update({ status: "Discharged" });
      await Beds.update(
        { available: true },
        { where: { id: patientObj.admissions[0].bedId } }
      );
      await Admissions.update(
        { dischargedOn: Sequelize.literal("CURRENT_TIMESTAMP") },
        { where: { id: patientObj.admissions[0].id } }
      );

      await CriticalAlerts.destroy({
        where: {
          PatientId: patientId,
        },
      });

      await BorderlineAlerts.destroy({
        where: {
          PatientId: patientId,
        },
      });

      await Conditions.destroy({
        where: {
          PatientId: patientId,
        },
      });
      return {
        error: false,
        payload: "Patient Discharged Succesfully",
      };
    }
  } catch (error) {
    console.log("Error discharging patient service: ", error);
    throw error;
  }
}

//Re-Admit Patient
async function reAdmitPatient(patientId, admission) {
  try {
    console.log("test admission: ", admission);
    const patient = await Patients.findByPk(patientId);

    if (!patient) {
      return {
        error: true,
        status: 404,
        payload: "Patient not Found.",
      };
    } else if (patient.status == "Admitted") {
      return {
        error: true,
        status: 400,
        payload: "Patient is already admitted",
      };
    } else {
      await Admissions.create({
        PatientId: patientId,
        diagnosis: admission.diagnosis,
        bedId: admission.bedId,
      });

      await patient.update({ status: "Admitted" });
      await Beds.update(
        { available: false },
        { where: { id: admission.bedId } }
      );

      return {
        error: false,
        status: 200,
        payload: "Patient Admitted Succesfully",
      };
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//Add patient notes
async function addNotes(noteData) {
  try {
    const patient = await Patients.findByPk(noteData.patientId);

    if (!patient) {
      return {
        error: true,
        status: 404,
        payload: "Patient not found.",
      };
    }

    // Create the note using the provided name and note from the request
    const newNote = await Notes.create({
      name: noteData.name, // from the request
      note: noteData.note, // from the request
      PatientId: noteData.patientId, // associated patient ID
    });

    return {
      error: false,
      status: 200,
      payload: "Record Added!",
    };
  } catch (error) {
    console.error("Error Creating Patient Service : ", error);
    throw error;
  }
}

// Service to get patient notes
async function getNotes(patientId) {
    try {
      const patient = await Patients.findByPk(patientId, {
        include: [{ model: Notes, as: "notes" }],
      });
  
      // Check if patient exists
      if (!patient) {
        return {
          error: true,
          status: 404,
          payload: "Patient not found.",
        };
      }
  
      // Return the patient's notes
      return {
        error: false,
        status: 200,
        payload: patient.notes, // Return the notes associated with the patient
      };
    } catch (error) {
      console.error(error);
      return {
        error: true,
        status: 500,
        payload: "Error retrieving notes.",
      };
    }
  }
  

module.exports = {
  registerPatient,
  getAllPatients,
  updatePatient,
  deletePatient,
  getPatientById,
  getAdmittedPatients,
  getAdmittedPatientMatrices,
  getAllPatientMatrices,
  dischargePatient,
  reAdmitPatient,
  addNotes,
  getNotes,
};
