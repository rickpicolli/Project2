var bcrypt   = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
  	name: {
      type: DataTypes.STRING,
      required: true
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      validate: {
        isEmail: true
      }
    },
    localPassword: {
      type: DataTypes.STRING,
      required: true
    }
  });
    // methods ======================
  // generating a hash
  User.generateHash = function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  // checking if password is valid
  User.prototype.validPassword = function(password) {
      return bcrypt.compareSync(password, this.localPassword);
  };

  // User.associate = function(models) {
  //     // Associating User with Saves
  //     // When an User is deleted, also delete any associated Saves
  //     User.hasMany(models.Save, {
  //       onDelete: "cascade"
  //     }); 

  // };
  return User
}