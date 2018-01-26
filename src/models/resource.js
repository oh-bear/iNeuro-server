module.exports = (sequelize, DataTypes) => {
  const { STRING, INTEGER, TEXT } = DataTypes

  return sequelize.define('resource', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    system_name: STRING(125),
    system_cname: STRING(45),
    system_detail: TEXT,
    structure_name: STRING(125),
    structure_cname: STRING(45),
    structure_detail: TEXT,
    name: STRING(255),
    url: STRING(255),
    total_time: INTEGER,
    wrong_time: INTEGER,
    cname: STRING(45),
    detail: TEXT,
  })
}
