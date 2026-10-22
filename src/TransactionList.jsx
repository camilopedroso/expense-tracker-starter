import { useRef, useState } from 'react'
import ConfirmModal from './ConfirmModal'
import { formatCategory, formatCurrency, formatDate } from './format'

function TransactionList({ transactions, categories, onDelete }) {
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [pendingDelete, setPendingDelete] = useState(null);
  const headingRef = useRef(null);

  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }

  // Newest first; same-day entries fall back to the order they were added (ids are Date.now() numbers).
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => b.date.localeCompare(a.date) || b.id - a.id
  );

  const isFiltered = filterType !== "all" || filterCategory !== "all";

  const clearFilters = () => {
    setFilterType("all");
    setFilterCategory("all");
  };

  return (
    <section className="panel transactions">
      <div className="panel-header">
        {/* Focus target after a delete, when the row's Delete button no longer exists. */}
        <h2 ref={headingRef} tabIndex={-1}>Transactions</h2>
        <div className="filters">
          <select aria-label="Filter by type" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
          <select aria-label="Filter by category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{formatCategory(cat)}</option>
            ))}
          </select>
        </div>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="empty-state">
          {isFiltered ? (
            <>
              <p>No transactions match these filters.</p>
              <button className="text-btn" onClick={clearFilters}>Clear filters</button>
            </>
          ) : (
            <p>No transactions yet. Add your first one above.</p>
          )}
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th className="amount-col">Amount</th>
              <th><span className="visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map(t => (
              <tr key={t.id}>
                <td className="date-cell">{formatDate(t.date)}</td>
                <td className="description-cell">{t.description}</td>
                <td className="category-cell">{formatCategory(t.category)}</td>
                <td className={t.type === "income" ? "amount-col income-amount" : "amount-col expense-amount"}>
                  {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                </td>
                <td className="action-cell">
                  <button
                    className="delete-btn"
                    aria-label={`Delete ${t.description}`}
                    onClick={() => setPendingDelete(t)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {pendingDelete && (
        <ConfirmModal
          message={`Delete "${pendingDelete.description}"?`}
          onConfirm={() => {
            onDelete(pendingDelete.id);
            setPendingDelete(null);
          }}
          onCancel={() => setPendingDelete(null)}
          fallbackFocusRef={headingRef}
        />
      )}
    </section>
  );
}

export default TransactionList
