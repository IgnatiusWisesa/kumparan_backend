const { ERROR:httpError } = require('../http-status/status-code');

class ConflictError {
  constructor(param = 'conflict', data) {
    this.message = param.message || param;
    this.data = data;
    this.code = httpError.CONFLICT;
  }
}

module.exports = ConflictError;
