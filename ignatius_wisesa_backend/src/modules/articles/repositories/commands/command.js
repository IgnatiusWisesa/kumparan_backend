class Query {
  constructor(db) {
    this.db = db;
  }

  async insertArticle(document) {
    this.db.setCollection('articles');
    const recordset = await this.db.insertOne(document);
    return recordset;
  }

  async updateArticle(parameter, document){
    this.db.setCollection('articles');
    const updateData = {$set : document};
    const result = await this.db.upsertOne(parameter, updateData);
    return result;
  }
}

module.exports = Query;
