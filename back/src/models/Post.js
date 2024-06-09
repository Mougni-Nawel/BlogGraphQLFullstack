module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true
        }
      }, {});


    return Post;
};