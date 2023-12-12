module.exports = (sequelize, DataTypes) => {
    const Beds = sequelize.define("Beds", {
        bedNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        available: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
      
    }, {
        timestamps: false
    }
    );

    return Beds;
}