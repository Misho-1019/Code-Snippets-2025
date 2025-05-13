import { Link, useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import commentService from "../../services/commentService";
import { useEffect, useState } from "react";

export default function CommentsPage() {
    const { username, email, userId } = useAuth()
    const { snippetId } = useParams()
    const [comments, setComments] = useState([])

    useEffect(() => {
        commentService.getAllComments(snippetId)
            .then(setComments)
    }, [snippetId])

    const commentCreateHandler = (newComment) => {
        setComments(state => [...state, newComment])
    }

    const commentAction = async (formData) => {
        const comment = formData.get('comment')

        const newComment = await commentService.createComment(snippetId, userId, comment)

        commentCreateHandler(newComment);

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
                        {comments.length > 0
                            ? (comments.map(({ _id, text }) => (
                                <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50" key={_id}>
                                    <p className="text-sm text-gray-600">{text}</p>
                                    <p className="text-xs text-gray-400 mt-2">By {username}</p>
                                </div>
                            )))
                            : (
                                <p className="text-gray-500 italic bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                    No comments yet. Be the first to share your thoughts!
                                </p>
                            )
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}
