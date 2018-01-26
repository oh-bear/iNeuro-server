module.exports = (sequelize, DataTypes) => {
  const { INTEGER } = DataTypes

  return sequelize.define('record', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: INTEGER,
    resource_id: INTEGER,
    result: INTEGER,
  })
}
