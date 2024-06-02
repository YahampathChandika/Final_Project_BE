module.exports = (sequelize, DataTypes) => {
    const ReferenceNumbers = sequelize.define("ReferenceNumbers", {
        label: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.BIGINT(20),
        }
    }, {
        timestamps: false
    }
    
    );

    return ReferenceNumbers
}