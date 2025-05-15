import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useDeleteSnippet, useSnippet } from "../../api/snippetApi";
import { useToggleLike } from "../../api/likesApi";
import { showToast } from "../../utils/toastUtils";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function SnippetDetails() {
    const navigate = useNavigate()
    const { userId } = useAuth()
    const { snippetId } = useParams();
    const { snippet } = useSnippet(snippetId)
    const { deleteSnippet } = useDeleteSnippet()
    const { toggleLike } = useToggleLike()
    
    const [likesCount, setLikesCount] = useState(0)
    const [likedByUser, setLikedByUser] = useState(false)

    useEffect(() => {
        if (snippet && snippet.likes) {
            setLikesCount(snippet.likes.length)
            setLikedByUser(snippet.likes.includes(userId))
        }
    }, [snippet, userId])

    const snippetDeleteClickHandler = async () => {
        const hasConfirm = confirm(`Are you sure you want to delete ${snippet.title} snippet?`)

        if (!hasConfirm) return;

        try {
            await deleteSnippet(snippetId)

            showToast('Successfully deleted!', 'success')

            navigate('/snippets')
        } catch (error) {
            showToast(error.message, 'error')
        }

    }

    const likeHandler = async () => {
        try {
            const result = await toggleLike(snippetId)

            setLikesCount(result.likeCount)
            setLikedByUser(result.likedByUser)

            showToast(result.likedByUser ? 'You liked the snippet!' : 'You unliked the snippet!', 'success')
        } catch (err) {
            showToast(err.message, 'error')
        }
    }

    const isOwner = userId === snippet.creator

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <div className="border-b pb-4 mb-4">
                <h2 className="text-3xl font-bold text-indigo-700">{snippet.title}</h2>
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
                <pre className="bg-indigo-100 border border-indigo-200 rounded-md p-4 text-sm overflow-x-auto text-gray-800">
                    {snippet.code}
                </pre>

            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    {/* Like Button */}
                    <button
                        onClick={likeHandler}
                        className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors ${likedByUser ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
                            }`}
                    >
                        {likedByUser ? <FaHeart /> : <FaRegHeart />}
                        {likesCount} {likesCount === 1 ? "Like" : "Likes"}
                    </button>
                </div>

                <div className="flex justify-end gap-2">
                    <Link to={`/snippets/${snippetId}/comments`} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                        Comments
                    </Link>
                    {isOwner && (
                        <div className="flex justify-end gap-2">
                            <Link to={`/snippets/${snippetId}/edit`} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                                Edit
                            </Link>
                            <button onClick={snippetDeleteClickHandler} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors">
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
