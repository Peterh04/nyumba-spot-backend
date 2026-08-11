export const checkRequiredFields = (fields) => {
  const missingRequiredValues = Object.entries(fields)
    .filter(([, value]) => value === undefined || value === null)
    .map(([key]) => key);

  return missingRequiredValues;
};
