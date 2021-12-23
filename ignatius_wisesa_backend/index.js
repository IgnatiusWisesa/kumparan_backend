const app = require('./src/app/server');
const config = require('./src/global_config');
const logger = require('./src/helpers/utils/logger');

const port = config.get('/port') || 8000;
app.listen(port, () => {
  const ctx = 'app-listen';
  logger.log(ctx, `${config.get('/name')}-server started, listening at ${config.get('/baseUrl')}:${port}`,
    'initiate application');
});