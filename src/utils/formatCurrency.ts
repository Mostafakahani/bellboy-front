export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("fa-IR", { style: "currency", currency: "IRR" }).format(amount);
};
