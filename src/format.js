const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

// Dates are stored as "YYYY-MM-DD"; build a local date so the day doesn't shift with the timezone.
export function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return date.format(new Date(year, month - 1, day));
}

export function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}
