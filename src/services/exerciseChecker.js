export function equalResult(actual, expected) {
  if (typeof expected === 'number') return typeof actual === 'number' && Number.isFinite(actual) && Math.abs(actual - expected) <= 1e-7 * Math.max(1, Math.abs(expected));
  if (Array.isArray(expected)) return Array.isArray(actual) && actual.length === expected.length && actual.every((x, i) => equalResult(x, expected[i]));
  return actual === expected;
}
export function validateInput(values, fields) {
  return values.length === fields.length && fields.every((f, i) => typeof values[i] === 'number' && Number.isFinite(values[i]) && (!f.integer || Number.isInteger(values[i])) && (f.min === undefined || values[i] >= f.min) && (f.max === undefined || values[i] <= f.max));
}
