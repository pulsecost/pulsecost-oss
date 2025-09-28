// Format utilities for the dashboard

export const formatCurrencyGBP = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
};

export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  if (isNaN(date.getTime())) {
    return iso; // Return original string if invalid date
  }
  return date.toISOString().split('T')[0] || iso; // YYYY-MM-DD format
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const pct = (x: number): string => {
  return `${(x * 100).toFixed(0)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-GB').format(value);
};

// Legacy exports for backward compatibility
export const formatCurrency = formatCurrencyGBP;
export const formatPercentage = pct;
