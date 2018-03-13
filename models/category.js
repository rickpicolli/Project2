module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("category", {
  	category: {
          type: DataTypes.TEXT
        },
        name: {
          type: DataTypes.TEXT
        }
  },
  {
  	timestamps: false
  });
  return Category
}