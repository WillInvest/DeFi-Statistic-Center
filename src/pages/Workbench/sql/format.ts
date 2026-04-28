const TOP_CLAUSES = [
  "WITH",
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "HAVING",
  "ORDER BY",
  "LIMIT",
  "OFFSET",
  "UNION ALL",
  "UNION",
  "INTERSECT",
  "EXCEPT",
  "RETURNING",
];

const PLACEHOLDER_RE = /__SQLLIT_\d+__/;

type Mask = { masked: string; literals: string[] };

// Walk the raw SQL once and replace string literals, quoted identifiers, line
// comments, and block comments with opaque `__SQLLIT_<n>__` placeholders. The
// placeholder contains no whitespace and no SQL keywords, so regex-based
// rewrites below cannot mutate literal contents. Honors SQL's `''` and `""`
// escape conventions for adjacent quotes.
function maskLiterals(sql: string): Mask {
  const literals: string[] = [];
  let masked = "";
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];

    if (c === "-" && sql[i + 1] === "-") {
      // Convert line comments (-- ... <eol>) to block-comment form before
      // masking. Line comments are line-terminated, but later passes collapse
      // newlines into single spaces, which would let the comment swallow
      // whatever text comes next on the formatted line (e.g. a trailing
      // comma). Block-comment form (/* ... */) is closed and survives any
      // surrounding whitespace normalization.
      const nl = sql.indexOf("\n", i);
      const end = nl < 0 ? sql.length : nl;
      // Neutralize any `*/` inside the line-comment body before wrapping, so
      // the synthesized block comment does not close prematurely. Replacing
      // with `* /` keeps the text readable; the comment stays a comment.
      const body = sql.slice(i + 2, end).trim().replace(/\*\//g, "* /");
      masked += emit(literals, "/* " + body + " */");
      i = end;
      continue;
    }
    if (c === "/" && sql[i + 1] === "*") {
      const close = sql.indexOf("*/", i + 2);
      const end = close < 0 ? sql.length : close + 2;
      masked += emit(literals, sql.slice(i, end));
      i = end;
      continue;
    }
    if (c === "'" || c === '"') {
      const q = c;
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === q) {
          if (sql[j + 1] === q) {
            j += 2;
            continue;
          }
          j++;
          break;
        }
        j++;
      }
      masked += emit(literals, sql.slice(i, j));
      i = j;
      continue;
    }

    masked += c;
    i++;
  }
  return { masked, literals };
}

function emit(literals: string[], text: string): string {
  const idx = literals.length;
  literals.push(text);
  return `__SQLLIT_${idx}__`;
}

function unmask(s: string, literals: string[]): string {
  return s.replace(/__SQLLIT_(\d+)__/g, (_m, n) => literals[parseInt(n, 10)]);
}

export function formatSQL(input: string): string {
  if (!input) return input;
  const { masked, literals } = maskLiterals(input);
  let s = masked.trim().replace(/\s+/g, " ");

  for (const c of TOP_CLAUSES) {
    const re = new RegExp(`\\b${c.replace(/ /g, "\\s+")}\\b`, "gi");
    s = s.replace(re, "\n" + c.toUpperCase());
  }

  s = s.replace(
    /\b((?:LEFT|RIGHT|INNER|OUTER|FULL|CROSS)\s+(?:OUTER\s+)?)?JOIN\b/gi,
    (m) => "\n" + m.replace(/\s+/g, " ").trim().toUpperCase()
  );

  const lines = s.split("\n").map((l) => l.trim()).filter(Boolean);
  const out: string[] = [];

  for (const line of lines) {
    const head = matchHead(line);
    if (!head) {
      out.push(line);
      continue;
    }
    const body = line.slice(head.length).trim();
    const HU = head.toUpperCase().replace(/\s+/g, " ");

    if (HU === "SELECT" || HU === "GROUP BY" || HU === "ORDER BY") {
      const parts = splitTopLevel(body, ",");
      if (parts.length > 1) {
        out.push(HU);
        parts.forEach((p, j) =>
          out.push("  " + p.trim() + (j < parts.length - 1 ? "," : ""))
        );
      } else {
        out.push(HU + (body ? " " + body : ""));
      }
    } else if (HU === "WHERE" || HU === "HAVING") {
      const parts = splitAndOr(body);
      out.push(HU + (parts.length ? " " + parts[0] : ""));
      for (let j = 1; j < parts.length; j++) out.push("  " + parts[j]);
    } else {
      out.push(HU + (body ? " " + body : ""));
    }
  }

  const formatted = out.join("\n").replace(/;?\s*$/, ";");
  return unmask(formatted, literals);
}

function matchHead(line: string): string | null {
  const heads = [
    "WITH",
    "SELECT",
    "FROM",
    "WHERE",
    "GROUP BY",
    "HAVING",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    "UNION ALL",
    "UNION",
    "INTERSECT",
    "EXCEPT",
    "RETURNING",
  ];
  for (const h of heads) {
    const re = new RegExp(`^${h.replace(/ /g, "\\s+")}\\b`, "i");
    const m = line.match(re);
    if (m) return m[0];
  }
  const j = line.match(
    /^((?:LEFT|RIGHT|INNER|OUTER|FULL|CROSS)\s+(?:OUTER\s+)?)?JOIN\b/i
  );
  if (j) return j[0];
  return null;
}

// `s` is the masked-and-trimmed body of a clause; literal contents live in
// `__SQLLIT_<n>__` placeholders that contain no commas/AND/OR/parens, so
// paren-depth tracking can be done with a simple counter.
function splitTopLevel(s: string, sep: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let buf = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "(") depth++;
    else if (c === ")") depth--;
    if (c === sep && depth === 0) {
      out.push(buf);
      buf = "";
      continue;
    }
    buf += c;
  }
  if (buf.trim()) out.push(buf);
  return out;
}

function splitAndOr(s: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let buf = "";
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === "(") depth++;
    else if (c === ")") depth--;
    if (depth === 0 && (i === 0 || /\s/.test(s[i - 1]))) {
      const m = s.slice(i).match(/^(AND|OR)\b/i);
      if (m) {
        if (buf.trim()) out.push(buf.trim());
        buf = m[1].toUpperCase() + " ";
        i += m[0].length;
        while (i < s.length && s[i] === " ") i++;
        continue;
      }
    }
    buf += c;
    i++;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

export const __test = { maskLiterals, unmask, PLACEHOLDER_RE };
