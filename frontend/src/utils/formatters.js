export const formatCurrency = (amount, symbol = '₹') => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${symbol}0`;
  }
  return `${symbol}${Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

