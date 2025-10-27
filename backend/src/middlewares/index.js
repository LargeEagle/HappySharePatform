const { authenticate, optionalAuthenticate, generateToken } = require('./auth');
const { errorHandler, notFound } = require('./errorHandler');

module.exports = {
  authenticate,
  optionalAuthenticate,
  generateToken,
  errorHandler,
  notFound
};
