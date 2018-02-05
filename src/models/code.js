module.exports = (sequelize, DataTypes) => {
  const { BOOLEAN, DOUBLE, STRING, INTEGER } = DataTypes

  return sequelize.define('code', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account: STRING(20),
    time: DOUBLE,
    used: BOOLEAN,
    code: STRING(10),
  })
}

