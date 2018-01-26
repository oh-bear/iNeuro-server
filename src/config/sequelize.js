/**
 * Created by airing on 2017/4/10.
 */
import {SQL_ACCOUNT, SQL_PASSWORD} from './index'

import Sequelize from 'sequelize'

exports.sequelize = function () {
  return new Sequelize(
    'iNeuro',
    SQL_ACCOUNT,
    SQL_PASSWORD,
    {
      'dialect': 'mysql',
      host: 'localhost',
      port: 3306
    }
  )
}
