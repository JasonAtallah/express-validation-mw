const Ajv = require('ajv');

function get(obj, path, defaultValue) {
  const travel = regexp =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}

function replaceVars(str, values) {
  return str.replace(
    // eslint-disable-next-line no-useless-escape
    /\{\{([\w\_\.]+)\}\}/g,
    group1 => get(values, group1)
  );
}

class ValidationError extends Error {
  constructor(errors, data, debug) {
    const error = errors[0];
    const message = `${error.dataPath.replace('.', ' ').trim()} ${error.message}`;

    super(message);

    if (debug) {
      console.log(`validation error: ${message}`);
      console.log(data);
    }

    this.status = 400;
  }
}

module.exports = {
  createValidationMw(options) {
    
    function validateReqVar(reqVarName, schemaName) {
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
    }

    return validateReqVar;
  },

  createSchemaList(mod) {
    const requireDirectory = require('require-directory');

    const flattenSchemaBranch = ([branchName, schemaDefs]) => {
      const schemas = Object.entries(schemaDefs);
      return schemas.map(([fileName, def]) => {
        return Object.assign(def, {
          $id: `http://api.com/${branchName}/${fileName}`
        });
      });
    };

    const schemaTree = requireDirectory(mod);
    const schemaList = (Object.entries(schemaTree).map(flattenSchemaBranch)).flat();

    return schemaList;
  }
};
