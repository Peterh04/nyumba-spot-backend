export const checkStringFields = (fields) => {
  const invalidStringFields = Object.entries(fields)
    .filter(([, value]) => typeof value !== "string" || value.trim() === "")
    .map(([key]) => key);

  return invalidStringFields;
};
