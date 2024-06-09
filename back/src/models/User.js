module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
    }, {
        timestamps: false
    });


    User.associate = (models) => {
        User.hasMany(models.Comment, {
          foreignKey: 'userId',
          as: 'comments'
        });
    };

    return User;
};