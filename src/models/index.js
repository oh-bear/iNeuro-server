const sequelize = require('../config/sequelize').sequelize()
const User = sequelize.import('./user')
const Resource = sequelize.import('./resource')
const Record = sequelize.import('./record')

User.hasMany(Record, { as: 'record', foreignKey: 'user_id' })

Resource.hasMany(Record, { as: 'record', foreignKey: 'resource_id' })

Record.belongsTo(User, { as: 'user', foreignKey: 'user_id' })
Record.belongsTo(Resource, { as: 'resource', foreignKey: 'resource_id' })

sequelize.sync()

module.exports = {
  User,
  Resource,
  Record,
}
