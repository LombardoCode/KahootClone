// Function to print console logs when being on development mode
export const debugLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};
