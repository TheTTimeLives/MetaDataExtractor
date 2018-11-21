module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define("Book", {
    bookId: {
      type: DataTypes.INTEGER,
      // validate: {
      //   len: [0,5]
      // }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1]
      // }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1]
      // }
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1]
      // }
    },
    publicationDate: {
      type: DataTypes.DATE,
      allowNull: true,
      // validate: {
      //   len: [1]
      // }
    },
    licenseRights: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1]
      // }
    },
  });


  Book.associate = function (models) {
    Book.hasMany(models.Subject, {as: 'Subjects'})
  }

  return Book;
};
