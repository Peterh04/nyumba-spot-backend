export const checkNumberFields = (fields) => {
  const invalidFiniteValues = Object.entries(fields)
    .filter(
      ([, value]) =>
        typeof value !== "number" || Number.isFinite(value) === false,
    )
    .map(([key]) => key);

  return invalidFiniteValues;
};
