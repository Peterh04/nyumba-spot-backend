export const checkPositiveNumberFields = (fields) => {
  const invalidPositiveFields = Object.entries(fields)
    .filter(([, value]) => typeof value !== "number" || value <= 0)
    .map(([key]) => key);

  return invalidPositiveFields;
};
