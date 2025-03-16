export const ordinalNumber = (number: number): string => {
  let suffix: string = "";

  if (number > 3 && number < 21) {
    suffix = "th"
  };

  switch (number % 10) {
    case 1:
      suffix = "st";
    case 2:
      suffix = "nd";
    case 3:
      suffix = "rd";
    default:
      suffix = "th";
  }

  return `${number}${suffix}`;
};
