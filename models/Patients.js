const Admissions = require("./Admissions");

module.exports = (sequelize, DataTypes) => {
    const Patients = sequelize.define("Patients", {
      hospitalId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      contactNo: {
        type: DataTypes.STRING,
        allowNull: true,  
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bloodGroup: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      guardianName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      guardianContactNo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      guardianAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
     status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Admitted"
      }
    });

    return Patients;

  };