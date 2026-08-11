export const checkBooleanFields = (fields) => {
  const invalidBooleanValues = Object.entries(fields)
    .filter(([, value]) => typeof value !== "boolean")
    .map(([key]) => key);

  return invalidBooleanValues;
};
