export const isExpired = (expiryDate) => {
  if (!expiryDate) return true; // treat missing date as expired
  return expiryDate.getTime() < Date.now();
};
