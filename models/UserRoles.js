
module.exports = (sequelize, DataTypes) => {
    const UserRoles = sequelize.define("UserRoles", {
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    }
    
    );

    return UserRoles
}