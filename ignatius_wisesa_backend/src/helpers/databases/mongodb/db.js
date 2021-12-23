const validate = require('validate.js');
const mongoPool = require('./connection');
const logger = require('../../utils/logger');
const wrapper = require('../../utils/wrapper');

class DB {
  constructor(mongodbURL) {
    this.mongodbURL = mongodbURL;
  }

  setCollection(collectionName) {
    this.collectionName = collectionName;
  }

  async getDatabase() {
    const mongodbURL = this.mongodbURL.replace('//', '');
    const pattern = new RegExp('/([a-zA-Z0-9-_]+)?');
    const dbName = pattern.exec(mongodbURL);
    return dbName[1];
  }

  async findOne(parameter) {
    const ctx = 'mongodb-findOne';
    const dbName = await this.getDatabase();
    const result = await mongoPool.getConnection(this.mongodbURL);
    if (result.error) {
      logger.error(ctx, 'error mongodb connection', 'error');
      return result;
    }

    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.findOne(parameter);
      if (validate.isEmpty(recordset)) {
        return wrapper.error('data not found please try another input');
      }
      return wrapper.data(recordset);

    } catch (error) {
      logger.error(ctx, error.message, 'error');
      return wrapper.error(`error find one mongodb ${error.message}`);
    }
  }

  // find all data with option exact parameter
  async findAll(parameter) {
    const ctx = 'mongodb-findMany';
    const dbName = await this.getDatabase();
    const result = await mongoPool.getConnection(this.mongodbURL);
    if (result.error) {
      logger.error(ctx, 'error mongodb connection', 'error');
      return result;
    }

    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.find(parameter).toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('data not found please try another input');
      }
      return wrapper.data(recordset);

    } catch (error) {
      logger.error(ctx, error.message, 'error');
      return wrapper.error(`error find many mongodb ${error.message}`);
    }

  }

  // find data with pagination with option sort and parameter
  async findMany(fieldName, row, page, parameter, parameterSort) {
    const ctx = 'mongodb-findAll';
    const dbName = await this.getDatabase();
    const result = await mongoPool.getConnection(this.mongodbURL);
    if (result.error) {
      logger.error(ctx, 'error mongodb connection', 'error');
      return result;
    }

    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      // const parameterSort = {};
      // parameterSort[fieldName] = -1;
      const parameterPage = row * (page - 1);
      const recordset = await db.find(parameter).sort(parameterSort).limit(row).skip(parameterPage)
        .toArray();
      if (validate.isEmpty(recordset)) {
        return wrapper.error('data not found please try another input');
      }
      return wrapper.data(recordset);

    } catch (error) {
      logger.error(ctx, error.message, 'error');
      return wrapper.error(`error find many mongodb ${error.message}`);
    }
  }

  async countData(parameter) {
    const ctx = 'mongodb-countData';
    const dbName = await this.getDatabase();
    const result = await mongoPool.getConnection(this.mongodbURL);
    if (result.error) {
      logger.error(ctx, 'error mongodb connection', 'error');
      return result;
    }

    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.count(parameter);
      if (validate.isEmpty(recordset)) {
        return wrapper.error('data not found please try another input');
      }
      return wrapper.data(recordset);

    } catch (error) {
      logger.error(ctx, error.message, 'error');
      return wrapper.error(`error count data mongodb ${error.message}`);
    }
  }

  async insertOne(document) {
    const ctx = 'mongodb-insertOne';
    const dbName = await this.getDatabase();
    const result = await mongoPool.getConnection(this.mongodbURL);
    if (result.error) {
      logger.error(ctx, 'error mongodb connection', 'error');
      return result;
    }

    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const recordset = await db.insertOne(document);
      // need to be fix later
      // if (recordset.insertedCount == 1) {
      //   return wrapper.error('failed inserting data to database');
      // }
      return wrapper.data(document);

    } catch (error) {
      logger.error(ctx, error.message, 'error');
      return wrapper.error(`error insert one data mongodb ${error.message}`);
    }
  }

  // modifiedCount : 0 => data created
  // modifiedCount : 1 => data updated
  async upsertOne(parameter, updateQuery) {
    const ctx = 'mongodb-upsertOne';
    const dbName = await this.getDatabase();
    const result = await mongoPool.getConnection(this.mongodbURL);
    if (result.err) {
      logger.error(ctx, 'error mongodb connection', 'error');
      return result;
    }

    try {
      const cacheConnection = result.data.db;
      const connection = cacheConnection.db(dbName);
      const db = connection.collection(this.collectionName);
      const data = await db.updateOne(parameter, updateQuery, { upsert: true });
      if (data.modifiedCount >= 0) {
        const { modifiedCount } = data;
        const recordset = await this.findOne(parameter);
        if (modifiedCount === 0) {
          return wrapper.data(recordset.data);
        }
        return wrapper.data(recordset.data);
      }
      return wrapper.error('failed upsert data');

    } catch (error) {
      logger.error(ctx, error.message, 'error');
      return wrapper.error(`error upsert one data mongodb ${error.message}`);
    }
  }
}

module.exports = DB;
