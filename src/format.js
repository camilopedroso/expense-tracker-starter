const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  trailingZeroDisplay: "stripIfInteger",
});

const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatCurrency(value) {
  return currency.format(value);
}

// Dates are stored as "YYYY-MM-DD"; build a local date so the day doesn't shift with the timezone.
export function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return date.format(new Date(year, month - 1, day));
}

// Today's date as "YYYY-MM-DD" in local time (toISOString would use UTC and can return tomorrow).
export function todayISO() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}
