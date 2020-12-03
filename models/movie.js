'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.movie.belongsToMany(models.user, {through: 'review'})
      // define association here
    }
  };
  movie.init({
    title: DataTypes.STRING,
    poster: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'movie',
  });
  return movie;
};