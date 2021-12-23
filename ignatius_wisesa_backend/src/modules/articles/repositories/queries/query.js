class Query {
  constructor(db) {
    this.db = db;
  }

  async findOneArticle(parameter) {
    this.db.setCollection('articles');
    const recordset = await this.db.findOne(parameter);
    return recordset;
  }

  async findArticles(fieldName, row, page, parameter, sortParameter) {
    this.db.setCollection('articles');
    let recordset = await this.db.findMany(fieldName, row, page, parameter, sortParameter);
    return recordset;
  }

  async countArticles() {
    this.db.setCollection('articles');
    const recordset = await this.db.countData();
    return recordset;
  }
}

module.exports = Query;
