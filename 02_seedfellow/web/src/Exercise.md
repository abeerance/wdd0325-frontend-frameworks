# Übung: Eine Startseite, die sagt, wofür die Bibliothek da ist

## Ausgangslage

Die Startseite beginnt mit dem Wort "Seedfellow" in grossen Buchstaben. Das steht schon im Tab. Wer hier landet, lernt den Namen und nichts darüber, was die Bibliothek tut. Ein **Hero** ist der erste Block einer Seite: eine Überschrift und ein Satz, die sagen, wofür die Seite da ist, meistens mit einem Bild daneben.

## Ziel

Über dem Katalog steht ein Hero mit Überschrift, Satz und Bild, und darunter ein Streifen "How it works" mit drei nummerierten Schritten. Beides läuft auf dem Server.

## Schritte

### 1. Der Streifen: `src/components/how-it-works.tsx`

Exportiere `HowItWorks`. Die drei Schritte stehen in einem Array `STEPS` mit einem Interface `Step` (`id`, `title`, `text`):

- `borrow`: "Borrow a packet", "Pick a variety from the shelf below and borrow a packet of its seed."
- `grow`: "Grow it", "Sow it in the months on its card, in a garden bed or a pot on the balcony."
- `return`: "Bring seed back", "Save seed from your best plants and bring some back at the end of the season."

Eine `<section>` mit der Überschrift "How it works" als `<h2>`, darunter eine `<ol role="list">`. Jeder Schritt ist ein `<li>` mit seiner Nummer in einem runden `moss`-Kreis, dem Titel als `<h3>` und dem Text in `Text`. Auf dem Handy untereinander, ab `sm:` drei Spalten.

Verwende diese Klassen im `className` des jeweiligen Elements:

| Element in `HowItWorks`                  | Klassen                                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Äussere `<section>`                      | `flex flex-col gap-5`                                                                            |
| `<h2>` mit "How it works"                | `font-semibold text-2xl text-ink`                                                                |
| `<ol role="list">`                       | `grid gap-6 border-line border-y py-6 sm:grid-cols-3 sm:gap-8`                                   |
| Jedes `<li>`                             | `flex gap-4 sm:flex-col sm:gap-3`                                                                |
| `<span>` für die Nummer                  | `flex size-10 shrink-0 items-center justify-center rounded-full bg-moss font-semibold text-card` |
| `<div>` um Titel und Text eines Schritts | `flex flex-col gap-1`                                                                            |
| `<h3>` für den Schritttitel              | `font-semibold text-ink text-lg`                                                                 |
| `<Text>` für die Beschreibung            | `text-bark`                                                                                      |

`size-10` gibt dem Nummernkreis dieselbe Breite und Höhe. `shrink-0` verhindert, dass der Text ihn zusammendrückt. Ab `sm:` bekommt die Liste drei Spalten, und jedes `<li>` ordnet Nummer und Text untereinander an.

### 2. Der Hero: `src/components/hero.tsx`

Exportiere `Hero`. Links die kleine Zeile "A neighbourhood seed library", die Überschrift "Old seed stays alive when people grow it" als `<h1>` und der Satz "Borrow a packet of a heritage variety, grow it through the season, and bring back some of the seed it sets, so the next member can grow it too." in `Text`. Rechts das Bild, ab `lg:` nebeneinander. Unter beidem `<HowItWorks />`.

Ein äusseres `<div>` enthält den `<header>` und danach `<HowItWorks />`. Im `<header>` stehen ein `<div>` für die drei Texte und daneben der vorgegebene Bildblock.

| Element in `Hero`                                   | Klassen                                                     |
| --------------------------------------------------- | ----------------------------------------------------------- |
| Äusseres `<div>` um `<header>` und `<HowItWorks />` | `flex flex-col gap-12`                                      |
| `<header>` um Text und Bild                         | `grid items-center gap-8 lg:grid-cols-2 lg:gap-12`          |
| `<div>` um die drei Texte                           | `flex flex-col gap-4`                                       |
| `<p>` mit "A neighbourhood seed library"            | `font-medium text-moss text-sm uppercase tracking-widest`   |
| `<h1>`                                              | `font-semibold text-4xl text-ink leading-tight sm:text-5xl` |
| `<Text>` unter der Überschrift                      | `max-w-prose text-bark text-lg`                             |

Ohne `lg:` stehen Text und Bild untereinander. Ab `lg:` macht `lg:grid-cols-2` daraus zwei Spalten. Die Klassen für den Bildblock stehen schon im vorgegebenen Code.

Das Bild ist vorgegeben. Kopier es so, wie es hier steht:

```tsx
{
  /* Placeholder art until the library has photographs. The slot keeps its shape
    either way, so the page will not move when a photo replaces it. */
}
<div
  aria-hidden="true"
  className="relative aspect-video overflow-hidden rounded-3xl bg-linear-to-br from-sun/40 via-dew to-leaf/40 lg:aspect-4/3"
>
  <svg
    viewBox="0 0 400 300"
    preserveAspectRatio="xMidYMax slice"
    className="absolute inset-0 size-full"
    fill="none"
  >
    <circle cx="336" cy="116" r="30" className="fill-sun" />
    <path
      d="M0 240C90 224 170 228 240 234C300 239 350 234 400 226V300H0Z"
      className="fill-bark/20"
    />

    <g
      className="stroke-moss"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M180 238V216" />
      <path d="M180 222c0-8 6-12 14-12 0 8-6 12-14 12Z" className="fill-leaf" />

      <path d="M236 238V186" />
      <path
        d="M236 204c0-14 10-22 24-22 0 14-10 22-24 22Z"
        className="fill-leaf"
      />
      <path
        d="M236 216c0-12-9-18-20-18 0 12 9 18 20 18Z"
        className="fill-leaf"
      />

      <path d="M300 236V150" />
      <path
        d="M300 172c0-16 12-25 27-25 0 16-12 25-27 25Z"
        className="fill-leaf"
      />
      <path
        d="M300 192c0-14-11-22-24-22 0 14 11 22 24 22Z"
        className="fill-leaf"
      />
      <circle cx="300" cy="140" r="9" className="fill-sun" />
    </g>

    <g transform="rotate(-8 100 190)">
      <rect
        x="60"
        y="128"
        width="88"
        height="114"
        rx="10"
        className="fill-card stroke-line"
        strokeWidth="3"
      />
      <path d="M60 158H148" className="stroke-line" strokeWidth="3" />
      <path
        d="M104 226v-32"
        className="stroke-moss"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M104 202c0-10 7-16 17-16 0 10-7 16-17 16Z"
        className="fill-leaf stroke-moss"
        strokeWidth="3"
      />
      <path
        d="M76 143h38"
        className="stroke-bark/50"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  </svg>
</div>;
```

Zwei Dinge darin sind neu. Jede Farbe aus dem Theme gibt es auch als `fill-` und `stroke-` Klasse: Sie färben die Fläche und den Rand einer SVG-Form. `preserveAspectRatio` sagt einem `<svg>`, was es tun soll, wenn seine Box eine andere Form hat als die Zeichnung; `slice` füllt die Box und schneidet ab, was übersteht.

### 3. Die Seite

In `src/app/page.tsx` ersetzt `<Hero />` den bisherigen `<header>`. Ein Import, eine Zeile.

Das vorhandene `<main>` behält `className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:py-14"`. Darin steht zuerst `<Hero />`, danach der vorhandene `<Catalogue />`.

## Testen

- Die Startseite zeigt den Hero, die drei Schritte und darunter den Katalog.
- Zieh das Fenster von 360 Pixeln auf volle Breite: Nichts unter dem Hero springt, jede Nummer bleibt ein Kreis.
- `npm run lint` gibt nichts aus.

## Nachdenken

- Braucht eine der beiden Dateien `"use client"`? Woran erkennst du das?
- Warum eine `<ol>` und keine `<ul>`, und warum `role="list"`?
- Warum darf die Nummer im Kreis `index` verwenden, der `key` aber nicht?

## Schluss

- Auf der Seite gibt es genau eine `<h1>`, und sie heisst nicht "Seedfellow".
- "How it works" ist eine `<h2>`, jeder Schritt eine `<h3>`.
- `npm run lint` ist sauber.
