import { Link } from "react-router";
import { useLatestSnippets } from "../../api/snippetApi";

export default function Home() {
    const { latestSnippets, isLoading, error } = useLatestSnippets()

    return (
        <main className="bg-gray-50 min-h-screen py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Welcome to Code Snippet</h2>
                <p className="text-lg text-gray-600 mb-8">
                    Your personal code snippet manager. Save, search, and share your favorite code bits with ease.
                </p>
                <div className="flex justify-center gap-4 mb-12">
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">
                        Get Started
                    </button>
                    <button className="bg-white border border-indigo-600 text-indigo-600 px-6 py-2 rounded-full hover:bg-indigo-50 transition">
                        Learn More
                    </button>
                </div>

                <h3 className="text-2xl font-bold text-gray-700 mb-6">Latest Snippets</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {latestSnippets.map(snippet => (
                        <div
                            key={snippet._id}
                            className="bg-indigo-50 border border-indigo-200 rounded-xl shadow-md p-6 hover:shadow-lg transition"
                        >
                            <h4 className="text-lg font-semibold text-indigo-800 mb-2">{snippet.title}</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                {snippet.description}
                            </p>
                            <pre className="bg-gray-100 text-gray-800 text-xs p-4 rounded-md overflow-x-auto">
                                {snippet.code}
                            </pre>
                            <p className="text-xs text-gray-400 mt-2">Language: {snippet.language}</p>
                            <div className="pt-4 flex justify-end gap-2">
                                <Link to={`/snippets/${snippet._id}/details`} className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
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
