// Month numbers as words, in the order given: [3, 4] is "March and April".
const MONTH = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  timeZone: "UTC",
});

const LIST = new Intl.ListFormat("en-GB");

export function formatMonths(months: number[]): string {
  return LIST.format(
    months.map((month) => MONTH.format(Date.UTC(2000, month - 1))),
  );
}
