const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || "development";
const {
  dialect,
  host,
  port,
  name,
  user,
  pass
} = require('./config.js')[env]['db'];

module.exports = new Sequelize(name, user, pass, {
  dialect,
  host,
  port,
  logging: console.log,
  define: {
    timestamps: true
  }
});