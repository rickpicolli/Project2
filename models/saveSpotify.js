module.exports = function(sequelize, DataTypes) {
  var SaveSpotify = sequelize.define("saveSpotify", {
   
    albumCover:{
      type: DataTypes.STRING,
    },
    artistName:{
      type: DataTypes.STRING,
    },
    songName:{
      type: DataTypes.STRING,
    },
    songID:{
      type: DataTypes.STRING,
    },
    songUrl:{
      type: DataTypes.STRING,
    }

  });
  
  SaveSpotify.associate = function(models) {
    // We're saying that a Matches should belong to an User
    // A Match can't be created without an User due to the foreign key constraint
    SaveSpotify.belongsTo(models.user, {
      foreignKey: {
        allowNull: false
      }
    });

  };

  return SaveSpotify
}