import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router";
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
    const debounceRef = useRef<ReturnType<typeof setTimeout>>()

    useEffect(() => {
        setSearchInput(search)
    }, [search])

    const { snippets, totalPages, currentPage, isLoading, error } = useSnippets(search || undefined, language || undefined, page)

    useEffect(() => {
        document.title = 'Snippets — Code Snippet'
    }, [])

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

    const getPageNumbers = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        }
        const pages: (number | string)[] = [1]
        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)
        if (start > 2) pages.push('...')
        for (let i = start; i <= end; i++) pages.push(i)
        if (end < totalPages - 1) pages.push('...')
        pages.push(totalPages)
        return pages
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
                                onChange={e => {
                                    const value = e.target.value
                                    setSearchInput(value)
                                    clearTimeout(debounceRef.current)
                                    debounceRef.current = setTimeout(() => {
                                        updateParams({ search: value })
                                    }, 300)
                                }}
                                placeholder="Search snippets..."
                                className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100 w-full sm:w-48"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 active:scale-95 transition"
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
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-500 text-lg">Failed to load snippets.</p>
                        <button onClick={() => window.location.reload()} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 active:scale-95 transition">
                            Try Again
                        </button>
                    </div>
                )}

                {!isLoading && !error && snippets.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-surface-800 rounded-xl shadow-inner gap-3">
                        <svg className="w-16 h-16 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl text-gray-500 dark:text-gray-400 font-semibold">
                            {search || language ? 'No snippets match your filters.' : 'No snippets yet'}
                        </h3>
                        {!search && !language && (
                            <Link to="/snippets/create" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 active:scale-95 transition">
                                Create your first snippet
                            </Link>
                        )}
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
                                    className="px-4 py-2 text-sm rounded-md bg-white dark:bg-surface-700 border border-gray-300 dark:border-surface-600 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-surface-600 active:scale-95 transition"
                                >
                                    Prev
                                </button>
                                {getPageNumbers().map(p => (
                                    typeof p === 'string' ? (
                                        <span key={p} className="px-2 py-2 text-sm text-gray-400">...</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => handlePageChange(p)}
                                            className={`px-3 py-2 text-sm rounded-md transition active:scale-95 ${
                                                p === currentPage
                                                    ? 'bg-primary-600 text-white'
                                                    : 'bg-white dark:bg-surface-700 border border-gray-300 dark:border-surface-600 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-surface-600'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                ))}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                    className="px-4 py-2 text-sm rounded-md bg-white dark:bg-surface-700 border border-gray-300 dark:border-surface-600 dark:text-gray-200 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-surface-600 active:scale-95 transition"
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
