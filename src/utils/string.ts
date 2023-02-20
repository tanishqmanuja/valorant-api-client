export function toTitleCase(str: string) {
  return str.length === 0
    ? ""
    : str.replace(
        /\w\S*/g,
        txt => txt[0].toUpperCase() + txt.slice(1).toLowerCase()
      );
}

export function toCamelCase(str: string) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function toPascalCase(str: string) {
  return capitalizeFirstLetter(toCamelCase(str));
}

export function removeAllSpace(str: string) {
  return str.replace(/\s/g, "");
}

export function removeCharaters(str: string) {
  return str.replace(/[&\/\\#,+()$~%.'":*?<>{}-]/g, "");
}
