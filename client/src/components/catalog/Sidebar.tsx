import { useSearchParams } from "react-router";
import { useLanguages, useTags } from "../../api/snippetApi";

export default function Sidebar() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { languages } = useLanguages()
    const { tags } = useTags()

    const activeLang = searchParams.get('language') || ''
    const activeTag = searchParams.get('tag') || ''

    const setLanguage = (lang: string) => {
        const next = new URLSearchParams(searchParams)
        if (lang) next.set('language', lang)
        else next.delete('language')
        next.delete('tag')
        next.delete('page')
        setSearchParams(next)
    }

    const setTag = (tag: string) => {
        const next = new URLSearchParams(searchParams)
        if (tag) next.set('tag', tag)
        else next.delete('tag')
        next.delete('page')
        setSearchParams(next)
    }

    return (
        <aside className="space-y-6">
            <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Languages</h4>
                <div className="space-y-0.5">
                    <button
                        onClick={() => setLanguage('')}
                        className={`w-full text-left px-2 py-1 rounded text-sm transition ${
                            !activeLang ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-700'
                        }`}
                    >
                        All ({languages.reduce((s, l) => s + l.count, 0)})
                    </button>
                    {languages.map(({ name, count }) => (
                        <button
                            key={name}
                            onClick={() => setLanguage(name)}
                            className={`w-full text-left px-2 py-1 rounded text-sm transition flex justify-between ${
                                activeLang === name ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-700'
                            }`}
                        >
                            <span>{name}</span>
                            <span className="text-xs opacity-60">{count}</span>
                        </button>
                    ))}
                </div>
            </div>

            {tags.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map(({ name, count }) => (
                            <button
                                key={name}
                                onClick={() => setTag(activeTag === name ? '' : name)}
                                className={`px-2 py-0.5 rounded-full text-xs transition ${
                                    activeTag === name
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 dark:bg-surface-700 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900'
                                }`}
                            >
                                {name} ({count})
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
}
