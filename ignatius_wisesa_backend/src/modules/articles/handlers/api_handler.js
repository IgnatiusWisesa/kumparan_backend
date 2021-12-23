const express = require('express');
const commandsDomain = require('../repositories/commands/domain');
const queriesDomain = require('../repositories/queries/domain');
const validator = require('../utils/validator');
const wrapper = require('../../../helpers/utils/wrapper');
const { SUCCESS:http } = require('../../../helpers/http-status/status-code');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const router = express.Router();

// QUERIES

// handler get list of articles
router.get('/', async (req, res) => {
  const payload = { ...req.query };

  let condition = {
    query: '',
    author: ''
  }

  if( payload.query ) condition.query = payload.query
  if( payload.author ) condition.author = payload.author

  let getArticles = async () => queriesDomain.getArticles(payload, condition);
  const sendResponse = async (result) => {

    if( result.error ) wrapper.response(res, 'fail', result, result.error.message, result.error.code)

    try {
      let value = await myCache.get('articles_cache');

      if ( value != undefined ) {
        filtered_value = value.data

        if(condition.author) {
          filtered_value = value.data.filter((el) => {
            return el.author == condition.author
          })
        }

        if(condition.query) {
          filtered_value = value.data.filter((el) => {
            if( el.body.toLowerCase().indexOf(condition['query']) >= 0 ) return (el)     
          })
        }

        wrapper.paginationResponse(res, 'success', {...value, data: filtered_value}, 'success get list of articles (from cache)', http.OK)
      }
      wrapper.paginationResponse(res, 'success', result, 'success get list of articles', http.OK);
    } catch (error) {
      if( result.error ) wrapper.response(res, 'fail', result, result.error.message, result.error.code)
    }
  };
  sendResponse(await getArticles());
});

// COMMANDS

// hander insert article
router.post('/', async (req, res) => {
  const payload = { ...req.body };

  const validatePayload = await validator.validateInsertArticle(payload);
  const postArticle = async (result) => {
    if (result.error) {
      return result;
    }
    return await commandsDomain.insertArticle(payload);
  };

  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : 
      articles_to_cache = await queriesDomain.getArticles({page: 1, size: 10}, '')
      await myCache.set( 'articles_cache', articles_to_cache, 10000 )
      wrapper.paginationResponse(res, 'success', result, 'success insert an anrticle', http.CREATED);
  };
  sendResponse(await postArticle(validatePayload));
});

// hander update article
router.put('/:id', async (req, res) => {
  const articleId = req.params.id;
  const payload = { ...req.body };
  const schema = {
    ...req.params,
    ...req.body
  };

  const validatePayload = await validator.validateUpdateArticle(schema);
  const putArticle = async (result) => {
    if (result.error) {
      return result;
    }
    return await commandsDomain.updateUser(articleId, payload);
  };

  const sendResponse = async (result) => {
    (result.error) ? wrapper.response(res, 'fail', result, result.error.message, result.error.code)
      : wrapper.paginationResponse(res, 'success', result, `success update article with id ${articleId}`, http.OK);
  };
  sendResponse(await putArticle(validatePayload));
});

module.exports = router;
