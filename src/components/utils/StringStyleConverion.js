// https://stackoverflow.com/questions/54651201/how-do-i-covert-kebab-case-into-pascalcase#answer-54651317

export function kebabToCamelCase(text) {
  return text.replace(/-\w/g, clearAndUpper);
}

export function kebabToPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

export function kebabToPascalCaseWithSpaces(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpperWithSpaces);
}

export function kebabToLowerCaseWithSpaces(text) {
  return text.replace(/(^\w|-\w)/g, clearAndLowerWithSpaces);
}

export function capitalizeWord(word) {
  const upperCaseFirstLetter = word.charAt(0).toUpperCase();
  const rest = word.slice(1);

  return `${upperCaseFirstLetter}${rest}`;
}

function clearAndUpper(text) {
  return text.replace(/-/, "").toUpperCase();
}

function clearAndUpperWithSpaces(text) {
  return text.replace(/-/, " ").toUpperCase();
}

function clearAndLowerWithSpaces(text) {
  return text.replace(/-/, " ").toLowerCase();
}
