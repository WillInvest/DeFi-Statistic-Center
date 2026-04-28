import { useRef } from "react";
import { highlight } from "./highlight";

type Props = {
  value: string;
  onChange: (next: string) => void;
  onRun?: () => void;
};

export function SqlEditor({ value, onChange, onRun }: Props) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    <div className="sql-editor">
      <pre className="sql-editor__highlight" aria-hidden="true">
        {highlight(value)}
        {value.endsWith("\n") ? "\n" : ""}
      </pre>
      <textarea
        ref={taRef}
        className="sql-editor__textarea"
        value={value}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        wrap="soft"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Tab") {
            e.preventDefault();
            const t = e.currentTarget;
            const s = t.selectionStart;
            const ed = t.selectionEnd;
            const next = value.slice(0, s) + "  " + value.slice(ed);
            onChange(next);
            requestAnimationFrame(() => {
              t.selectionStart = t.selectionEnd = s + 2;
            });
          } else if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            onRun?.();
          }
        }}
      />
    </div>
  );
}
