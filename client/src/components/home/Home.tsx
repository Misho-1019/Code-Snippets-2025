import { Link, useNavigate } from "react-router";
import { useLatestSnippets } from "../../api/snippetApi";

export default function Home() {
    const navigate = useNavigate()
    const { latestSnippets, isLoading, error } = useLatestSnippets()

    const scrollToLatest = () => {
        document.getElementById('latest-snippets')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <main className="bg-gray-50 dark:bg-surface-900 min-h-screen py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">Welcome to Code Snippet</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Your personal code snippet manager. Save, search, and share your favorite code bits with ease.
                </p>
                <div className="flex justify-center gap-4 mb-12">
                    <button onClick={() => navigate('/snippets')} className="bg-primary-600 text-white px-6 py-2 rounded-full hover:bg-primary-700 transition">
                        Get Started
                    </button>
                    <button onClick={scrollToLatest} className="bg-white dark:bg-surface-800 border border-primary-600 text-primary-600 px-6 py-2 rounded-full hover:bg-indigo-50 dark:hover:bg-surface-700 transition">
                        Learn More
                    </button>
                </div>

                <h3 id="latest-snippets" className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-6">Latest Snippets</h3>

                {isLoading && (
                    <div className="text-gray-500 dark:text-gray-400">Loading snippets...</div>
                )}

                {error ? (
                    <div className="text-red-500">Failed to load snippets.</div>
                ) : null}

                {!isLoading && !error && latestSnippets.length === 0 && (
                    <div className="text-gray-500 dark:text-gray-400">No snippets yet.</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {latestSnippets.map(snippet => (
                        <div
                            key={snippet._id}
                            className="bg-indigo-50 dark:bg-surface-800 border border-indigo-200 dark:border-surface-600 rounded-xl shadow-md p-6 hover:shadow-lg transition"
                        >
                            <h4 className="text-lg font-semibold text-indigo-800 dark:text-primary-300 mb-2">{snippet.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                {snippet.description}
                            </p>
                            <pre className="bg-gray-100 dark:bg-surface-900 text-gray-800 dark:text-gray-200 text-xs p-4 rounded-md overflow-x-auto">
                                {snippet.code}
                            </pre>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Language: {snippet.language}</p>
                            <div className="pt-4 flex justify-end gap-2">
                                <Link to={`/snippets/${snippet._id}/details`} className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors">
                                    Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
