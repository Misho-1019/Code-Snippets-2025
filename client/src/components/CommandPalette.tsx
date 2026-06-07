import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useAuth from "../hooks/useAuth";
import { FiSearch, FiPlus, FiHome, FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";

interface CommandPaletteProps {
    snippetTitles?: { _id: string; title: string }[];
}

export default function CommandPalette({ snippetTitles = [] }: CommandPaletteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 0);
            setQuery("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filtered = snippetTitles.filter((s) =>
        s.title.toLowerCase().includes(query.toLowerCase())
    );

    const actions = [
        { icon: FiHome, label: "Go Home", action: () => { navigate("/"); setIsOpen(false); } },
        { icon: FiSearch, label: "Browse Snippets", action: () => { navigate("/snippets"); setIsOpen(false); } },
    ];

    if (isAuthenticated) {
        actions.push(
            { icon: FiPlus, label: "Create Snippet", action: () => { navigate("/snippets/create"); setIsOpen(false); } },
            { icon: FiLogOut, label: "Logout", action: () => { navigate("/logout"); setIsOpen(false); } },
        );
    } else {
        actions.push(
            { icon: FiLogIn, label: "Login", action: () => { navigate("/login"); setIsOpen(false); } },
            { icon: FiUserPlus, label: "Register", action: () => { navigate("/register"); setIsOpen(false); } },
        );
    }

    const filteredActions = actions.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50"
            onClick={() => setIsOpen(false)}
        >
            <div
                className="bg-white dark:bg-surface-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-surface-600">
                    <FiSearch className="w-5 h-5 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search snippets or actions..."
                        className="flex-1 outline-none bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400"
                    />
                    <kbd className="px-2 py-0.5 text-xs text-gray-400 bg-gray-100 dark:bg-surface-700 rounded">ESC</kbd>
                </div>
                <div className="max-h-64 overflow-y-auto py-2">
                    {filtered.length > 0 && (
                        <div>
                            <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase">Snippets</p>
                            {filtered.slice(0, 5).map((s) => (
                                <button
                                    key={s._id}
                                    onClick={() => { navigate(`/snippets/${s._id}/details`); setIsOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-surface-700 text-gray-700 dark:text-gray-200"
                                >
                                    {s.title}
                                </button>
                            ))}
                        </div>
                    )}
                    {filteredActions.length > 0 && (
                        <div>
                            <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase">Actions</p>
                            {filteredActions.map((a) => (
                                <button
                                    key={a.label}
                                    onClick={a.action}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-surface-700 text-gray-700 dark:text-gray-200 flex items-center gap-3"
                                >
                                    <a.icon className="w-4 h-4 text-gray-400" />
                                    {a.label}
                                </button>
                            ))}
                        </div>
                    )}
                    {filtered.length === 0 && filteredActions.length === 0 && (
                        <p className="px-4 py-6 text-center text-sm text-gray-400">No results</p>
                    )}
                </div>
            </div>
        </div>
    );
}
