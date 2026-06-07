import { useEffect } from "react";

type KeyCombo = {
    key: string;
    ctrl?: boolean;
    meta?: boolean;
    shift?: boolean;
};

export default function useKeyboardShortcut(combo: KeyCombo, handler: () => void) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const ctrlOrMeta = (e.ctrlKey || e.metaKey);
            if (
                e.key.toLowerCase() === combo.key.toLowerCase() &&
                ctrlOrMeta === !!(combo.ctrl || combo.meta) &&
                !!e.shiftKey === !!combo.shift
            ) {
                e.preventDefault();
                handler();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [combo.key, combo.ctrl, combo.meta, combo.shift, handler]);
}
