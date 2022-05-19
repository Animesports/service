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

export function DotObj(obj) {
  const converted = [];

  Object.entries(obj).map(([key, value]) => {
    const [key1, key2] = key.split(".");

    const keyIndex = converted.map((e) => e[0]).indexOf(key1);

    if (keyIndex === -1) {
      return converted.push([key1, key2 ? { [key2]: value } : value]);
    }

    converted[keyIndex] = [key1, { ...converted[keyIndex][1], [key2]: value }];
  });

  return Object.fromEntries(converted);
}
