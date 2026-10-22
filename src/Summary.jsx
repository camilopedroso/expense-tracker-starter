import { formatCurrency } from './format'
import { sumByType } from './transactions'

// Interlaced waves in the style of the engraved line work on a banknote.
const GUILLOCHE_WIDTH = 600;
const GUILLOCHE_HEIGHT = 240;

function wavePath(phase, frequency, amplitude) {
  const points = [];
  for (let x = 0; x <= GUILLOCHE_WIDTH; x += 5) {
    const t = x / GUILLOCHE_WIDTH;
    const y = GUILLOCHE_HEIGHT / 2
      + amplitude * Math.sin(t * Math.PI * frequency + phase) * Math.cos(t * Math.PI * 1.5 + phase / 3);
    points.push(`${x},${y.toFixed(1)}`);
  }
  return `M${points.join(" L")}`;
}

const GUILLOCHE_PATHS = Array.from({ length: 16 }, (_, i) => [
  wavePath(i * 0.39, 3, 92),
  wavePath(Math.PI + i * 0.39, 5, 64),
]).flat();

function Guilloche() {
  return (
    <svg
      className="guilloche"
      viewBox={`0 0 ${GUILLOCHE_WIDTH} ${GUILLOCHE_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {GUILLOCHE_PATHS.map((d, i) => (
        <path key={i} d={d} pathLength="1" style={{ animationDelay: `${i * 18}ms` }} />
      ))}
    </svg>
  );
}

function Summary({ transactions }) {
  const totalIncome = sumByType(transactions, "income");
  const totalExpenses = sumByType(transactions, "expense");
  const balance = totalIncome - totalExpenses;

  return (
    <section className="summary" aria-label="Summary">
      <Guilloche />
      <div className="summary-body">
        <p className="summary-label">Balance</p>
        <p className={balance < 0 ? "balance-amount negative" : "balance-amount"}>
          {formatCurrency(balance)}
        </p>
        <dl className="summary-flows">
          <div>
            <dt>Income</dt>
            <dd>{formatCurrency(totalIncome)}</dd>
          </div>
          <div>
            <dt>Expenses</dt>
            <dd>{formatCurrency(totalExpenses)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default Summary
