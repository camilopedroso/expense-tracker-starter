import { BarChart, Bar, CartesianGrid, Rectangle, XAxis, YAxis, Tooltip } from 'recharts'
import { formatCurrency } from './formatCurrency'

// Keyed by category so each one keeps its color when the ranking changes.
const CATEGORY_COLORS = {
  housing: "#ff6384",
  food: "#36a2eb",
  salary: "#ffcd56",
  utilities: "#4bc0c0",
  transport: "#9966ff",
  entertainment: "#ff9f40",
  other: "#a0a3a8",
};

function CategoryBar(props) {
  const fill = CATEGORY_COLORS[props.payload.category] ?? CATEGORY_COLORS.other;
  return <Rectangle {...props} fill={fill} fillOpacity={props.isActive ? 0.85 : 1} />;
}

function ChartTooltip({ active, payload, totalSpent }) {
  if (!active || !payload?.length) return null;

  const { category, total } = payload[0].payload;
  const share = Math.round((total / totalSpent) * 100);

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{category}</p>
      <p className="chart-tooltip-value">{formatCurrency(total)}</p>
      <p className="chart-tooltip-share">{share}% of spending</p>
    </div>
  );
}

function SpendingChart({ transactions }) {
  const totalsByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((totals, t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
      return totals;
    }, {});

  const data = Object.entries(totalsByCategory)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const totalSpent = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="spending-chart">
      <div className="spending-chart-header">
        <h2>Spending by Category</h2>
        {data.length > 0 && (
          <p className="spending-chart-total">
            {formatCurrency(totalSpent)} across {data.length} {data.length === 1 ? "category" : "categories"}
          </p>
        )}
      </div>
      {data.length === 0 ? (
        <p className="empty-chart">No expenses yet.</p>
      ) : (
        <BarChart
          responsive
          data={data}
          barCategoryGap="20%"
          margin={{ top: 16, right: 8, bottom: 0, left: 8 }}
          style={{ width: "100%", height: 300 }}
        >
          <CartesianGrid stroke="#d6d5d0" strokeDasharray="4 4" />
          <XAxis
            dataKey="category"
            axisLine={{ stroke: "#888" }}
            tickLine={false}
            tickMargin={8}
            tickFormatter={(category) => category.charAt(0).toUpperCase() + category.slice(1)}
            tick={{ fill: "#52514e", fontSize: 13 }}
          />
          <YAxis
            axisLine={{ stroke: "#888" }}
            tickLine={false}
            tickFormatter={formatCurrency}
            tick={{ fill: "#52514e", fontSize: 13 }}
          />
          <Tooltip
            cursor={{ fill: "#000", fillOpacity: 0.04 }}
            content={<ChartTooltip totalSpent={totalSpent} />}
          />
          <Bar dataKey="total" shape={CategoryBar} />
        </BarChart>
      )}
    </div>
  );
}

export default SpendingChart
