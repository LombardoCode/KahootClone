export const determineFinalMessageToPlayer = (place: number): string => {
  let finalMessage: string = "";

  switch (place) {
    case 1:
      finalMessage = "Congratulations!";
    case 2:
      finalMessage = "Very good job!";
    case 3:
      finalMessage = "Good job!";
    default:
      finalMessage = "Nice job!";
  }

  return finalMessage;
}
