const { ERROR:httpError } = require('../http-status/status-code');

class NotFoundError {
  constructor(param = 'not found', data) {
    this.message = param.message || param;
    this.data = data;
    this.code = httpError.NOT_FOUND;
  }
}

module.exports = NotFoundError;
