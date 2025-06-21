// backend/models/Training.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Training = sequelize.define('Training', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  intensity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  trainingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
});

// Связь с пользователем
Training.belongsTo(User, { onDelete: 'CASCADE' });
User.hasMany(Training, { onDelete: 'CASCADE' });

module.exports = Training;
