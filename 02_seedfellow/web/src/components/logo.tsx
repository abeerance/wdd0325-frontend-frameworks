// The library's name with its mark: a seed that has just put up two leaves. The drawing
// is aria-hidden because it repeats the word beside it, so the word alone is what a
// screen reader reads. It is a <p>, not a heading: each page brings its own <h1>.
export function Logo() {
  return (
    <p className="flex items-center gap-2.5 font-semibold text-ink text-lg">
      <svg aria-hidden="true" viewBox="0 0 32 32" className="size-8 shrink-0">
        <circle cx="16" cy="16" r="16" className="fill-moss" />
        <path
          d="M16 24V13"
          className="stroke-card"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M16 16c0-5 3.5-8.5 9-8.5 0 5-3.5 8.5-9 8.5Z"
          className="fill-leaf"
        />
        <path
          d="M16 19c0-4.5-3-7.5-8-7.5 0 4.5 3 7.5 8 7.5Z"
          className="fill-card"
        />
        <ellipse cx="16" cy="25" rx="4" ry="2.5" className="fill-sun" />
      </svg>
      Seedfellow
    </p>
  );
}
