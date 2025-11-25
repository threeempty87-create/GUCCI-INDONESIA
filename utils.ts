export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateReturns = (price: number, rate: number = 0.20) => {
  const commission = price * rate;
  const total = price + commission;
  return {
    price,
    commission,
    total
  };
};