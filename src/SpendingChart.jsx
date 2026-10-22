import { BarChart, Bar, LabelList, XAxis, YAxis, Tooltip } from 'recharts'
import { formatCurrency } from './formatCurrency'
import { formatCategory } from './format'

// One series, so one hue (set in App.css per theme): the category name on each row carries identity.
const ROW_HEIGHT = 40;

function ChartTooltip({ active, payload, totalSpent }) {
  if (!active || !payload?.length) return null;

  const { category, total } = payload[0].payload;
  const share = Math.round((total / totalSpent) * 100);

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{formatCategory(category)}</p>
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
    <section className="panel spending-chart">
      <div className="panel-header">
        <h2>Spending by category</h2>
        {data.length > 0 && (
          <p className="panel-meta">
            {formatCurrency(totalSpent)} across {data.length} {data.length === 1 ? "category" : "categories"}
          </p>
        )}
      </div>
      {data.length === 0 ? (
        <p className="empty-state">No expenses yet. Add one to see where your money goes.</p>
      ) : (
        <BarChart
          responsive
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 72, bottom: 0, left: 0 }}
          style={{ width: "100%", height: data.length * ROW_HEIGHT }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="category"
            width={112}
            axisLine={false}
            tickLine={false}
            tickFormatter={formatCategory}
            tick={{ fontSize: 14 }}
          />
          <Tooltip
            cursor={{ fillOpacity: 0.05 }}
            content={<ChartTooltip totalSpent={totalSpent} />}
          />
          <Bar
            dataKey="total"
            barSize={20}
            radius={[0, 4, 4, 0]}
            activeBar={{ fillOpacity: 0.85 }}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="total"
              position="right"
              offset={10}
              formatter={formatCurrency}
              style={{ fontSize: 14, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      )}
    </section>
  );
}

export default SpendingChart
