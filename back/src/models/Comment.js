module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
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
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'Posts',
            key: 'id'
          }
        }
      }, {});


    Comment.associate = (models) => {
      Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    };
    
    return Comment;
};