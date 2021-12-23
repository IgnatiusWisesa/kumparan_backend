const { ERROR:httpError } = require('../http-status/status-code');

class InternalServerError {
  constructor(param = 'internal server error', data) {
    this.message = param.message || param;
    this.data = data;
    this.code = httpError.INTERNAL_ERROR;
  }
}

module.exports = InternalServerError;
