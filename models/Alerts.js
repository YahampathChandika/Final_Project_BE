module.exports = (sequelize, DataTypes) => {
    const Alerts = sequelize.define("Alerts", {
      heartRate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      respiratoryRate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      supplemented_O2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      O2saturation: {
        type: DataTypes.STRING, 
        allowNull: true,  
      },
      temperature: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      systolicBP: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      diastolicBP: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      alertCount: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    });
    return Alerts;

  };