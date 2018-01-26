module.exports = (sequelize, DataTypes) => {
  const { STRING, INTEGER } = DataTypes
  
  return sequelize.define('user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account: STRING(45),
    password: STRING(45),
    name: STRING(30),
  })
}
