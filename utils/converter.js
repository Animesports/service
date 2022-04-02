export function ArrToObj(array) {
  if (typeof array !== "object" && typeof array.length !== "number") return {};

  const object = {};

  array.forEach(([key, value]) => {
    object[key] = value;
  });

  return object;
}

export function ObjToArr(object) {
  if (typeof object !== "object") return [];

  return Object.keys(object).map((key) => {
    return [key, object[key]];
  });
}
