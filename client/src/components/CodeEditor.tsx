import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { json } from "@codemirror/lang-json";

interface CodeEditorProps {
    value: string;
    onChange?: (value: string) => void;
    language?: string;
    readOnly?: boolean;
    className?: string;
    isDark?: boolean;
}

const langMap: Record<string, () => any> = {
    javascript: () => javascript(),
    js: () => javascript(),
    jsx: () => javascript({ jsx: true }),
    typescript: () => javascript({ typescript: true }),
    ts: () => javascript({ typescript: true }),
    tsx: () => javascript({ jsx: true, typescript: true }),
    python: () => python(),
    py: () => python(),
    css: () => css(),
    html: () => html(),
    json: () => json(),
};

function getExtension(language?: string) {
    const lang = (language || "javascript").toLowerCase();
    const ext = langMap[lang];
    return ext ? [ext()] : [];
}

export default function CodeEditor({ value, onChange, language, readOnly, className, isDark }: CodeEditorProps) {
    return (
        <CodeMirror
            value={value}
            onChange={onChange}
            extensions={getExtension(language)}
            readOnly={readOnly}
            basicSetup
            theme={isDark ? 'dark' : 'light'}
            className={`rounded-md overflow-hidden border border-gray-300 dark:border-surface-600 ${className || ""}`}
            style={{ fontSize: "0.875rem" }}
        />
    );
}

