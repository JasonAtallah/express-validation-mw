/**
 * This module holds helper functions needed by the packages API functions.
 */
const Ajv = require('ajv');

const utils = module.exports = {

  /**
   * TODO: document
   * @param {*} schema 
   */
  createAjvObject(schema) {
    return new Ajv({
      schemas: Object.values(schema)
    });
  },

  /**
   * TODO: document
   * @param {*} param0 
   */
  flattenSchemaBranch([branchName, schemaDefs]) {
    const schemas = Object.entries(schemaDefs);
    return schemas.map(([fileName, def]) => {
      return Object.assign(def, {
        $id: `http://api.com/${branchName}/${fileName}`
      });
    });
  },

  /**
   * TODO: document
   * @param {*} obj 
   * @param {*} path 
   * @param {*} defaultValue 
   */
  get(obj, path, defaultValue) {
    const travel = regexp =>
      String.prototype.split
        .call(path, regexp)
        .filter(Boolean)
        .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
    const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
    return result === undefined || result === obj ? defaultValue : result;
  },

  /**
   * TODO: document
   * @param {*} str 
   * @param {*} values 
   */
  replaceVars(str, values) {
    // eslint-disable-next-line no-useless-escape
    const searchRegex = /\{\{([\w\_\.]+)\}\}/g;
    const newValue = group => utils.get(values, group);

    return str.replace(searchRegex, newValue);
  }

};
