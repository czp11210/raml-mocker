const Ajv = require('ajv');
const { jsonPath } = require('./util');

const processMessage = (valid, error, data) => {
  const validInfo = '';
  let msg = '';
  if (!valid) {
    let result = data;
    const { message, dataPath } = error;
    msg = message;
    if (dataPath) {
      result = jsonPath(data, dataPath);
    }
    msg += `\ninfo:${dataPath}\n${JSON.stringify(result, null, '\t')}\n`;
  }
  return {
    valid,
    message: msg,
    validInfo
  };
};

export const validateSchema = (definitionSchema, schema, data) => {
  const ajv = new Ajv();
  let validate;
  try {
    validate = ajv.addSchema(definitionSchema).compile(schema);
  } catch (error) {
    if (error.missingRef) {
      throw Error(`Missing custom type "${error.missingRef.split('/').pop()}"`);
    }
    throw error;
  }
  const valid = validate(data);
  const error = !valid && validate.errors.pop();

  return processMessage(valid, error, data);
};