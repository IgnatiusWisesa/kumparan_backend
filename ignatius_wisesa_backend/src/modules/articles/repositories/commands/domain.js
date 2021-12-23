const dateFormat = require('dateformat');
const validate = require('validate.js');
const Command = require('./command');
const Query = require('../queries/query');
const Model = require('./command_model');
const config = require('../../../../global_config');
const Mongo = require('../../../../helpers/databases/mongodb/db');
const wrapper = require('../../../../helpers/utils/wrapper');
const { InternalServerError, NotFoundError } = require('../../../../helpers/error');

const mongodb = new Mongo(config.get('/mongodb').url);
const command = new Command(mongodb);
const query = new Query(mongodb);

const insertArticle = async (data) => {
  let payload = { ...data };

  let article = Model.article();
  article.id = payload.id;
  article.author = payload.author;
  article.title = payload.title;
  article.body = payload.body;
  article.created = dateFormat(new Date(), 'isoDateTime');

  const insert = await command.insertArticle(article);
  if (insert.error) {
    return wrapper.error(new InternalServerError('failed insert article', {}));
  }

  return wrapper.data(article);
};

const updateArticle = async (id, data) => {
  let payload = { ...data };
  const articleId = parseInt(id);

  const article = await query.findOneArticle({ id: articleId });
  if (validate.isEmpty(article.data)) {
    return wrapper.error(new NotFoundError(`can not find article with id ${articleId}`, {}));
  }

  const update = await command.updateArticle({ id: articleId }, payload);
  if (update.error) {
    return wrapper.error(new InternalServerError(`failed update user with id ${articleId}`, {}));
  }

  return wrapper.data(update.data);
};

module.exports = {
  insertArticle,
  updateArticle
};
