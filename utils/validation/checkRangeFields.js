export const checkRangeFields = (fields) => {
  const invalidRangeFields = Object.entries(fields)
    .filter(([, value]) => value.value < value.min || value.value > value.max)
    .reduce((accumulator, [key, value]) => {
      accumulator[key] = {
        value: value.value,
        reason: value.value < value.min ? "below minimum" : "above maximum",
        min: value.min,
        max: value.max,
      };

      return accumulator;
    }, {});

  return invalidRangeFields;
};
