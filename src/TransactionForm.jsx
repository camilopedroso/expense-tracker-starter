import { useState } from 'react'
import { formatCategory } from './format'

const TYPES = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

function TransactionForm({ categories, onAdd }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAdd({
      id: Date.now(),
      description,
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    });
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("food");
  };

  return (
    <section className="panel add-transaction">
      <div className="panel-header">
        <h2>Add a transaction</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <fieldset className="type-toggle">
          <legend className="visually-hidden">Type</legend>
          {TYPES.map(option => (
            <label key={option.value}>
              <input
                type="radio"
                name="type"
                value={option.value}
                checked={type === option.value}
                onChange={(e) => setType(e.target.value)}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
        <label className="field">
          <span>Description</span>
          <input
            type="text"
            placeholder="Groceries, rent, paycheck…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Amount</span>
            <input
              type="number"
              inputMode="decimal"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{formatCategory(cat)}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="primary-btn">
          Add {type === "income" ? "income" : "expense"}
        </button>
      </form>
    </section>
  );
}

export default TransactionForm
