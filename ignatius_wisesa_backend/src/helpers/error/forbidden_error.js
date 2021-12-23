const { ERROR:httpError } = require('../http-status/status-code');

class ForbiddenError {
  constructor(param = 'forbidden', data) {
    this.message = param.message || param;
    this.data = data;
    this.code = httpError.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
