module.exports = (sequelize, DataTypes) => {
    const Conditions = sequelize.define("Conditions", {
      condition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
    return Conditions;

  };