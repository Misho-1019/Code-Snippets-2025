import { useState, useRef, type KeyboardEvent } from "react";

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    suggestions?: string[];
}

export default function TagInput({ tags, onChange, suggestions = [] }: TagInputProps) {
    const [input, setInput] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const addTag = (tag: string) => {
        const trimmed = tag.trim().toLowerCase()
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed])
        }
        setInput("")
        setShowSuggestions(false)
        inputRef.current?.focus()
    }

    const removeTag = (index: number) => {
        onChange(tags.filter((_, i) => i !== index))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addTag(input)
        } else if (e.key === "Backspace" && !input && tags.length > 0) {
            removeTag(tags.length - 1)
        }
    }

    const filtered = suggestions.filter(
        (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
    )

    return (
        <div className="relative">
            <div className="flex flex-wrap gap-1.5 p-2 border border-gray-300 dark:border-surface-600 rounded-md bg-white dark:bg-surface-700 min-h-[42px] focus-within:ring-2 focus-within:ring-primary-500">
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(i)}
                            className="hover:text-red-500 focus:outline-none"
                        >
                            &times;
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value)
                        setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length ? "Add tag..." : "Add tags..."}
                    className="flex-1 min-w-[100px] outline-none bg-transparent text-sm dark:text-gray-100 placeholder-gray-400"
                />
            </div>
            {showSuggestions && input && filtered.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-surface-800 border border-gray-200 dark:border-surface-600 rounded-md shadow-lg max-h-36 overflow-y-auto">
                    {filtered.slice(0, 8).map((s) => (
                        <button
                            key={s}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => addTag(s)}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-indigo-50 dark:hover:bg-surface-700 text-gray-700 dark:text-gray-200"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
