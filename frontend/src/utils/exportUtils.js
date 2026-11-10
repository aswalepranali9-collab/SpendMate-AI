export const exportTransactionsToCSV = (transactions, filename = 'spendmate_transactions.csv') => {
  if (!transactions || transactions.length === 0) {
    alert('No transactions available to export');
    return;
  }

  const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount', 'Payment Method'];
  
  const rows = transactions.map((t) => [
    t._id,
    new Date(t.date).toISOString().split('T')[0],
    t.type.toUpperCase(),
    `"${(t.category || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    t.amount,
    t.paymentMethod || 'UPI',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

