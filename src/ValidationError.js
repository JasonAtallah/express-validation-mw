
module.exports = class ValidationError extends Error {
  constructor(errors, data, debug) {
    const error = errors[0];
    const message = `${error.dataPath.trim()} ${error.message}`;

    super(message);

    if (debug) {
      console.log(`validation error: ${message}`);
      console.log(data);
    }

    this.status = 400;
  }
};
