"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight WYSIWYG editor with a formatting toolbar (H1/H2/H3, bold,
 * italic, bullet & numbered lists, link). Stores HTML. Uses the built-in
 * editing commands so there's no heavy dependency; can be swapped for TipTap
 * later without changing the stored format.
 */
export default function RichTextEditor({
  initialHTML = "",
  onChange,
}: {
  initialHTML?: string;
  onChange?: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Set initial content once on mount (uncontrolled to avoid caret jumps).
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = initialHTML;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(command: string, value?: string) {
    ref.current?.focus();
    document.execCommand(command, false, value);
    onChange?.(ref.current?.innerHTML ?? "");
  }

  function Btn({
    label,
    title,
    onClick,
    className = "",
  }: {
    label: string;
    title: string;
    onClick: () => void;
    className?: string;
  }) {
    return (
      <button
        type="button"
        title={title}
        // Keep the editor's selection — don't let the button steal focus.
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        className={`rounded px-2 py-1 text-sm text-ink-soft transition-colors hover:bg-slate-100 hover:text-ink ${className}`}
      >
        {label}
      </button>
    );
  }

  const Divider = () => <span className="mx-1 h-5 w-px bg-line" />;

  return (
    <div className="rounded-lg border border-line">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-line bg-slate-50 px-2 py-1.5">
        <Btn label="H1" title="Heading 1" onClick={() => exec("formatBlock", "<h1>")} className="font-bold" />
        <Btn label="H2" title="Heading 2" onClick={() => exec("formatBlock", "<h2>")} className="font-bold" />
        <Btn label="H3" title="Heading 3" onClick={() => exec("formatBlock", "<h3>")} className="font-bold" />
        <Divider />
        <Btn label="B" title="Bold" onClick={() => exec("bold")} className="font-bold" />
        <Btn label="I" title="Italic" onClick={() => exec("italic")} className="italic" />
        <Divider />
        <Btn label="• List" title="Bullet list" onClick={() => exec("insertUnorderedList")} />
        <Btn label="1. List" title="Numbered list" onClick={() => exec("insertOrderedList")} />
        <Btn
          label="Link"
          title="Insert link"
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) exec("createLink", url);
          }}
        />
        <Btn label="¶" title="Normal paragraph" onClick={() => exec("formatBlock", "<p>")} />
      </div>

      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange?.(e.currentTarget.innerHTML)}
        className="min-h-[220px] px-4 py-3 text-sm leading-relaxed text-ink outline-none [&_a]:text-brand-blue [&_a]:underline [&_h1]:mb-2 [&_h1]:mt-3 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-lg [&_h3]:font-bold [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6"
      />
    </div>
  );
}
