module.exports = function(sequelize, DataTypes) {
  var Save = sequelize.define("save", {
    category:{
      type: DataTypes.STRING,
    },
    userInput:{
      type: DataTypes.TEXT,
    }
  });
  
  // Save.associate = function(models) {
  //   // We're saying that a Matches should belong to an User
  //   // A Match can't be created without an User due to the foreign key constraint
  //   Save.belongsTo(models.User, {
  //     foreignKey: {
  //       allowNull: false
  //     }
  //   });

  // };

  return Save
}