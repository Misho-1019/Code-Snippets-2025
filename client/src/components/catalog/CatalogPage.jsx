import { useEffect, useState } from "react";
import snippetService from "../../services/snippetService";

export default function SnippetList() {
    const [snippets, setSnippets] = useState([])

    useEffect(() => {
        snippetService.getAll()
            .then(setSnippets)
    }, [])
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 border-b pb-4">
                    Your Snippets
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {snippets.map(snippet => (
                        <div key={snippet.id} className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
                            <div>
                                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                                    {snippet.title}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    Language: <span className="font-medium">{snippet.language}</span>
                                </p>
                                <p className="text-gray-700 text-sm mb-4">
                                    {snippet.description}
                                </p>
                                <pre className="bg-gray-100 text-sm p-3 rounded-md overflow-x-auto text-gray-800 font-mono">
                                    {snippet.code}
                                </pre>
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <button className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                                    Details
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
