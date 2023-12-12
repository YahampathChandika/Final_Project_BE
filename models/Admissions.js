
module.exports = (sequelize, DataTypes) => {
    const Admissions = sequelize.define("Admissions", {
        diagnosis: {
            type: DataTypes.STRING,
            allowNull: false
        },
        bedId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dischargedOn: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });

    return Admissions;
}