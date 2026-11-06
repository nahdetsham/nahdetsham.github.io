// A small colouring tokenizer for the code shown on the site (JS / Python / Excel snippets).
// Arabic strings stay one token: splitting them into per-letter spans would break the letter joining.
export type Tok = { t: string; c: string };

const RE = /("(?:[^"\\]|\\.)*"|`[^`]*`|'(?:[^'\\]|\\.)*')|(\b(?:const|let|var|await|async|function|return|class|def|import|from|new|true|false|None|self)\b)|(\b[A-Za-z_][A-Za-z0-9_]*(?=\s*:))|(\b[A-Za-z_][A-Za-z0-9_]*(?=\())|(\b\d+(?:\.\d+)?\b)|([{}()[\],.;:=+\-*/%<>!&|?^]+)|(\s+)|([^\s])/g;

export function tokenize(code: string): Tok[] {
  const out: Tok[] = [];
  for (const m of code.matchAll(RE)) {
    const [t, str, kw, key, fn, num, pun, ws] = m;
    out.push({ t, c: str ? "s" : kw ? "k" : key ? "p" : fn ? "f" : num ? "n" : pun ? "o" : ws ? "" : "" });
  }
  return out;
}

const ARABIC = /[؀-ۿ]/;

/** Typing units: single characters, except tokens holding Arabic (kept whole). */
export function typingUnits(code: string): Tok[] {
  return tokenize(code).flatMap((tk) => (ARABIC.test(tk.t) || /^\s+$/.test(tk.t) ? [tk] : [...tk.t].map((ch) => ({ t: ch, c: tk.c }))));
}
