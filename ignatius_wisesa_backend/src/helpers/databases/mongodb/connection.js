const Mongo = require('mongodb').MongoClient;
const validate = require('validate.js');
const config = require('../../../global_config');
const logger = require('../../utils/logger');
const wrapper = require('../../utils/wrapper');

const connectionPool = [];

const connection = () => {
  const connectionState = {
    index: null,
    config: '',
    db: null
  };
  return connectionState;
};

// 3. create mongodb connection
const createConnection = async (mongodbURL) => {
  const options = {
    maxPoolSize: parseInt(config.get('/mongodb').maxPoolSize),
    keepAlive: JSON.parse(config.get('/mongodb').keepAlive),
    socketTimeoutMS: parseInt(config.get('/mongodb').socketTimeout),
    connectTimeoutMS: parseInt(config.get('/mongodb').connectionTimeout),
    useNewUrlParser: JSON.parse(config.get('/mongodb').newUrlParser),
    useUnifiedTopology: JSON.parse(config.get('/mongodb').unifiedTopology),
  };

  try {
    const connection = await Mongo.connect(mongodbURL, options);
    logger.log('mongodb-createConnection', 'success create mongodb connection', 'info');
    return wrapper.data(connection);
  } catch (error) {
    logger.error('mongodb-createConnection', error.message, 'error');
    return wrapper.error(error.message);
  }
};

// 1. create connection state and then push into connection pool
const addConnectionPool = () => {
  const connectionMongo = connection();
  connectionMongo.index = 0;
  connectionMongo.config = config.get('/mongodb').url;
  connectionPool.push(connectionMongo);
};

// 2. get connection state / mongodb config and then create connection
const createConnectionPool = async () => {
  connectionPool.map(async (currentConnection, index) => {
    const result = await createConnection(currentConnection.config);
    if (result.error) {
      connectionPool[index].db = currentConnection;
    } else {
      connectionPool[index].db = result.data;
    }
  });
};

const init = () => {
  addConnectionPool();
  createConnectionPool();
};

const ifExistConnection = async (config) => {
  let state = {};
  connectionPool.map((currentConnection) => {
    if (currentConnection.config === config) {
      state = currentConnection;
    }
    return state;
  });
  if (validate.isEmpty(state)) {
    return wrapper.error('connection not exist, connection must be created before');
  }
  return wrapper.data(state);
};

const isConnected = async (state) => {
  const connection = state.db;
  if (validate.isEmpty(connection)) {
    return wrapper.error('connection not found, connection must be created before');
  }
  return wrapper.data(state);
};

const getConnection = async (config) => {
  let connectionIndex;
  const checkConnection = async () => {
    const result = await ifExistConnection(config);
    if (result.error) {
      return result;
    }
    const connection = await isConnected(result.data);
    connectionIndex = result.data.index;
    return connection;
  };

  const result = await checkConnection();
  if (result.error) {
    const state = await createConnection(config);
    if (state.error) {
      return wrapper.data(connectionPool[connectionIndex]);
    }
    connectionPool[connectionIndex].db = state.data;
    return wrapper.data(connectionPool[connectionIndex]);
  }
  return result;
};


module.exports = {
  init,
  getConnection
};
