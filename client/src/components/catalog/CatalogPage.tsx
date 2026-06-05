import { useState } from "react";
import { useSearchParams } from "react-router";
import ItemCatalog from "./item/ItemCatalog";
import { useSnippets } from "../../api/snippetApi";
import Spinner from "../Spinner";
import SkeletonCard from "../SkeletonCard";

export default function SnippetList() {
    const [searchParams, setSearchParams] = useSearchParams()
    const search = searchParams.get('search') || ''
    const language = searchParams.get('language') || ''
    const page = Number(searchParams.get('page')) || 1

    const [searchInput, setSearchInput] = useState(search)

    const { snippets, totalPages, currentPage, isLoading, error } = useSnippets(search || undefined, language || undefined, page)

    const updateParams = (updates: Record<string, string>) => {
        const next = new URLSearchParams(searchParams)
        for (const [key, value] of Object.entries(updates)) {
            if (value) next.set(key, value)
            else next.delete(key)
        }
        if (updates.search !== undefined || updates.language !== undefined) {
            next.delete('page')
        }
        setSearchParams(next)
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateParams({ search: searchInput })
    }

    const handlePageChange = (newPage: number) => {
        updateParams({ page: String(newPage) })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-surface-900 dark:to-surface-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b dark:border-surface-600 pb-4 gap-4">
                    <h2 className="text-3xl font-extrabold text-primary-700 dark:text-primary-300">
                        Snippets
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <form onSubmit={handleSearchSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Search snippets..."
                                className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100 w-full sm:w-48"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition"
                            >
                                Search
                            </button>
                        </form>

                        <select
                            value={language}
                            onChange={e => updateParams({ language: e.target.value })}
                            className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100"
                        >
                            <option value="">All Languages</option>
                            <option value="javascript">JavaScript</option>
                            <option value="typescript">TypeScript</option>
                            <option value="python">Python</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="jsx">JSX</option>
                            <option value="tsx">TSX</option>
                            <option value="java">Java</option>
                            <option value="csharp">C#</option>
                            <option value="go">Go</option>
                            <option value="rust">Rust</option>
                            <option value="sql">SQL</option>
                            <option value="bash">Bash</option>
                            <option value="json">JSON</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                )}

                {!!error && (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-red-500 text-lg">Failed to load snippets.</p>
                    </div>
                )}

                {!isLoading && !error && snippets.length === 0 && (
                    <div className="flex justify-center items-center h-64 bg-white dark:bg-surface-800 rounded-xl shadow-inner">
                        <h3 className="text-xl text-gray-500 dark:text-gray-400 font-semibold">
                            {search || language ? 'No snippets match your filters.' : 'No snippets yet'}
                        </h3>
                    </div>
                )}

                {!isLoading && !error && snippets.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {snippets.map((snippet, i) => (
                                <div key={snippet._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                                    <ItemCatalog {...snippet} />
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                    className="px-4 py-2 text-sm rounded-md bg-white dark:bg-surface-700 border border-gray-300 dark:border-surface-600 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-surface-600 transition"
                                >
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        className={`px-3 py-2 text-sm rounded-md transition ${
                                            p === currentPage
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-white dark:bg-surface-700 border border-gray-300 dark:border-surface-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-surface-600'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                    className="px-4 py-2 text-sm rounded-md bg-white dark:bg-surface-700 border border-gray-300 dark:border-surface-600 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-surface-600 transition"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
