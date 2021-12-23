const { ERROR:httpError } = require('../http-status/status-code');

class Unauthorized {
  constructor(param = 'unauthorized', data) {
    this.message = param.message || param;
    this.data = data;
    this.code = httpError.UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
