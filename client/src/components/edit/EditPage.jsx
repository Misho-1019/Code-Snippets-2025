import { useEffect, useState } from "react";
import { useParams } from "react-router";
import snippetService from "../../services/snippetService";

export default function EditSnippet() {
    const { snippetId } = useParams();
    const [snippet, setSnippet] = useState({})

    useEffect(() => {
        snippetService.getOne(snippetId)
            .then(setSnippet)
    }, [snippetId])

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">Edit Snippet</h2>

            <form className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                        type="text"
                        placeholder="Enter snippet title"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        defaultValue={snippet.title}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        rows="3"
                        placeholder="Brief description of the snippet"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        defaultValue={snippet.description}
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                    <textarea
                        rows="6"
                        placeholder="Paste your code here"
                        className="w-full font-mono border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        defaultValue={snippet.code}
                    ></textarea>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <input
                        type="text"
                        placeholder="e.g. JavaScript"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        defaultValue={snippet.language}
                    />
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
