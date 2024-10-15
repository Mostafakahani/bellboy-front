export const formatCurrency = (amount: number): string => {
  return `${new Intl.NumberFormat("fa-IR").format(amount)} تومان`;
};
