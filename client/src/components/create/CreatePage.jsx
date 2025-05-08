import { useNavigate } from "react-router";
import { useCreateSnippet } from "../../api/snippetApi";

export default function CreateSnippet() {
    const navigate = useNavigate();
    const { create } = useCreateSnippet()
    
    const submitAction = async (formData) => {
        const snippetData = Object.fromEntries(formData)

        await create(snippetData)

        navigate('/snippets')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 border-b pb-4">
                    Create New Snippet
                </h2>

                <form className="space-y-6" action={submitAction}>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Snippet title"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Brief description of your snippet"
                        />
                    </div>

                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                            Code
                        </label>
                        <textarea
                            id="code"
                            name="code"
                            rows="6"
                            className="mt-1 block w-full font-mono px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Paste your code here"
                        />
                    </div>

                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                            Language
                        </label>
                        <input
                            type="text"
                            id="language"
                            name="language"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., JavaScript, Python"
                        />
                    </div>
                    
                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
                        >
                            Create Snippet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
