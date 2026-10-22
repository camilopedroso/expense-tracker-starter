import { useRef, useState } from 'react'
import { formatCategory, todayISO } from './format'

const TYPES = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

function TransactionForm({ categories, onAdd }) {
  const defaultCategory = categories[0];
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState(defaultCategory);
  const descriptionRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = description.trim();
    // `required` doesn't catch whitespace-only input, so report it with the browser's own validation UI.
    if (!text) {
      descriptionRef.current.setCustomValidity("Enter a description.");
      descriptionRef.current.reportValidity();
      return;
    }
    if (!(Number(amount) > 0)) return;

    onAdd({
      // Numeric on purpose: TransactionList breaks same-day ties with `b.id - a.id`.
      id: Date.now(),
      description: text,
      amount: Number(amount),
      type,
      category,
      date: todayISO(),
    });
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory(defaultCategory);
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
            ref={descriptionRef}
            type="text"
            required
            placeholder="Groceries, rent, paycheck…"
            value={description}
            onChange={(e) => {
              e.target.setCustomValidity("");
              setDescription(e.target.value);
            }}
          />
        </label>
        <div className="field-row">
          <label className="field">
            <span>Amount</span>
            <input
              type="number"
              required
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
