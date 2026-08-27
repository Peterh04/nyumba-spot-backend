const checkIntegerFields = (fields) => {
  const invalidIntegerFields = Object.entries(fields)
    .filter(([, value]) => Number.isInteger(value) === false)
    .map(([key]) => key);

  return invalidIntegerFields;
};

export default checkIntegerFields;
