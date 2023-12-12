module.exports = (sequelize, DataTypes) => {
    const VitalSigns = sequelize.define("VitalSigns", {
      hospitalId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      heartRate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      respiratoryRate: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      supplemented_O2: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      O2saturation: {
        type: DataTypes.DOUBLE, 
        allowNull: true,  
      },
      temperature: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      systolicBP: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      diastolicBP: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      avpuScore: {
        type: DataTypes.STRING,
        allowNull: true, 
      }
    });
    return VitalSigns;

  };