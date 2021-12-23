const { ERROR:httpError } = require('../http-status/status-code');

class BadRequestError {
  constructor(param = 'bad request', data) {
    this.message = param.message || param;
    this.data = data;
    this.code = httpError.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
