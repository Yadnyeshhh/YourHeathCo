const AppError = require('../utils/appError');

const validate = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      next();
    } catch (error) {
      const issues = error.errors || error.issues;
      if (Array.isArray(issues)) {
        const message = issues.map(err => `${err.path ? err.path.join('.') : 'field'}: ${err.message}`).join(', ');
        return next(new AppError(`Validation failed: ${message}`, 400));
      }
      next(error);
    }
  };
};

module.exports = validate;
