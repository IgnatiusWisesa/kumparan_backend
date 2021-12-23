const validate = require('validate.js');
const Query = require('./query');
const Model = require('./query_model');
const config = require('../../../../global_config');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { NotFoundError, BadRequestError } = require('../../../../helpers/error');

const mongodb = new Mongo(config.get('/mongodb').url);
const query = new Query(mongodb);

const getOneArticle = async (data) => {
  let articleId, result;

  articleId = parseInt(data);

  const article = await query.findOneArticle({ id: articleId });
  if (validate.isEmpty(user.data)) {
    return wrapper.error(new NotFoundError(`can not find user with id ${articleId}`, {}));
  }

  result = Model.article();
  result.id = article.data.id;
  result.author = article.data.author;
  result.title = article.data.title;
  result.body = article.data.body;
  result.created = article.data.created;

  return wrapper.data(result);
};

const getArticles = async (data, condition) => {
  let page, size, result = [], metadata;

  let insert_condition = {}
  if( condition.query ) insert_condition.body = { $regex: '.*' + `${condition.query}` + '.*' }
  if( condition.author ) insert_condition.author = condition.author

  if (data.page == 0) {
    return wrapper.error(new BadRequestError('page must start from 1', []));
  }

  page = parseInt(data.page) || 1;
  size = parseInt(data.size) || 10;

  const articles = await query.findArticles({}, size, page, insert_condition, { created : -1 });
  if (validate.isEmpty(articles.data)) {
    return wrapper.error(new NotFoundError('can not find article', []));
  }

  articles.data.map(data => {
    const article = Model.article();
    article.id = data.id;
    article.author = data.author;
    article.title = data.title;
    article.body = data.body;
    article.created = data.created;

    result.push(article);
  });

  const countArticles = await query.countArticles();

  metadata = {
    page,
    size: result.length,
    totalPage: Math.ceil(countArticles.data / size),
    totalData: countArticles.data
  };

  return wrapper.paginationData(result, metadata);
};

module.exports = {
  getOneArticle,
  getArticles
};
