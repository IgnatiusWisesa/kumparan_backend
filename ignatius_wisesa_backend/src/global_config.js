require('dotenv').config();
const confidence = require('confidence');

const config = {
  port: process.env.PORT,
  name: process.env.NAME,
  baseUrl: process.env.BASEURL,
  mode: process.env.MODE,
  mongodb: {
    url: process.env.MONGO_DATABASE_URL,
    maxPoolSize: process.env.MONGO_MAX_POOL_SIZE,
    keepAlive: process.env.MONGO_KEEP_ALIVE,
    socketTimeout: process.env.MONGO_SOCKET_TIMEOUT,
    connectionTimeout: process.env.MONGO_CONNECTION_TIMEOUT,
    newUrlParser: process.env.MONGO_NEW_URL_PARSER,
    unifiedTopology: process.env.MONGO_UNIFIED_TOPOLOGY
  },
  mysql: {
    connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
    timezone: process.env.MYSQL_TIMEZONE
  }
};

const store = new confidence.Store(config);

exports.get = key => store.get(key);
