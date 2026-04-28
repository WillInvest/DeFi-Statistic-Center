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

export function formatSQL(input: string): string {
  if (!input) return input;
  let s = input.trim().replace(/\s+/g, " ");

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

  return out.join("\n").replace(/;?\s*$/, ";");
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

function splitTopLevel(s: string, sep: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let buf = "";
  let inStr = false;
  let q = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inStr) {
      buf += c;
      if (c === q && s[i - 1] !== "\\") inStr = false;
      continue;
    }
    if (c === "'" || c === '"') {
      inStr = true;
      q = c;
      buf += c;
      continue;
    }
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
  let inStr = false;
  let q = "";
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (inStr) {
      buf += c;
      if (c === q && s[i - 1] !== "\\") inStr = false;
      i++;
      continue;
    }
    if (c === "'" || c === '"') {
      inStr = true;
      q = c;
      buf += c;
      i++;
      continue;
    }
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
