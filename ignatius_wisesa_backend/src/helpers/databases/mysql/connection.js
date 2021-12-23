const mysql = require('mysql');

const connectionPool = [];

const createConnectionPool = async (config) => {
  const currConnection = connectionPool.findIndex(item => item.config.toString() === config.toString());
  let db;
  if(currConnection === -1){
    db = await mysql.createPool(config);
    connectionPool.push({
      config,
      connection: db
    });
  }
  return db;
};

const getConnection = async (config) => {
  const currentConnection = connectionPool.filter(item => item.config.toString() === config.toString());
  let conn;
  currentConnection.map((obj,i) => {
    if(i === 0){
      const { connection } = obj;
      conn = connection;
    }
  });
  return conn;
};

module.exports = {
  createConnectionPool,
  getConnection
};
