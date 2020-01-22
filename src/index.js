const requireDirectory = require('require-directory');

const { createAjvObject, flattenSchemaBranch, get, replaceVars } = require('./utils');
const ValidationError = require('./ValidationError');

module.exports = {
  createValidationMw(options) {
    return (reqVarName, schemaName) => (req, _, next) => {
      const reqSchemaName = replaceVars(schemaName, req);

      if (options.debug) {
        console.log(`validate req.${reqVarName} with ${reqSchemaName}`);
      }

      const ajv = createAjvObject(options.schema);
      const validate = ajv.getSchema(`http://api.com${reqSchemaName}`);
      const data = get(req, reqVarName);

      const error = !validate(data)
        && new ValidationError(validate.errors, data, options.debug);

      return next(error && error);
    };
  },

  createSchemaList(modelsModule) {
    const schemaTree = requireDirectory(modelsModule);
    const schemaList = Object.entries(schemaTree)
      .map(flattenSchemaBranch)
      .flat();

    return schemaList;
  }

};
