import { Link } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function CommentsPage() {
    const { username, email } = useAuth()

    const commentAction = (formData) => {
        const comment = formData.get('comment')

        console.log(username);
        console.log(comment);
    }
    return (
        <main className="bg-gray-50 min-h-screen py-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Comments</h2>
                <p className="text-lg text-gray-600 mb-8">
                    Share your thoughts and interact with others.
                </p>

                {/* Comment Input Form (Without functionality) */}
                {email && (
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                        <h3 className="text-xl font-semibold text-indigo-700 mb-4">Add a Comment</h3>
                        <form className="space-y-4" action={commentAction}>
                            <textarea
                                className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                name="comment"
                                placeholder="Write your comment..."
                                rows="4"
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                Add Comment
                            </button>
                        </form>
                    </div>
                )}

                {/* Displaying Static Comments (Without fetching data) */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-indigo-700 mb-4">All Comments</h3>

                    {/* Static Example Comments */}
                    <div className="space-y-6">
                        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                            <p className="text-sm text-gray-600">This is a great snippet, really helpful!</p>
                            <p className="text-xs text-gray-400 mt-2">By John Doe</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                            <p className="text-sm text-gray-600">Nice code structure, thanks for sharing!</p>
                            <p className="text-xs text-gray-400 mt-2">By Jane Smith</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                            <p className="text-sm text-gray-600">Great explanation and clean code!</p>
                            <p className="text-xs text-gray-400 mt-2">By Mark Lee</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
