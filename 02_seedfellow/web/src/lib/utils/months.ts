// Month numbers as words, in the order given: [3, 4] is "March and April".
const MONTH = new Intl.DateTimeFormat("en-GB", {
  month: "long",
  // UTC, so the machine's own time zone cannot push a date into the neighbouring month.
  timeZone: "UTC",
});

// Joins words the English way: "March and April", "March, April and May".
const LIST = new Intl.ListFormat("en-GB");

// The variety card and the variety page call this to say when a variety is sown or harvested.
export function formatMonths(months: number[]): string {
  return LIST.format(
    // Any year works. Date.UTC counts months from 0, so month 3 (March) is written as 2.
    months.map((month) => MONTH.format(Date.UTC(2000, month - 1))),
  );
}
