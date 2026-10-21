const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  trailingZeroDisplay: "stripIfInteger",
});

export function formatCurrency(value) {
  return currency.format(value);
}
