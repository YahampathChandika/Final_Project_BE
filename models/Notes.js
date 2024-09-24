module.exports = (sequelize, DataTypes) => {
  const Notes = sequelize.define("Notes", {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Notes;
};
