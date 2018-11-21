module.exports = function(sequelize, DataTypes) {
  let Subject = sequelize.define("Subject", {
    title: {
      type: DataTypes.STRING,
      // validate: {
      //   len: [0,5]
      // }
    },
    name: {
      type: DataTypes.STRING,
      // validate: {
      //   len: [0,5]
      // }
    },
  });

  Subject.associate = function (models) {
    Subject.belongsTo(models.Book)
  }

  return Subject;
};
