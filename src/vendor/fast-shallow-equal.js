export function equal(first, second) {
  if (first === second) return true;
  if (!(first instanceof Object) || !(second instanceof Object)) return false;

  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);

  if (firstKeys.length !== secondKeys.length) return false;

  return firstKeys.every((key) => key in second && first[key] === second[key]);
}
