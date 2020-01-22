const Ajv = require('ajv');
const requireDirectory = require('require-directory');

const { flattenSchemaBranch, get, replaceVars } = require('./utils');
const ValidationError = require('./ValidationError');

module.exports = {

  createValidationMw(options) {
    return function (reqVarName, schemaName) {
      const ajv = new Ajv({
        schemas: Object.values(options.schema)
      });

      return (req, _, next) => {
        const reqSchemaName = replaceVars(schemaName, req);
        if (options.debug) {
          console.log(`validate req.${reqVarName} with ${reqSchemaName}`);
        }

        const schemaPath = `http://api.com${reqSchemaName}`;
        const validate = ajv.getSchema(schemaPath);
        const data = get(req, reqVarName);
        const valid = validate(data);

        if (!valid) {
          return next(new ValidationError(validate.errors, data, options.debug));
        } else {
          return next();
        }
      };
    };
  },

  createSchemaList(mod) {
    const schemaTree = requireDirectory(mod);
    const schemaList = (Object.entries(schemaTree).map(flattenSchemaBranch)).flat();

    return schemaList;
  }

};
