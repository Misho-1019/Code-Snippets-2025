import { Link, useNavigate, useParams } from "react-router";
import snippetService from "../../services/snippetService";
import useAuth from "../../hooks/useAuth";
import { useSnippet } from "../../api/snippetApi";

export default function SnippetDetails() {
    const { snippetId } = useParams();
    const { snippet } = useSnippet(snippetId)
    const { email } = useAuth()
    const navigate = useNavigate()

    const snippetDeleteClickHandler = async () => {
        const hasConfirm = confirm(`Are you sure you want to delete ${snippet.title} snippet?`)

        if (!hasConfirm) return;

        await snippetService.delete(snippetId)

        navigate('/snippets')
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <div className="border-b pb-4 mb-4">
                <h2 className="text-3xl font-bold text-indigo-700">{snippet.title}</h2>
                <p className="text-gray-500 mt-1">By <span className="font-medium text-gray-700">{email}</span></p>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Language</h3>
                <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
                    {snippet.language}
                </span>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                    {snippet.description}
                </p>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Code</h3>
                <pre className="bg-gray-100 rounded-md p-4 text-sm overflow-x-auto text-gray-800">
                    {snippet.code}
                </pre>
            </div>

            <div className="flex justify-end gap-2">
                <Link to={`/snippets/${snippetId}/edit`} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                    Edit
                </Link>
                <button onClick={snippetDeleteClickHandler} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors">
                    Delete
                </button>
            </div>
        </div>
    );
}
