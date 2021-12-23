const express = require('express');
const articlesHandler = require('../modules/articles/handlers/api_handler');

const router = express.Router();

// module user
router.use('/article', articlesHandler);

module.exports = router;
