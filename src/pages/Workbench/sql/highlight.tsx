import type { ReactNode } from "react";

const KW = new Set([
  "SELECT","FROM","WHERE","GROUP","ORDER","BY","HAVING","LIMIT","OFFSET",
  "UNION","ALL","INTERSECT","EXCEPT","RETURNING","WITH","AS","ON","AND","OR",
  "NOT","IN","BETWEEN","LIKE","ILIKE","IS","NULL","TRUE","FALSE","CASE","WHEN",
  "THEN","ELSE","END","DISTINCT","JOIN","LEFT","RIGHT","INNER","OUTER","FULL",
  "CROSS","ASC","DESC","EXISTS","VALUES","INSERT","INTO","UPDATE","SET",
  "DELETE","CREATE","TABLE","VIEW","INDEX","DROP","ALTER","CAST","INTERVAL",
  "EPOCH","NOW","EXTRACT",
]);

export function highlight(sql: string): ReactNode[] {
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const push = (cls: string, text: string) =>
    out.push(<span key={key++} className={cls}>{text}</span>);

  while (i < sql.length) {
    const c = sql[i];

    if (c === "-" && sql[i + 1] === "-") {
      const nl = sql.indexOf("\n", i);
      const end = nl < 0 ? sql.length : nl;
      push("tok-comment", sql.slice(i, end));
      i = end;
      continue;
    }
    if (c === "/" && sql[i + 1] === "*") {
      const close = sql.indexOf("*/", i + 2);
      const end = close < 0 ? sql.length : close + 2;
      push("tok-comment", sql.slice(i, end));
      i = end;
      continue;
    }
    if (c === "'") {
      let j = i + 1;
      while (j < sql.length) {
        if (sql[j] === "'" && sql[j - 1] !== "\\") {
          j++;
          break;
        }
        j++;
      }
      push("tok-str", sql.slice(i, j));
      i = j;
      continue;
    }
    if (c === '"') {
      let j = i + 1;
      while (j < sql.length && sql[j] !== '"') j++;
      push("tok-ident", sql.slice(i, j + 1));
      i = j + 1;
      continue;
    }
    if (/\d/.test(c)) {
      let j = i;
      while (j < sql.length && /[\d.]/.test(sql[j])) j++;
      push("tok-num", sql.slice(i, j));
      i = j;
      continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i;
      while (j < sql.length && /[A-Za-z0-9_]/.test(sql[j])) j++;
      const word = sql.slice(i, j);
      if (KW.has(word.toUpperCase())) {
        push("tok-kw", word);
      } else {
        let k = j;
        while (k < sql.length && /\s/.test(sql[k])) k++;
        if (sql[k] === "(") push("tok-fn", word);
        else push("tok-ident", word);
      }
      i = j;
      continue;
    }
    out.push(sql[i]);
    i++;
  }
  return out;
}
