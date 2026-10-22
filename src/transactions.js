export const CATEGORIES = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"];

export function sumByType(transactions, type) {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}
