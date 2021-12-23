const validate = require('validate.js');
const mysqlPool = require('./connection');
const wrapper = require('../../utils/wrapper');

class DB {
  constructor(config) {
    this.config = config;
  }

  async query(statement,  escape = null) {
    let db = await mysqlPool.getConnection(this.config);
    if(validate.isEmpty(db)){
      db = await mysqlPool.createConnectionPool(this.config);
    }
    const recordset = () => {
      return new Promise((resolve, reject) => {
        db.getConnection((error, connection) => {
          if (error) {
            let errorMessage;
            if (error.code === 'PROTOCOL_CONNECTION_LOST') {
              errorMessage = 'DB connection was closed.';
            }
            if (error.code === 'ER_CON_COUNT_ERROR') {
              errorMessage = 'DB has too many connections.';
            }
            if (error.code === 'ECONNREFUSED') {
              errorMessage = 'DB connection was refused.';
            }
            if (connection) {
              connection.release();
            }
            return reject(wrapper.error(errorMessage));
          }

          connection.query(statement, escape, (error, result) => {
            if (error) {
              connection.release();
              return reject(wrapper.error(error.message));
            }

            connection.release();
            return resolve(wrapper.data(result));
          });
        });
      });
    };
    const result = await recordset().then(result => {
      return result;
    }).catch(err => {
      return err;
    });
    return result;
  }
}

module.exports = DB;
