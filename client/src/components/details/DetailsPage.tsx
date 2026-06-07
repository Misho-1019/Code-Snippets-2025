import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useDeleteSnippet, useSnippet, useForkSnippet } from "../../api/snippetApi";
import { useToggleLike } from "../../api/likesApi";
import { showToast } from "../../utils/toastUtils";
import { FaHeart, FaRegHeart, FaCopy } from "react-icons/fa";
import CodeEditor from "../CodeEditor";
import Spinner from "../Spinner";
import SkeletonDetails from "../SkeletonDetails";
import Breadcrumbs from "../Breadcrumbs";
import ConfirmModal from "../ConfirmModal";
import { useThemeContext } from "../../context/ThemeContext";

export default function SnippetDetails() {
    const navigate = useNavigate()
    const { userId, isAuthenticated } = useAuth()
    const { isDark } = useThemeContext()
    const { snippetId } = useParams<{ snippetId: string }>()
    const { snippet, isLoading, error } = useSnippet(snippetId || '')
    const { deleteSnippet } = useDeleteSnippet()
    const { forkSnippet } = useForkSnippet()
    const { toggleLike } = useToggleLike()

    const [likesCount, setLikesCount] = useState(0)
    const [likedByUser, setLikedByUser] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isLiking, setIsLiking] = useState(false)
    const [isForking, setIsForking] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const deleteBtnRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (snippet && snippet.likes) {
            setLikesCount(snippet.likes.length)
            setLikedByUser(snippet.likes.includes(userId))
        }
    }, [snippet, userId])

    useEffect(() => {
        if (!showDeleteModal) {
            deleteBtnRef.current?.focus()
        }
    }, [showDeleteModal])

    useEffect(() => {
        document.title = snippet ? `${snippet.title} — Code Snippet` : error ? 'Snippet not found — Code Snippet' : 'Code Snippet'
    }, [snippet, error])

    useEffect(() => {
        if (snippet) {
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', snippet.title)
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', snippet.description)
        }
    }, [snippet])

    if (isLoading) return <SkeletonDetails />
    if (error || !snippet) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-surface-900 dark:to-surface-800 gap-3">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-500 text-lg">Failed to load snippet.</p>
            <button onClick={() => window.location.reload()} className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 active:scale-95 transition">
                Try Again
            </button>
        </div>
    )

    const snippetDeleteClickHandler = async () => {
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        try {
            setIsDeleting(true)
            await deleteSnippet(snippetId!)
            showToast('Successfully deleted!', 'success')
            navigate('/snippets')
        } catch (error) {
            showToast((error as Error).message, 'error')
        } finally {
            setIsDeleting(false)
        }
    }

    const likeHandler = async () => {
        try {
            setIsLiking(true)
            const result = await toggleLike(snippetId!)
            setLikesCount(result.likesCount)
            setLikedByUser(result.likedByUser)
        } catch (err) {
            showToast((err as Error).message, 'error')
        } finally {
            setIsLiking(false)
        }
    }

    const isOwner = userId === snippet.creator

    const forkHandler = async () => {
        try {
            setIsForking(true)
            const forked = await forkSnippet(snippetId!) as { _id: string }
            showToast('Snippet forked!', 'success')
            navigate(`/snippets/${forked._id}/details`)
        } catch (err) {
            showToast((err as Error).message, 'error')
        } finally {
            setIsForking(false)
        }
    }

    const exportToGist = async () => {
        const token = window.prompt('Enter your GitHub personal access token (needs "gist" scope):')
        if (!token) return
        try {
            setIsExporting(true)
            const res = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: snippet.description,
                    public: snippet.visibility === 'public',
                    files: {
                        [`${snippet.title.replace(/\s+/g, '-')}.${snippet.language?.toLowerCase() === 'javascript' ? 'js' : snippet.language?.toLowerCase() || 'txt'}`]: {
                            content: snippet.code,
                        },
                    },
                }),
            })
            if (res.ok) {
                const gist = await res.json()
                showToast(`Gist created! ${gist.html_url}`, 'success')
            } else {
                showToast('Failed to create gist. Check your token.', 'error')
            }
        } catch {
            showToast('Failed to create gist', 'error')
        } finally {
            setIsExporting(false)
        }
    }

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(snippet.code)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
            showToast('Code copied!', 'success')
        } catch {
            showToast('Failed to copy code', 'error')
        }
    }

    return (
        <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-surface-900 dark:to-surface-800">
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-surface-800 shadow-lg rounded-lg">
            <Breadcrumbs items={[
                { label: 'Snippets', href: '/snippets' },
                { label: snippet.title },
            ]} />
            <div className="border-b dark:border-surface-600 pb-4 mb-4">
                <h2 className="text-3xl font-bold text-primary-700 dark:text-primary-300">{snippet.title}</h2>
            </div>

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">Language</h3>
                <span className="inline-block bg-indigo-100 dark:bg-surface-700 text-primary-700 dark:text-primary-300 text-sm font-medium px-3 py-1 rounded-full">
                    {snippet.language}
                </span>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{snippet.description}</p>
            </div>

            <div className="mb-6" role="code" aria-label={`${snippet.language} code snippet`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Code</h3>
                    <button
                        onClick={copyCode}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-gray-100 dark:bg-surface-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-surface-600 transition"
                        aria-label={isCopied ? 'Code copied' : 'Copy code to clipboard'}
                    >
                        <FaCopy className="w-3.5 h-3.5" />
                        {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <CodeEditor
                    value={snippet.code}
                    language={snippet.language}
                    readOnly
                    isDark={isDark}
                />
            </div>

            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <button
                            onClick={likeHandler}
                            disabled={isLiking}
                            aria-label={likedByUser ? 'Unlike this snippet' : 'Like this snippet'}
                            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors active:scale-95 ${likedByUser ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300" : "bg-gray-100 dark:bg-surface-700 text-gray-600 dark:text-gray-300"}`}
                        >
                            {likedByUser ? <FaHeart /> : <FaRegHeart />}
                            {likesCount} {likesCount === 1 ? "Like" : "Likes"}
                        </button>
                    ) : (
                        <span className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-gray-100 dark:bg-surface-700 text-gray-400 dark:text-gray-500">
                            <FaRegHeart />
                            {likesCount} {likesCount === 1 ? "Like" : "Likes"}
                        </span>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    {isAuthenticated && (
                        <button
                            onClick={forkHandler}
                            disabled={isForking}
                            className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 dark:hover:bg-surface-700 transition-colors disabled:opacity-50"
                        >
                            {isForking ? 'Forking...' : 'Fork'}
                        </button>
                    )}
                    <button
                        onClick={exportToGist}
                        disabled={isExporting}
                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-surface-600 rounded-md hover:bg-gray-50 dark:hover:bg-surface-700 transition-colors disabled:opacity-50"
                    >
                        {isExporting ? 'Exporting...' : 'Gist'}
                    </button>
                    <Link to={`/snippets/${snippetId}/comments`} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors">
                        Comments
                    </Link>
                    {isOwner && (
                        <div className="flex justify-end gap-2">
                            <Link to={`/snippets/${snippetId}/edit`} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors">
                                Edit
                            </Link>
                            <button ref={deleteBtnRef} onClick={snippetDeleteClickHandler} aria-label="Delete snippet" className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors">
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Delete snippet"
                message={`Are you sure you want to delete "${snippet.title}"?`}
                confirmLabel={isDeleting ? 'Deleting...' : 'Delete'}
                variant="danger"
                isConfirming={isDeleting}
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
            </div>
        </div>
    );
}
