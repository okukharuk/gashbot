export const toCorrectLength = (str: string[]) => {
  str[0] += str[0].length < 50 ? "⠀".repeat(50 - str[0].length) : "";
  return str.reduce((label, el) => {
    return label + "\n" + el;
  });
};
