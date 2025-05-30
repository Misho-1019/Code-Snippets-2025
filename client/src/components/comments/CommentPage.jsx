import { useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useComments, useCreateComments, useDeleteComment } from "../../api/commentApi";
import { useEffect, useState } from "react";
import { showToast } from "../../utils/toastUtils";

export default function CommentsPage() {
    const { username, email, userId } = useAuth()
    const { snippetId } = useParams()
    const { comments } = useComments(snippetId)
    const { create } = useCreateComments()
    const { deleteComment } = useDeleteComment()
    const [commentList, setCommentList] = useState([])

    useEffect(() => {
        setCommentList(comments)
    }, [comments])

    const commentCreateHandler = async (newComment) => {
        const createdComment = await create(snippetId, newComment, userId)

        setCommentList(prev => [...prev, createdComment])
    }

    const commentAction = async (formData) => {
        const comment = formData.get('comment')

        try {
            await commentCreateHandler(comment)

            showToast('Comment added — thanks for sharing your thoughts!', 'success')
        } catch (err) {
            showToast(err.message, 'error')
        }
    }

    const commentDeleteHandler = async (commentId) => {
        try {
            await deleteComment(snippetId, commentId)
            setCommentList(prev => prev.filter(comment => comment._id !== commentId))

            showToast('Comment deleted!', 'success')
        } catch (err) {
            showToast(err.message || 'Failed to delete comment!', 'error')
        }
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
                        {commentList.length > 0
                            ? (commentList.map(({ _id, text, creator }) => (
                                <div className="p-4 border border-indigo-200 rounded-lg shadow-md bg-indigo-100" key={_id}>
                                    <p className="text-sm text-indigo-900">{text}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-xs text-indigo-700 italic">By {username}</p>
                                        {userId === creator ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    className="bg-indigo-500 text-white text-xs px-3 py-1 rounded-md hover:bg-indigo-600 transition duration-200"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white text-xs px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                                                    onClick={() => commentDeleteHandler(_id)}  
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        ) : ''}
                                    </div>
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
