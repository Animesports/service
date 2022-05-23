export function plural(number) {
  return {
    is: () => number !== 1,
    convert: (text, pl) => {
      return number === 1 ? text : text + (pl ?? "s");
    },
  };
}
