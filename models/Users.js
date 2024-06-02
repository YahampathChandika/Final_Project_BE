
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
      image: {
        type: DataTypes.STRING,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactNo: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      speciality: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }); 
  return Users;
};