const sequelize = require('../config/sequelize').sequelize()
const User = sequelize.import('./user')
const Resource = sequelize.import('./resource')
const Record = sequelize.import('./record')

User.hasMany(Record, { as: 'record', foreignKey: 'user_id' })

Resource.hasMany(Record, { as: 'record', foreignKey: 'resource_id' })

Record.belongsTo(User)
Record.belongsTo(Resource)

sequelize.sync()

module.exports = {
  User,
  Resource,
  Record
}
