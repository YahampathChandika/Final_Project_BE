
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
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
     
      

    }); 
  return Users;
};