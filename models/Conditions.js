module.exports = (sequelize, DataTypes) => {
  const Conditions = sequelize.define("Conditions", {
    score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    response: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return Conditions;
};
