import { useParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useComments, useCreateComments, useDeleteComment } from "../../api/commentApi";
import { useEffect, useState } from "react";
import { showToast } from "../../utils/toastUtils";
import type { Comment } from "../../types";

export default function CommentsPage() {
    const { email, userId } = useAuth()
    const { snippetId } = useParams<{ snippetId: string }>()
    const { comments } = useComments(snippetId || '')
    const { create } = useCreateComments()
    const { deleteComment } = useDeleteComment()
    const [commentList, setCommentList] = useState<Comment[]>([])

    useEffect(() => {
        document.title = 'Comments — Code Snippet'
    }, [])

    useEffect(() => {
        setCommentList(comments)
    }, [comments])

    const commentCreateHandler = async (newComment: string) => {
        const createdComment = await create(snippetId!, newComment)
        setCommentList(prev => [...prev, createdComment as Comment])
    }

    const commentAction = async (formData: FormData) => {
        const comment = formData.get('comment') as string

        try {
            await commentCreateHandler(comment)
            showToast('Comment added — thanks for sharing your thoughts!', 'success')
        } catch (err) {
            showToast((err as Error).message, 'error')
        }
    }

    const commentDeleteHandler = async (commentId: string) => {
        try {
            await deleteComment(snippetId!, commentId)
            setCommentList(prev => prev.filter(comment => comment._id !== commentId))
            showToast('Comment deleted!', 'success')
        } catch (err) {
            showToast((err as Error).message || 'Failed to delete comment!', 'error')
        }
    }

    return (
        <main className="min-h-screen py-16 px-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-surface-900 dark:to-surface-800">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4">Comments</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Share your thoughts and interact with others.
                </p>

                {email && (
                    <div className="bg-white dark:bg-surface-800 shadow-lg rounded-lg p-6 mb-8">
                        <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-300 mb-4">Add a Comment</h3>
                        <form className="space-y-4" action={commentAction}>
                            <textarea
                                className="w-full border border-gray-300 dark:border-surface-600 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100"
                                name="comment"
                                placeholder="Write your comment..."
                                rows={4}
                            />
                            <button type="submit"
                                className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors">
                                Add Comment
                            </button>
                        </form>
                    </div>
                )}

                <div className="bg-white dark:bg-surface-800 shadow-lg rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-300 mb-4">All Comments</h3>

                    <div className="space-y-6">
                        {commentList.length > 0
                            ? (commentList.map(({ _id, text, creator }) => {
                                const commenterName = typeof creator === 'object' ? creator.username : 'Unknown'
                                const creatorId = typeof creator === 'object' ? creator._id : creator
                                return (
                                <div className="p-4 border border-indigo-200 dark:border-surface-600 rounded-lg shadow-md bg-indigo-100 dark:bg-surface-700" key={_id}>
                                    <p className="text-sm text-indigo-900 dark:text-gray-100">{text}</p>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-xs text-indigo-700 dark:text-primary-300 italic">By {commenterName}</p>
                                        {userId === creatorId ? (
                                            <div className="flex space-x-2">
                                                <button
                                                    className="bg-red-500 text-white text-xs px-3 py-1 rounded-md hover:bg-red-600 transition duration-200"
                                                    onClick={() => commentDeleteHandler(_id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )
                            }))
                            : (
                                <div className="flex flex-col items-center gap-3 py-8">
                                    <svg className="w-14 h-14 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <p className="text-gray-500 italic">
                                        No comments yet. Be the first to share your thoughts!
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}
